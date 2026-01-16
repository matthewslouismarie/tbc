const TIME_K = "submissionTime";
const EMAIL_RE = /([^.\s][^.@\s]*)@(((gmail)|(yahoo)|(outlook)|(proton))\.)[a-z]+$/;

function parseForm(form) {
    const submitBtn = form.querySelector("button[type=submit], input[type=submit], [role=button], [aria-label=Submit]");
    submitBtn.addEventListener("click", (event) => onFormSubmission(event, form));
}

function onFormSubmission(event, form) {
    // console.log(form);
    // event.preventDefault();
    // event.stopPropagation();
    // event.stopImmediatePropagation();
    const userData = {};
    userData[TIME_K] = Date.now();
    form.querySelectorAll("input").forEach(async (input) => {
        const role = getInputRole(input);
        const emailMatches = input.value.match(EMAIL_RE);
        const plusAliasingOn =  await getConfSetting(PLUS_ALIASING);
        console.log("plusAliasingOn", plusAliasingOn);
        if (null !== emailMatches && emailMatches.length > 0 && plusAliasingOn) {
            console.log("Email detected");
            input.value = emailMatches[1] + "+" + getRandomInt(99999) + "@" + emailMatches[2];
            
        } else {
        }
        userData[role] = input.value;
    });
    console.log(userData);
    // form.querySelectorAll("input").forEach((input) => console.log(input));
    // form.querySelectorAll("textarea").forEach()
    // form.querySelectorAll("select").forEach()
    chrome.storage.local.set({[window.location.hostname]: userData});
    // .then((p) => (chrome.storage.local.get(window.location.hostname).then((p) => console.log(p[window.location.hostname]))));

    // restore default
}

function getInputRole(input) {
    // console.log(input.value);
    // if (input)
    if (null !== input.getAttribute("role")) {
        console.log("non-null role: ", input.getAttribute("role"));
        return input.getAttribute("role");
    } else if (null !== input.getAttribute("aria-labelledby")) {
        const labelIds = input.getAttribute("aria-labelledby").split(" ");
        for (let i = 0; i < labelIds.length; i++) {
            const labelId = labelIds[i]
            const label = document.getElementById(labelId);
            if (null === label) {
                continue;
            }
            const labelText = label.innerText.replaceAll("*", "").trim();
            if (label.innerText) {
                return labelText;
            }
        }
    } else {
        return input.name;
    }
    return null;
}

document.querySelectorAll("form").forEach(parseForm);
chrome.storage.local.get(window.location.hostname).then((p) => console.log(p[window.location.hostname]));

console.log(chrome.storage.local.get("conf-plus-aliasing").then((setting) => setting["conf-plus-aliasing"] ?? false));
console.log("setting", (async () => { return await getConfSetting("erutsiuensteu"); })());
