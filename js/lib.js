const CONF = "conf-";
const PLUS_ALIASING = "plus-aliasing";

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