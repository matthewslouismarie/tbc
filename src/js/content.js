"use strict";

var lib;

const TIME_K = "submissionTime";
const EMAIL_RE = /^([^.\s][^@\s]*)@(((gmail)|(yahoo)|(outlook)|(proton))\.[a-z]+)$/;
const ROLE_EMAIL = "email";
const ROLE_TEL = "tel";
const ROLE_NAME = "name";
const ROLE_GIVEN_NAME = "given-name";
const ROLE_ADDITIONAL_NAME = "additional-name";
const ROLE_FAMILY_NAME = "family-name";

// Localised
const NAME_TEXTS = [
    'first name',
    'given name',
    'second name',
    'alternate name',
    'family name',
    'christian name',
    'name',
    'prénom',
    'nom',
    'deuxième prénom',
    'prénoms',
    'nom de famille',
];

function log(msg) {
    console.log("ossp [lib] ", msg);
}

function parseForm(form) {
    console.log("parseForm called.");
    const submitBtn = form.querySelector("button[type=submit], input[type=submit], [role=button], [aria-label=Submit]");
    submitBtn.addEventListener("click", (event) => onFormSubmission(event, form));
}

async function onFormSubmission(event, form) {
    console.log("onFormSubmission called.");
    // event.preventDefault();
    // event.stopPropagation();
    // event.stopImmediatePropagation();
    const siteUserData = {};
    siteUserData[TIME_K] = Date.now();
    
    for (const input of form.querySelectorAll("input")) {
        const role = getInputRole(input);
        console.log("ossp [onFormSubmission] Processing role: ", role);
        const emailMatches = input.value.match(EMAIL_RE);
        if (null !== emailMatches && emailMatches.length > 0) {
            console.log("Email detected, regex matches are: ", emailMatches);
            
            let emailLeftPart = emailMatches[1];

            const plusAliasingOn =  await lib.getConfSetting(lib.PLUS_ALIASING);
            console.log("plusAliasingOn", plusAliasingOn);
            if (plusAliasingOn) {
                emailLeftPart = emailLeftPart + "+" + lib.getRandomInt(99999);
            }

            const dotsAliasingOn =  await lib.getConfSetting(lib.DOTS_ALIASING);
            console.log("dotsAliasingOn", dotsAliasingOn);
            if (dotsAliasingOn) {
                emailLeftPart = emailLeftPart.replaceAll(".", "");
                let i = lib.getRandomInt(emailLeftPart.length - 1) + 1;
                while (i < emailLeftPart.length) {
                    console.log(i);
                    emailLeftPart = emailLeftPart.substring(0, i) + "." + emailLeftPart.substring(i);
                    console.log("emailLeftPart", emailLeftPart);
                    i += 2 + lib.getRandomInt(emailLeftPart.length - 2);
                }
            }
            input.value = emailLeftPart + "@" + emailMatches[2];
        } else if (ROLE_NAME === role || ROLE_GIVEN_NAME === role || ROLE_FAMILY_NAME === role || ROLE_ADDITIONAL_NAME == role) {
            if (await lib.getConfSetting(lib.NAME_HANDLING_TARGET_NAMES)) {
                input.value = await handleName(input.value);
            }
        } else if (role.includes("address")) {
            if (await lib.getConfSetting(lib.NAME_HANDLING_TARGET_ADDRESSES)) {
                input.value = await handleName(input.value);
            }
        }

        log(`siteUserData[${role}]: ${input.value}`);
        siteUserData[role] = input.value;
    };
    const userData = (await chrome.storage.sync.get([lib.USER_DATA_KEY]))[lib.USER_DATA_KEY] ?? {};
    const domainName = '' !== window.location.hostname ? window.location.hostname : 'static_file';
    userData[domainName] = siteUserData;
    console.log("userData about to be logged is", userData);
    console.log("siteUserData is", siteUserData);
    chrome.storage.sync.set({[lib.USER_DATA_KEY]: userData}).then(() => {
        log("userData has been stored.");
        chrome.storage.sync.get([lib.USER_DATA_KEY]).then((value) => {
            console.log("Stored user data is ", value[lib.USER_DATA_KEY]);
        });
    });
}

// maybe check by accepted input role (e.g. name and spe (first name, etc.) based on autocomplete or label, then email based on autocomplete or label, etc.)
function getInputRole(input) {
    console.log("ossp [getInputRole] Called with ", input);
    const label = document.querySelector(`label[for="${input.id}"]`) ?? input.parentElement?.nodeName === 'LABEL' ? input.parentElement : null;
    if (null !== input.getAttribute("autocomplete")) {
        return input.getAttribute("autocomplete");
    } else if ("email" === input.type) {
        return ROLE_EMAIL;
    } else if ("tel" === input.type) {
        return ROLE_TEL;
    } else if (null !== label) {
        const labelText = label.textContent.toLowerCase();
        if (NAME_TEXTS.some((phrase) => labelText.includes(phrase))) {
            console.log(labelText, " is a name.");
            // @todo should return specific type
            return ROLE_NAME;
        }
    } else if (null !== input.getAttribute("aria-labelledby")) {
        const labelIds = input.getAttribute("aria-labelledby").split(" ");
        for (let i = 0; i < labelIds.length; i++) {
            const labelId = labelIds[i]
            const label = document.getElementById(labelId);
            if (null === label) {
                continue;
            }
            const labelText = label.innerText.replaceAll("*", "").trim().toLocaleLowerCase();
            if (NAME_TEXTS.some((phrase) => labelText.includes(phrase))) {
                console.log(labelText, " is a name.");
                // @todo should return specific type
                return ROLE_NAME;
            }
            if (label.innerText) {
                return labelText;
            }
        }
    } else if (null !== input.getAttribute("aria-label")) {
        const labelText = input.getAttribute("aria-label");
        if (NAME_TEXTS.some((phrase) => labelText.includes(phrase))) {
            console.log(labelText, " is a name.");
            // @todo should return specific type
            return ROLE_NAME;
        }
    } else {
        return input.name;
    }
    return null;
}

// @todo move in lib?
async function handleName(name) {
    let nameHandling =  await lib.getConfSetting(lib.NAME_HANDLING);
    console.log("nameHandling", lib.NAME_HANDLING);
    if (lib.NAME_HANDLING_RANDOM === nameHandling) {
        nameHandling = lib.NAME_HANDLING_VALUES[lib.getRandomInt(lib.NAME_HANDLING_VALUES.length - 1)];
    }
    switch (nameHandling) {
        case lib.NAME_HANDLING_ABBR:
            const sep = await lib.getConfSetting(lib.NAME_HANDLING_SEP);
            const toUpperCase = await lib.getConfSetting(lib.NAME_HANDLING_UPPERCASE);
            const tmp = name.match(/(?<!\w)(\w)/g)?.join(sep) ?? name;
            name = toUpperCase ? tmp.toUpperCase() : tmp;
            console.log("name, tmp, toUpperCase", name, tmp, toUpperCase);
            break;
        case lib.NAME_HANDLING_MISTAKES:
            name = lib.addSpellingMistakes(name, .5, .5);
            break;
        case lib.NAME_HANDLING_SHORT:
            name = name.substring(0, lib.getRandomInt(name.length) + 1);
            break;
    }
    return name;
}


async function loadModule() {
    try {
        // Dynamically import the module
        lib = await import('./lib.js');

        document.querySelectorAll("form").forEach(parseForm);
    } catch (error) {
        console.error("Module loading failed:", error);
    }
}

// Call the async function to load the module
loadModule();