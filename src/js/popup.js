"use strict";

import * as lib from "./lib.js";

function initToggleBtn(elementId) {
    const toggleBtn = document.getElementById(elementId);
    (async () => {
        const isChecked = await lib.getConfSetting(elementId);
        console.log("isChecked set to ", isChecked);
        toggleBtn.checked = isChecked;
    })();

    toggleBtn.addEventListener("change", async () => {
        await lib.setConfSetting(elementId, toggleBtn.checked);
        console.log("yaa", toggleBtn.checked, await lib.getConfSetting(elementId));
    
    });
}

function initSelects() {
    const selects = document.querySelectorAll('select').forEach((el) => {
        console.log("ossp [popup] processing select #", el.id);
        const settingId = el.id;
        (async () => {
            const settingValue = await lib.getConfSetting(settingId);
            console.log(settingId, " set to ", settingValue);
            el.value = settingValue;
        })();

        el.addEventListener("change", async () => {
            const settingValue = 'boolean' === el.getAttribute('data-type') ? el.value === "true" : el.value;
            await lib.setConfSetting(settingId, settingValue);
            console.log(settingId, " was set to ", settingValue);
        });
    });
}

initToggleBtn(lib.PLUS_ALIASING);
initToggleBtn(lib.DOTS_ALIASING);
initToggleBtn(lib.NAME_HANDLING_TARGET_NAMES);
initToggleBtn(lib.NAME_HANDLING_TARGET_ADDRESSES);
initSelects();