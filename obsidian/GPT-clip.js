// ==UserScript==
// @name         GPT-clip
// @namespace    https://chat.openai.com/
// @version      0.4.1
// @description  Отладочная версия: Share → Markdown → Obsidian + логи в консоли
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

    const vault = "ChatGPT-vault";
    const folder = "GPT-Clip";

    function log(msg) {
        console.log(`[GPT→Obsidian DEBUG]: ${msg}`);
    }

    function nowStr() {
        const d = new Date();
        return d.toISOString().slice(0, 10);  // YYYY-MM-DD
    }

    function waitForShareLink(cb) {
        log("⏳ Ждём генерацию share-ссылки…");
        const interval = setInterval(() => {
            const input = document.querySelector("input[readonly][value^='https://chatgpt.com/share/']");
            if (input) {
                clearInterval(interval);
                log("✅ Ссылка найдена: " + input.value);
                cb(input.value);
            }
        }, 1000);
    }

    function clickShare(cb) {
        const btn = [...document.querySelectorAll("button")].find(el => el.textContent.includes("Share"));
        if (!btn) {
            log("❌ Кнопка Share не найдена!");
            alert("Кнопка Share не найдена. Открой чат полностью.");
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
        GM_notification({ title: "ChatGPT", text: "Ссылка скопирована и открыта в Obsidian", timeout: 3000 });

        log("🚀 Открываем Obsidian URL: " + url);
        window.open(url);
    }

    function insertButton() {
        log("🧪 Пытаемся вставить кнопку…");

        let target = document.querySelector("div.sticky.top-0");
        if (!target) {
            log("⚠️ Хедер не найден. Добавляем кнопку в body.");
            target = document.body;
        }

        if (document.getElementById("gpt-md-clip")) {
            log("🔁 Кнопка уже добавлена");
            return;
        }

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
            background: #e5e5e5;
            border: 1px solid #999;
            border-radius: 6px;
            cursor: pointer;
        `;

        btn.onclick = () => {
            log("🖱 Клик по кнопке → создаём share-ссылку");
            clickShare((link) => {
                const title = `ChatGPT Clip — ${nowStr()}`;
                makeObsidianNote(title, link);
            });
        };

        target.appendChild(btn);
        log("✅ Кнопка вставлена");
    }

    // Автоинициализация через MutationObserver
    const observer = new MutationObserver(() => {
        insertButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    log("📡 Скрипт инициализирован");
})();
