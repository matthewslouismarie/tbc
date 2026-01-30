"use strict";

export const CONF = "conf-";
export const PLUS_ALIASING = "plus-aliasing";
export const DOTS_ALIASING = "dots-aliasing";
export const NAME_HANDLING = "name-handling";
export const NAME_HANDLING_AS_IS = "";
export const NAME_HANDLING_SHORT = "shorten";
export const NAME_HANDLING_ABBR = "abbreviate";
export const NAME_HANDLING_VARIATIONS = "add-variations";
export const NAME_HANDLING_MISTAKES = "add-spelling-mistakes";
export const NAME_HANDLING_RANDOM = "random";
export const NAME_HANDLING_VALUES = [
    NAME_HANDLING_SHORT,
    NAME_HANDLING_ABBR,
    NAME_HANDLING_VARIATIONS,
    NAME_HANDLING_MISTAKES,
    NAME_HANDLING_RANDOM,
];
export const NAME_HANDLING_SEP = "name-handling-sep";
export const NAME_HANDLING_UPPERCASE = "name-handling-uppercase";
export const NAME_HANDLING_TARGET_NAMES = "name-handling-target-names";
export const NAME_HANDLING_TARGET_ADDRESSES = "name-handling-target-addresses";

export const CONF_SCHEMA =  {
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
    [NAME_HANDLING_TARGET_NAMES]: {
        checker: (value) => typeof value === "boolean",
        default: true
    },
    [NAME_HANDLING_TARGET_ADDRESSES]: {
        checker: (value) => typeof value === "boolean",
        default: true
    }
};

export function addSpellingMistakes(string, switchCasingProba = 1, duplicateLetterProba = 1) {
    if (switchCasingProba > 0) {
        string = string.split('').map((letter) => Math.random() < switchCasingProba ? switchCasing(letter) : letter).join('');
    }
    string = string.split(" ").map((word) => {
        if (duplicateLetterProba > 0 && Math.random() < duplicateLetterProba) {
            const pos = getRandomInt(word.length);
            word = word.slice(0, pos) + word[pos] + word.slice(pos);
        }
        return word;
    }).join(' ');
    return string;
}

// Default to false if setting does not exist.
export function getConfSetting(key) {
    return chrome.storage.local.get(CONF + key).then((setting) => {
        const value = setting[CONF + key];
        console.log("ossp [lib][getConfSetting] ", key, " has raw value ", value);
        if (CONF_SCHEMA[key].checker(value)) {
            return value;
        }
        return CONF_SCHEMA[key].default;
    });
}

export function switchCasing(letter) {
    if (letter.toLocaleUpperCase() === letter) {
        return letter.toLocaleLowerCase();
    }
    return letter.toLocaleUpperCase();
}

export function setConfSetting(key, value) {
    if (!Object.keys(CONF_SCHEMA).includes(key)) {
        throw Error(`Setting "${key}" is unknown.`);
    }
    console.log("ossp [lib][setConfSetting] ", key, " set to raw value ", value);
    return chrome.storage.local.set({
        [CONF + key]: value,
    });
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}