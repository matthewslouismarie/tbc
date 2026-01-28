"use strict";

const CONF = "conf-";
const PLUS_ALIASING = "plus-aliasing";
const DOTS_ALIASING = "dots-aliasing";
const NAME_HANDLING = "name-handling";
const NAME_HANDLING_AS_IS = "";
const NAME_HANDLING_SHORT = "shorten";
const NAME_HANDLING_ABBR = "abbreviate";
const NAME_HANDLING_VARIATIONS = "add-variations";
const NAME_HANDLING_MISTAKES = "add-spelling-mistakes";
const NAME_HANDLING_VALUES = [
    NAME_HANDLING_SHORT,
    NAME_HANDLING_ABBR,
    NAME_HANDLING_VARIATIONS,
    NAME_HANDLING_MISTAKES,
];
const NAME_HANDLING_SEP = "name-handling-sep";
const NAME_HANDLING_UPPERCASE = "name-handling-uppercase";

const CONF_SCHEMA =  {
    [PLUS_ALIASING]: {
        checker: (value) => typeof value === "boolean",
        default: true
    },
    [DOTS_ALIASING]: {
        checker: (value) => typeof value === "boolean",
        default: true
    },
    [NAME_HANDLING]: {
        checker: (value) => NAME_HANDLING_VALUES.includes(value),
        default: NAME_HANDLING_AS_IS
    },
    [NAME_HANDLING_SEP]: {
        checker: (value) => typeof value === "string" || value instanceof String,
        default: ""
    },
    [NAME_HANDLING_UPPERCASE]: {
        checker: (value) => typeof value === "boolean",
        default: true
    },
};


// Default to false if setting does not exist.
function getConfSetting(key) {
    return chrome.storage.local.get(CONF + key).then((setting) => {
        const value = setting[CONF + key];
        console.log("ossp [lib][getConfSetting] ", key, " has raw value ", value);
        if (CONF_SCHEMA[key].checker(value)) {
            return value;
        }
        return CONF_SCHEMA[key].default;
    });
}

function setConfSetting(key, value) {
    if (!Object.keys(CONF_SCHEMA).includes(key)) {
        throw Error(`Setting "${key}" is unknown.`);
    }
    console.log("ossp [lib][setConfSetting] ", key, " set to raw value ", value);
    return chrome.storage.local.set({
        [CONF + key]: value,
    });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}