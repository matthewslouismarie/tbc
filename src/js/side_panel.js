"use strict";

import * as lib from "./lib.js";

async function init() {
    const siteTpl = document.getElementById("site-tpl");
    const attrTpl = document.getElementById("attr-tpl");

    const userData = (await chrome.storage.sync.get([lib.USER_DATA_KEY]))[lib.USER_DATA_KEY];

    Object.keys(userData).forEach(domainName => {
        console.log(domainName);
        const siteUserData = userData[domainName];

        const siteEl = document.importNode(siteTpl.content, true);

        siteEl.querySelector("[data-site-attr=name]").innerText = domainName;
        const list = siteEl.querySelector("[data-site-attr=properties]");

        Object.keys(siteUserData).forEach((name) => {
            const attrEl = document.importNode(attrTpl.content, true);
            attrEl.querySelector("[data-list-attr=name]").innerText = name;
            attrEl.querySelector("[data-list-attr=value]").innerText = siteUserData[name];
            list.appendChild(attrEl);
        });

        document.getElementById("main").appendChild(siteEl);
    });

    document.getElementById("searchbar").oninput = (ev) => {
        console.log(ev.target);
        const terms = ev.target.value.split(" ");
        for (const t of terms) {
            for (const el of document.querySelectorAll("[data-site]")) {
                if (!el.innerText.includes(t)) {
                    el.hidden = true;
                } else {
                    el.hidden = false;
                }
            }
        }
    };
}

init();