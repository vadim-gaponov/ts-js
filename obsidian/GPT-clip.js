// ==UserScript==
// @name         GPT-clip
// @namespace    https://chat.openai.com/
// @version      0.2
// @description  Генерация share-ссылки + создание заметки в Obsidian
// @source       https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/GPT-clip.js
// @downloadURL  https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/GPT-clip.js
// @updateURL    https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/GPT-clip.js
// @author       Sol
// @match        https://chat.openai.com/c/*
// @match        https://chatgpt.com/c/*
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

(function () {
    'use strict';

    const vault = "ChatGPT";
    const folder = "3.GPT-Clip";

    function nowStr() {
        const d = new Date();
        return d.toISOString().slice(0, 10);  // YYYY-MM-DD
    }

    function waitForShareLink(cb) {
        const interval = setInterval(() => {
            const input = document.querySelector("input[readonly][value^='https://chatgpt.com/share/']");
            if (input) {
                clearInterval(interval);
                cb(input.value);
            }
        }, 1000);
    }

    function clickShare(cb) {
        const btn = [...document.querySelectorAll("button")].find(el => el.textContent.includes("Share"));
        if (!btn) return alert("Кнопка Share не найдена");
        btn.click();
        waitForShareLink(cb);
    }

    function makeObsidianNote(title, link) {
        const md = `# ${title}\n\n[🧠 GPT-сессия](${link})\n\nТемы: `;

        const url = `obsidian://new?vault=${encodeURIComponent(vault)}&name=${encodeURIComponent(folder + "/" + title)}&content=${encodeURIComponent(md)}`;

        GM_setClipboard(md);
        GM_notification({ title: "ChatGPT", text: "Markdown скопирован и отправлен в Obsidian", timeout: 3000 });
        window.open(url);
    }

    function insertButton() {
        const header = document.querySelector("div.sticky.top-0");
        if (!header || document.getElementById("gpt-md-clip")) return;

        const btn = document.createElement("button");
        btn.id = "gpt-md-clip";
        btn.textContent = "📄 Share → Obsidian";
        btn.style.cssText = `
            margin-left: 1rem;
            padding: 4px 8px;
            font-size: 13px;
            background: #f5f5f5;
            border-radius: 6px;
            cursor: pointer;
        `;

        btn.onclick = () => {
            clickShare((link) => {
                const title = `ChatGPT Clip — ${nowStr()}`;
                makeObsidianNote(title, link);
            });
        };

        header.appendChild(btn);
    }

    insertButton() ;
    const observer = new MutationObserver(insertButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
