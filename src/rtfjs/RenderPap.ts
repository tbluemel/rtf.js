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

import { Helper } from './Helper';

export class RenderPap {
    _pap;

    constructor(pap) {
        this._pap = pap;
    }

    apply(doc, el, rchp, ismaindiv) {
        var pap = this._pap;
        if (ismaindiv) {
            if (pap.spacebefore != 0)
                el.css("margin-top", Helper._twipsToPt(pap.spacebefore) + "pt");
            else
                el.css("margin-top", "");
            if (pap.spaceafter != 0)
                el.css("margin-bottom", Helper._twipsToPt(pap.spaceafter) + "pt");
            else
                el.css("margin-bottom", "");
            if (rchp != null)
                el.css("min-height", Math.floor(rchp._chp.fontsize / 2) + "pt");
        } else {
            switch (pap.justification) {
                case Helper.JUSTIFICATION.LEFT:
                    el.css("text-align", "left");
                    break;
                case Helper.JUSTIFICATION.RIGHT:
                    el.css("text-align", "right");
                    break;
                case Helper.JUSTIFICATION.CENTER:
                    el.css("text-align", "center");
                    break;
                case Helper.JUSTIFICATION.JUSTIFY:
                    el.css("text-align", "justify");
                    break;
            }
        }
    };
};
