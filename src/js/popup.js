"use strict";

import {
    DOTS_ALIASING,
    PLUS_ALIASING,
    getConfSetting,
    getRandomInt,
} from "./lib.js";

function initToggleBtn(elementId) {
    const toggleBtn = document.getElementById(elementId);
    (async () => {
        const isChecked = await getConfSetting(elementId);
        console.log("isChecked set to ", isChecked);
        toggleBtn.checked = isChecked;
    })();

    toggleBtn.addEventListener("change", async () => {
        await setConfSetting(elementId, toggleBtn.checked);
        console.log("yaa", toggleBtn.checked, await getConfSetting(elementId));
    
    });
}

function initSelects() {
    const selects = document.querySelectorAll('select').forEach((el) => {
        console.log("ossp [popup] processing select #", el.id);
        const settingId = el.id;
        (async () => {
            const settingValue = await getConfSetting(settingId);
            console.log(settingId, " set to ", settingValue);
            el.value = settingValue;
        })();

        el.addEventListener("change", async () => {
            const settingValue = 'boolean' === el.getAttribute('data-type') ? el.value === "true" : el.value;
            await setConfSetting(settingId, settingValue);
            console.log(settingId, " was set to ", settingValue);
        });
    });
}

initToggleBtn(PLUS_ALIASING);
initToggleBtn(DOTS_ALIASING);
initSelects();