// ==UserLibrary==
// @name        Obsidian Main routins
// @namespace   http://tampermonkey.net/
// @version     6.1
// @description Obsidian utils and main proc
// @license     MIT
// @author      Sol=
// ==/UserLibrary==

/*!
MIT License

Copyright (c) 2025 Sol=

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const Main = (() => {

    console.debug("obsidian/main: at '" + location.href + "'");

    function getObsidianLink() {
        if( typeof document.obsidianLink === 'undefined' || !document.obsidianLink ) {
            console.debug("Obsidian Clip: new 'document.obsidianLink'");
            document.obsidianLink = document.createElement('a');
            document.obsidianLink.style.display = 'none';
            document.body.appendChild(document.obsidianLink);
        }
        return document.obsidianLink;
    }

    function openObsidianURI(uri) {
        const link = getObsidianLink();
        console.debug(`Obsidian Clip: open [${uri}]`);

        link.href = uri;
        link.click();
    }


    function makeHeader( rawTitle ) {
        if( typeof rawTitle === 'undefined' ) {
            rawTitle = '' ;
        }
        const baseUrl = location.href.split("#")[0];
        const nowDate = new Date();
        const isoDate = nowDate.toISOString().slice(0, 19).replace("T", " ");

        return `---
title: "${rawTitle}"
source: "${baseUrl}"
created: "${isoDate}"
tags: [webclip, gpt]
---
`;
    }

    async function clipToObsidian() {
        try {
            Utils.expandSelection();
            let text = window.getSelection().toString().trim();

            if (!text) {
                text = await Utils.getClipboardText();
                if (!text) {
                    alert("Нет текста в выделении или буфере обмена.");
                    return;
                }
            }


            const rawTitle   = document.title.trim() || 'Untitled';
            const rawDomain  = location.hostname.replace(/^www\./, '');
            const title      = Utils.safeFileName(rawTitle);
            const domain     = Utils.safeFileName(rawDomain);
            const date       = Utils.dateTimeString();

            const noteUrl    = Utils.selectionToURI(text);

            const tail       = `\n\n📌 [ref](${noteUrl})`;
            const filename   = `www/${domain}/${title} ${date.replaceAll(":","-")}`;
            console.debug(`Obsidian Clip: path [${filename}]`);

            Utils.setClipboard(makeHeader( rawTitle ) + text + tail);
            const uri = `obsidian://new?file=${encodeURIComponent(filename)}&clipboard`;
            openObsidianURI(uri);
        } 
        catch( error ) {
            console.error(error);
        }
    }

    return {
        clipToObsidian
    };
})();

// <EOF>
