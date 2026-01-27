"use strict";

const CONF = "conf-";
const PLUS_ALIASING = "plus-aliasing";
const DOTS_ALIASING = "dots-aliasing";
const NAME_HANDLING = "name-handling";
const NAME_HANDLING_SHORT = "shorten";
const NAME_HANDLING_ABBR = "abbreviate";
const NAME_HANDLING_VARIATIONS = "add-variations";
const NAME_HANDLING_MISTAKES = "add-spelling-mistakes";


// Default to false if setting does not exist.
function getConfSetting(key) {
    return chrome.storage.local.get(CONF + key).then((setting) => setting[CONF + key] ?? false);
}

function setConfSetting(key, value) {
    return chrome.storage.local.set({
        [CONF + key]: value,
    });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}