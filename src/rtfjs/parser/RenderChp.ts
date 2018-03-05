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
import { Chp } from "./Containers";

export class RenderChp {
    _chp: Chp;

    constructor(chp: Chp) {
        this._chp = chp;
    }

    apply(doc: Document, el: JQuery) {
        if (this._chp.bold) {
            el.css("font-weight", "bold");
        }
        if (this._chp.italic) {
            el.css("font-style", "italic");
        }
        if (this._chp.hasOwnProperty("fontfamily") && doc._fonts[this._chp.fontfamily]) {
            const fontFamily = doc._fonts[this._chp.fontfamily].fontname.replace(";", "");
            if (fontFamily !== "Symbol") {
                el.css("font-family", fontFamily);
            }
        }

        const deco = [];
        if (this._chp.underline != Helper.UNDERLINE.NONE) {
            deco.push("underline");
        }
        if (this._chp.strikethrough || this._chp.dblstrikethrough) {
            deco.push("line-through");
        }

        if (deco.length > 0) {
            el.css("text-decoration", deco.join(" "));
        }
        if (this._chp.colorindex != 0) {
            const color = doc._lookupColor(this._chp.colorindex);
            if (color != null) {
                el.css("color", Helper._colorToStr(color));
            }
        }
        el.css("font-size", Math.floor(this._chp.fontsize / 2) + "pt");
    }
}
