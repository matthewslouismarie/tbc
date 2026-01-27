"use strict";

function initToggleBtn(elementId) {
    const toggleBtn = document.getElementById(elementId);
    (async () => {
        const isChecked= await getConfSetting(elementId);
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
        const settingId = el.id;
        (async () => {
            const settingValue = await getConfSetting(settingId);
            console.log(settingId, " set to ", settingValue);
            el.value = settingValue;
        })();

        el.addEventListener("change", async () => {
            await setConfSetting(settingId, el.value);
            console.log(settingId, " was set to ", el.value);
        });
    });
}

initToggleBtn(PLUS_ALIASING);
initToggleBtn(DOTS_ALIASING);
initSelects();