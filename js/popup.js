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

initToggleBtn(PLUS_ALIASING);