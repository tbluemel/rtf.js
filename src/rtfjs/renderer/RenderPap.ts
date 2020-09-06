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
import { Pap } from "../parser/Containers";
import { RenderChp } from "./RenderChp";

export class RenderPap {
    private _pap: Pap;

    constructor(pap: Pap) {
        this._pap = pap;
    }

    public apply(doc: Document, el: HTMLElement, rchp: RenderChp, ismaindiv: boolean): void {
        Helper.log("[rtf] RenderPap apply:" + (rchp != null ? " chp=" + JSON.stringify(rchp._chp) : "")
            + " pap=" + JSON.stringify(this._pap) + " ismaindiv=" + ismaindiv);
        if (ismaindiv) {
            if (this._pap.spacebefore !== 0) {
                el.style.marginTop = Helper._twipsToPt(this._pap.spacebefore) + "pt";
            } else {
                el.style.marginTop = "";
            }
            if (this._pap.spaceafter !== 0) {
                el.style.marginBottom = Helper._twipsToPt(this._pap.spaceafter) + "pt";
            } else {
                el.style.marginBottom = "";
            }
            if (rchp != null) {
                el.style.minHeight = Math.floor(rchp._chp.fontsize / 2) + "pt";
            }
        } else {
            switch (this._pap.justification) {
                case Helper.JUSTIFICATION.LEFT:
                    el.style.textAlign = "left";
                    break;
                case Helper.JUSTIFICATION.RIGHT:
                    el.style.textAlign = "right";
                    break;
                case Helper.JUSTIFICATION.CENTER:
                    el.style.textAlign = "center";
                    break;
                case Helper.JUSTIFICATION.JUSTIFY:
                    el.style.textAlign = "justify";
                    break;
            }
        }
    }
}
