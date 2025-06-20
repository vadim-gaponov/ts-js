// ==UserLibrary==
// @name        Common Utils
// @namespace   http://tampermonkey.net/
// @version     6.1
// @description common utils
// @license     MIT
// require      "@grant GM_setClipboard"
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

const Utils = (() => {

    console.debug("obsidian/utils: at '" + location.href + "'");
    function safeFileName(name) {
        return name.replace(/[\\\/:*?"<>|#]/g, '›').replace(/\s+/g, ' ').trim();
    }

    function dateTimeString() {
        const now = new Date();
        return now.toISOString().slice(0, 19).replace('T', ' ');
    }

    function expandSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const newRange = document.createRange();
        const wordChar = /[\p{L}\p{N}_]/u;

        function adjustBoundary(container, offset, direction) {
            while (container.nodeType !== Node.TEXT_NODE) {
                const idx = direction === -1 ? offset - 1 : offset;
                container = container.childNodes[idx];
                offset = direction === -1 ? (container?.textContent?.length ?? 0) : 0;
                if (!container) return { container: null, offset: 0 };
            }

            const text = container.textContent;
            let idx = offset;

            if (direction === -1) {
                while (idx > 0 && wordChar.test(text.charAt(idx - 1))) idx--;
            } else {
                while (idx < text.length && wordChar.test(text.charAt(idx))) idx++;
            }

            return { container, offset: idx };
        }

        const start = adjustBoundary(range.startContainer, range.startOffset, -1);
        const end   = adjustBoundary(range.endContainer, range.endOffset, 1);

        if (start.container && end.container) {
            newRange.setStart(start.container, start.offset);
            newRange.setEnd(end.container, end.offset);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }

    }

    function encodePart( text ) {
        return encodeURIComponent(text)
               .replaceAll( "\\(", "%28" )
               .replaceAll( "\\)", "%29" )
               .replaceAll( ",", "%2C" )
               .replaceAll( "-", "%2D" ) ;
    }

    function textRange(fullClip,len) {
        let max = len;
        if( typeof max === 'undefined' || !max || max <= 0 ) {
            max = 36 ;
        }

        console.debug("obsidian/utils.textRange: max == " + max);
        let probe = fullClip.slice(0, max);
        let index = probe.lastIndexOf(" ");
        if( index > 0 ) {
            probe = probe.slice(0, index);
        }
        const head = encodePart(probe);

        probe = fullClip.slice(-max);
        index = probe.indexOf(" ");
        if( index > 0 ) {
            probe = probe.slice(index + 1, max);
        }
        const tail = encodePart(probe);

        return `${head},${tail}`;
    }

    function selectionToURI(selection,len) {
        const refRange = textRange( selection );
        const baseUrl  = location.href.split("#")[0];
        return `${baseUrl}#:~:text=${refRange}`;
    }

    async function getClipboardText() {
        try {
            return await navigator.clipboard.readText();
        } catch {
            return '';
        }
    }

    function setClipboard(text) {
        if( typeof GM_setClipboard === 'function' ) {
            GM_setClipboard(text);
        }
        else {
            console.warn( "GM_setClipboard недоступен, используем navigator.clipboard" ) ;
            navigator.clipboard.writeText?.(text).catch(
                err => { alert("Ошибка копирования в буфер: " + err); }
            ) ;
        }
    }



    return {
        safeFileName,
        dateTimeString,
        expandSelection,
        selectionToURI,
        getClipboardText,
        setClipboard
    };
})();

// <EOF>
