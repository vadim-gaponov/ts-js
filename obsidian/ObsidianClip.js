// ==UserScript==
// @name         Obsidian Clip draft 3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Расширяет селект, добавляет в Obsidian: ленивое создание ссылки, структура по домену + безопасные имена + Text Fragment 📌🧠
// @source       https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/ObsidianClip.js
// @downloadURL  https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/ObsidianClip.js
// @updateURL    https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/ObsidianClip.js
// @require      https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/utils.js
// @require      https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/main.js
// @author       Sol=
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

// <EOF>
