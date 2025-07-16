// ==UserScript==
// @name         GPT-clip
// @namespace    https://chat.openai.com/
// @version      0.4.2
// @description  Генерация share-ссылки + Markdown-заметка в Obsidian с защитой от двойного клика и улучшенным поиском ссылки 📄🔗📥
// @source       https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/GPT-clip.js
// @downloadURL  https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/GPT-clip.js
// @updateURL    https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/GPT-clip.js
// @author       Sol
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

(function () {
    'use strict';

    const vault = "ChatGPT";
    const folder = "3.GPT-Clip";

    let isProcessing = false;

    function log(msg) {
        console.log(`[GPT→Obsidian]: ${msg}`);
    }

    function nowStr() {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    }

    function waitForShareLink(cb) {
        log("⏳ Ждём появления share-ссылки…");

        const interval = setInterval(() => {
            const el = [...document.querySelectorAll("input[readonly], textarea, div")]
                .find(e => {
                    const val = (e.value || e.innerText || "").trim();
                    return val.startsWith("https://chatgpt.com/share/");
                });

            if (el) {
                clearInterval(interval);
                const link = (el.value || el.innerText).trim();
                log("✅ Share-ссылка найдена: " + link);
                cb(link);
            }
        }, 500);
    }

    function clickShare(cb) {
        const btn = [...document.querySelectorAll("button")].find(el => el.textContent.includes("Share"));
        if (!btn) {
            log("❌ Кнопка Share не найдена!");
            alert("Кнопка Share не найдена. Убедись, что ты в чате.");
            return;
        }
        log("🔘 Нажимаем кнопку Share");
        btn.click();
        waitForShareLink(cb);
    }

    function makeObsidianNote(title, link) {
        const md = `# ${title}\n\n[🧠 GPT-сессия](${link})\n\nТемы: `;
        const url = `obsidian://new?vault=${encodeURIComponent(vault)}&name=${encodeURIComponent(folder + "/" + title)}&content=${encodeURIComponent(md)}`;

        log("📋 Копируем Markdown в буфер");
        GM_setClipboard(md);
        GM_notification({ title: "ChatGPT", text: "Ссылка скопирована и отправлена в Obsidian", timeout: 3000 });

        log("🚀 Открываем Obsidian: " + url);
        window.open(url);

        isProcessing = false;
    }

    function insertButton() {
        let target = document.querySelector("div.sticky.top-0") || document.body;
        if (document.getElementById("gpt-md-clip")) return;

        const btn = document.createElement("button");
        btn.id = "gpt-md-clip";
        btn.textContent = "📄 Share → Obsidian";
        btn.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 9999;
            padding: 6px 10px;
            font-size: 14px;
            background: #f5f5f5;
            border-radius: 6px;
            border: 1px solid #aaa;
            cursor: pointer;
        `;

        btn.onclick = () => {
            if (isProcessing) {
                log("⛔ Уже выполняется. Подожди.");
                return;
            }
            isProcessing = true;
            log("🖱 Клик по кнопке → запускаем процесс");

            clickShare((link) => {
                const title = `ChatGPT Clip — ${nowStr()}`;
                makeObsidianNote(title, link);
            });
        };

        target.appendChild(btn);
        log("✅ Кнопка добавлена");
    }

    // Автоматическая вставка при загрузке
    const observer = new MutationObserver(insertButton);
    observer.observe(document.body, { childList: true, subtree: true });

    log("📡 Скрипт активен и готов");
})();
