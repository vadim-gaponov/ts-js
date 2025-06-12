// ==UserScript==
// @name         Obsidian Clip draft 3.0
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Расширяет селект, добавляет в Obsidian: ленивое создание ссылки, структура по домену + безопасные имена + Text Fragment 📌🧠
// @require      https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/utils.js
// @require      https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/main.js
// @author       🔨🤖🔧
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       context-menu
// ==/UserScript==
//
/* eslint-disable no-multi-spaces */


(function () {
    'use strict';

    console.debug("Obsidian Clip: at '" + location.href + "'");
    Main.clipToObsidian() ;

})();
