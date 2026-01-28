"use strict";

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

function parseForm(form) {
    console.log("parseForm called.");
    const submitBtn = form.querySelector("button[type=submit], input[type=submit], [role=button], [aria-label=Submit]");
    submitBtn.addEventListener("click", (event) => onFormSubmission(event, form));
}

function onFormSubmission(event, form) {
    console.log("onFormSubmission called.");
    // event.preventDefault();
    // event.stopPropagation();
    // event.stopImmediatePropagation();
    const userData = {};
    userData[TIME_K] = Date.now();
    form.querySelectorAll("input").forEach(async (input) => {
        const role = getInputRole(input);
        const emailMatches = input.value.match(EMAIL_RE);
        if (null !== emailMatches && emailMatches.length > 0) {
            console.log("Email detected, regex matches are: ", emailMatches);
            
            let emailLeftPart = emailMatches[1];

            const plusAliasingOn =  await getConfSetting(PLUS_ALIASING);
            console.log("plusAliasingOn", plusAliasingOn);
            if (plusAliasingOn) {
                emailLeftPart = emailLeftPart + "+" + getRandomInt(99999);
            }

            const dotsAliasingOn =  await getConfSetting(DOTS_ALIASING);
            console.log("dotsAliasingOn", dotsAliasingOn);
            if (dotsAliasingOn) {
                emailLeftPart = emailLeftPart.replaceAll(".", "");
                let i = getRandomInt(emailLeftPart.length - 1) + 1;
                while (i < emailLeftPart.length) {
                    console.log(i);
                    emailLeftPart = emailLeftPart.substring(0, i) + "." + emailLeftPart.substring(i);
                    console.log("emailLeftPart", emailLeftPart);
                    i += 2 + getRandomInt(emailLeftPart.length - 2);
                }
            }
            input.value = emailLeftPart + "@" + emailMatches[2];
        } else if (ROLE_NAME === role || ROLE_GIVEN_NAME === role || ROLE_FAMILY_NAME === role || ROLE_ADDITIONAL_NAME == role) {
            const nameHandling =  await getConfSetting(NAME_HANDLING);
            console.log("nameHandling", NAME_HANDLING);
            switch (nameHandling) {
                case NAME_HANDLING_ABBR:
                    const sep = '.';
                    input.value = input.value.match(/(?<!\w)(\w)/g)?.join(sep) ?? input.value;
                    break;
                case NAME_HANDLING_MISTAKES:
                    break;
                case NAME_HANDLING_SHORT:
                    input.value = input.value.substring(1, getRandomInt(input.value.length) - 1);
                    break;
                case NAME_HANDLING_VARIATIONS:
                    break;
            }
        }

        console.log("input.value", input.value);
        
        userData[role] = input.value;
    });
    chrome.storage.local.set({[window.location.hostname]: userData});
}

// maybe check by accepted input role (e.g. name and spe (first name, etc.) based on autocomplete or label, then email based on autocomplete or label, etc.)
function getInputRole(input) {
    const label = document.querySelector(`label[for="${input.id}"]`) ?? input.parentElement.nodeName === 'LABEL' ? input.parentElement : null;
    console.log(label);
    if (null !== input.getAttribute("autocomplete")) {
        return input.getAttribute("autocomplete");
    } else if ("email" === input.type) {
        return ROLE_EMAIL;
    } else if ("tel" === input.type) {
        return ROLE_TEL;
    } else if (null !== label) {
        const labelText = label.textContent.toLowerCase();
        if (EN_NAME_TEXTS.some((phrase) => labelText.includes(phrase))) {
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
            if (EN_NAME_TEXTS.some((phrase) => labelText.includes(phrase))) {
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
        if (EN_NAME_TEXTS.some((phrase) => labelText.includes(phrase))) {
            console.log(labelText, " is a name.");
            // @todo should return specific type
            return ROLE_NAME;
        }
    } else {
        return input.name;
    }
    return null;
}

document.querySelectorAll("form").forEach(parseForm);

(async () => {
    const siteConf = await chrome.storage.local.get(window.location.hostname);
    console.log(window.location.hostname, siteConf);
})();