/*

The MIT License (MIT)

Copyright (c) 2015 Thomas Bluemel

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

import { Document } from "../Document";
import { Helper } from "../Helper";
import { Chp } from "../parser/Containers";

export class RenderChp {
    public _chp: Chp;

    constructor(chp: Chp) {
        this._chp = chp;
    }

    public apply(doc: Document, el: HTMLElement): void {
        Helper.log("[rtf] RenderChp: " + el.textContent);
        Helper.log("[rtf] RenderChp apply: " + JSON.stringify(this._chp));
        if (this._chp.bold) {
            el.style.fontWeight = "bold";
        }
        if (this._chp.italic) {
            el.style.fontStyle = "italic";
        }
        if (Object.prototype.hasOwnProperty.call(this._chp, "fontfamily") && doc._fonts[this._chp.fontfamily]) {
            const fontFamily = doc._fonts[this._chp.fontfamily].fontname.replace(";", "");
            if (fontFamily !== "Symbol") {
                el.style.fontFamily = fontFamily;
            }
        }

        const deco = [];
        if (this._chp.underline !== Helper.UNDERLINE.NONE) {
            deco.push("underline");
        }
        if (this._chp.strikethrough || this._chp.dblstrikethrough) {
            deco.push("line-through");
        }

        if (deco.length > 0) {
            el.style.textDecoration = deco.join(" ");
        }
        if (this._chp.colorindex !== 0) {
            const color = doc._lookupColor(this._chp.colorindex);
            if (color != null) {
                el.style.color = Helper._colorToStr(color);
            }
        }
        if (this._chp.highlightindex !== 0) {
            const color = doc._lookupColor(this._chp.highlightindex);
            if (color != null) {
                el.style.backgroundColor = Helper._colorToStr(color);
            }
        }
        el.style.fontSize = Math.floor(this._chp.fontsize / 2) + "pt";

        if (this._chp.supersubscript === Helper.SUPERSUBSCRIPT.SUPERSCRIPT) {
            el.style.verticalAlign = "super"
        } else if (this._chp.supersubscript === Helper.SUPERSUBSCRIPT.SUBSCRIPT) {
            el.style.verticalAlign = "sub"
        }

        if (this._chp.supersubscript === Helper.SUPERSUBSCRIPT.SUPERSCRIPT || this._chp.supersubscript === Helper.SUPERSUBSCRIPT.SUBSCRIPT) {
            el.style.fontSize = Math.floor((this._chp.fontsize / 2) - 2) + "pt"
        }
    }
}
