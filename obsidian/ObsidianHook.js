// ==UserScript==
// @name         Obsidian Hook v7.0.1
// @namespace    http://tampermonkey.net/
// @version      7.0.1
// @description  adds handler for bookmarklet/
// @source       https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/ObsidianHook.js
// @downloadURL  https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/ObsidianHook.js
// @updateURL    https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/ObsidianHook.js
// @require      https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/commons/utils.js
// @require      https://raw.githubusercontent.com/vadim-gaponov/ts-js/main/obsidian/main.js
// @author       Sol=
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==
//
/* eslint-disable no-multi-spaces */


(function () {
    'use strict';

    console.debug("Obsidian Clip: at '" + location.href + "'");
    document.obsidianHook = Main.clipToObsidian ;

})();

// This is the bookmarlet:
// javascript:if%28typeof%20document.obsidianHook%21==%27function%27%29%7Balert%28%22ObsidianHook%20is%20not%20active%21%20%28see%20Obsidian%20Hook%20script%29%22%29%3B%7Delse%7Btry%7Balert%28%22ObsidianHook%21%21%21%22%29%3Bdocument.obsidianHook%28%29%3B%7Dcatch%28e%29%7Bif%28e.message&&e.stack%29%7Balert%28%22ERROR%3A%20%27ObsidianHook%27%20failed%21%20%22+e.message%29%3Bconsole.log%28e.stack%29%3B%20%7Delse%7Bconsole.error%28e%29%3B%7D%20%7D%7D
//

// <EOF>
