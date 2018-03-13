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

import { Helper, RTFJSError } from "../Helper";

export class RenderElement {
    _doc;
    _type;
    _element;
    _pap;
    _chp;

    constructor(doc, type, element) {
        this._doc = doc;
        this._type = type;
        this._element = element;
        this._pap = null;
        this._chp = null;
    }

    getElement() {
        return this._element;
    };

    getContent() {
        return this._element;
    };

    updateProps(pap, chp) {
        this._pap = pap;
        this._chp = chp;
    };

    finalize() {
        Helper.log("[rtf] finalizing element of type " + this._type);
        return this._element;
    };
}

export class RenderTextElement extends RenderElement {
    constructor(doc, text, chp) {
        super(doc, "text", $("<span>").text(text));
        this._chp = chp;
    }

    applyProps() {
        var chp = this._chp;
        var el = this.getElement();
        if (chp.bold)
            el.css("font-weight", "bold");
        if (chp.italic)
            el.css("font-style", "italic");
        if (chp.hasOwnProperty("fontfamily") && this._doc._fonts[chp.fontfamily]) {
            var fontFamily = this._doc._fonts[chp.fontfamily].fontname.replace(";", "");
            if (fontFamily !== "Symbol")
                el.css("font-family", fontFamily);
        }

        var deco = [];
        if (chp.underline != Helper.UNDERLINE.NONE)
            deco.push("underline");
        if (chp.strikethrough || chp.dblstrikethrough)
            deco.push("line-through");

        if (deco.length > 0)
            el.css("text-decoration", deco.join(" "));
        if (chp.colorindex != 0) {
            var color = this._doc._lookupColor(chp.colorindex);
            if (color != null)
                el.css("color", Helper._colorToStr(color));
        }
        el.css("font-size", Math.floor(chp.fontsize / 2) + "pt");
    };

    finalize() {
        Helper.log("[rtf] finalizing text element");
        this.applyProps();
        return super.finalize();
    }
};

export class RenderContainer extends RenderElement {
    _content;
    _sub;

    constructor(doc, type, element, content) {
        super(doc, type, element);
        this._content = content;
        this._sub = [];
    }

    getType() {
        return this._type;
    };

    getContent() {
        return this._content;
    };

    appendSub(container) {
        Helper.log("[rtf] appendSub for container " + this._type);
        this._sub.push({
            container: container
        });
    };

    _finalizeSub(sub, parentPap) {
        return sub.container.finalize(parentPap);
    };

    finalize() {
        Helper.log("[rtf] finalizing container " + this._type);
        if (this._sub == null)
            throw new RTFJSError("Container already finalized");

        var cont = this.getContent();
        var len = this._sub.length;
        for (var i = 0; i < len; i++) {
            var element = this._finalizeSub(this._sub[i], this._pap);
            if (element != null)
                cont.append(element);
        }
        delete this._sub;
        return this._element;
    };
};

export class RenderParagraphContainer extends RenderContainer {
    constructor(doc) {
        var par = $("<div>");
        super(doc, "par", par, par);
    }

    appendSub(container) {
        Helper.log("[rtf] appendSub for container " + this._type);
        this._sub.push({
            container: container,
            pap: container._pap != null ? container._pap : this._pap,
            chp: container._chp != null ? container._chp : this._chp
        });
    };

    updateProps(pap, chp) {
        this._pap = pap;
        this._chp = chp;

        if (this._sub.length > 0) {
            var sub = this._sub[this._sub.length - 1];
            sub.pap = pap;
            sub.chp = chp;
        }
    };

    applyPap(el, pap, chp, ismaindiv?) {
        var el = this.getElement();
        if (ismaindiv) {
            if (pap.spacebefore != 0)
                el.css("margin-top", Helper._twipsToPt(pap.spacebefore) + "pt");
            else
                el.css("margin-top", "");
            if (pap.spaceafter != 0)
                el.css("margin-bottom", Helper._twipsToPt(pap.spaceafter) + "pt");
            else
                el.css("margin-bottom", "");
            if (chp != null)
                el.css("min-height", Math.floor(chp.fontsize / 2) + "pt");
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

    _finalizeSub(sub, parentPap) {
        var element = sub.container.finalize();
        if (element)
            this.applyPap(element, sub.pap ? sub.pap : parentPap, sub.chp);
        return element;
    };

    finalize() {
        Helper.log("[rtf] finalizing paragraph");
        if (this._sub == null)
            throw new RTFJSError("Paragraph already finalized");
        if (this._sub.length > 0)
            return super.finalize();

        delete this._sub;
        return null;
    };

};

export class RenderTableContainer extends RenderContainer {
    _rows;
    _row;
    _cell;

    constructor(doc) {
        super(doc, "table", $("<table>"), null);
        this._rows = [];
        this._row = null;
        this._cell = null;
    }

    appendCell() {
        Helper.log("[rtf] Table appending cell");
        if (this._row == null)
            this.appendRow();

        this._cell = {
            element: $("<td>").appendTo(this._row.element),
            sub: []
        };
        this._row.cells.push(this._cell);
    };

    appendRow() {
        Helper.log("[rtf] Table appending row");
        this._row = {
            element: $("<tr>").appendTo(this._element),
            cells: []
        };
        this._rows.push(this._row);
        this.appendCell();
    };

    finishRow() {
        Helper.log("[rtf] Table finish row");
        this.finishCell();
        this._row = null;
    };

    finishCell() {
        Helper.log("[rtf] Table finish cell");
        var len = this._sub.length;
        if (len > 0) {
            if (this._row == null)
                this.appendRow();
            if (this._cell == null)
                this.appendCell();

            for (var i = 0; i < len; i++)
                this._cell.sub.push(this._sub[i]);
            this._sub = [];
        }

        this._cell = null;
    };

    finalize() {
        Helper.log("[rtf] Table finalize");
        if (this._sub == null)
            throw new RTFJSError("Table container already finalized");

        var rlen = this._rows.length;
        Helper.log("[rtf] Table finalize: #rows: " + rlen);
        for (var r = 0; r < rlen; r++) {
            var row = this._rows[r];
            var clen = row.cells.length;
            Helper.log("[rtf] Table finalize: row[" + r + "].#cells: " + clen);
            for (var c = 0; c < clen; c++) {
                var cell = row.cells[c];

                var slen = cell.sub.length;
                Helper.log("[rtf] Table finalize: row[" + r + "].cell[" + c + "].#subs: " + slen);
                for (var s = 0; s < slen; s++) {
                    var sub = cell.sub[s];
                    var element = sub.container.finalize();
                    if (element != null)
                        cell.element.append(element);
                }
            }
        }

        delete this._sub;

        return this._element;
    };
};
