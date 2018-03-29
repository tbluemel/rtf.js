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
import { Helper, RTFJSError } from "../Helper";
import { Chp, Pap } from "../parser/Containers";

export class RenderElement {
    public _doc: Document;
    public _type: string;
    public _element: JQuery;
    public _pap: Pap;
    public _chp: Chp;

    constructor(doc: Document, type: string, element: JQuery) {
        this._doc = doc;
        this._type = type;
        this._element = element;
        this._pap = null;
        this._chp = null;
    }

    public getElement() {
        return this._element;
    }

    public getContent() {
        return this._element;
    }

    public updateProps(pap: Pap, chp: Chp) {
        this._pap = pap;
        this._chp = chp;
    }

    public finalize() {
        Helper.log("[rtf] finalizing element of type " + this._type);
        return this._element;
    }
}

export class RenderTextElement extends RenderElement {
    constructor(doc: Document, text: string, chp: Chp) {
        super(doc, "text", $("<span>").text(text));
        this._chp = chp;
    }

    public applyProps() {
        const chp = this._chp;
        const el = this.getElement();
        Helper.log("[rtf] RenderTextElement: " + el.text());
        Helper.log("[rtf] RenderTextElement applyProps: " + JSON.stringify(chp));
        if (chp.bold) {
            el.css("font-weight", "bold");
        }
        if (chp.italic) {
            el.css("font-style", "italic");
        }
        if (chp.hasOwnProperty("fontfamily") && this._doc._fonts[chp.fontfamily]) {
            const fontFamily = this._doc._fonts[chp.fontfamily].fontname.replace(";", "");
            if (fontFamily !== "Symbol") {
                el.css("font-family", fontFamily);
            }
        }

        const deco = [];
        if (chp.underline !== Helper.UNDERLINE.NONE) {
            deco.push("underline");
        }
        if (chp.strikethrough || chp.dblstrikethrough) {
            deco.push("line-through");
        }

        if (deco.length > 0) {
            el.css("text-decoration", deco.join(" "));
        }
        if (chp.colorindex !== 0) {
            const color = this._doc._lookupColor(chp.colorindex);
            if (color != null) {
                el.css("color", Helper._colorToStr(color));
            }
        }
        el.css("font-size", Math.floor(chp.fontsize / 2) + "pt");
    }

    public finalize() {
        Helper.log("[rtf] finalizing text element");
        this.applyProps();
        return super.finalize();
    }
}

export interface ISub {
    container: RenderElement;
    pap?: Pap;
    chp?: Chp;
}

export class RenderContainer extends RenderElement {
    public _content: JQuery;
    public _sub: ISub[];

    constructor(doc: Document, type: string, element: JQuery, content: JQuery) {
        super(doc, type, element);
        this._content = content;
        this._sub = [];
    }

    public getType() {
        return this._type;
    }

    public getContent() {
        return this._content;
    }

    public appendSub(container: RenderContainer) {
        Helper.log("[rtf] appendSub for container " + this._type);
        this._sub.push({
            container,
        });
    }

    public _finalizeSub(sub: ISub, parentPap: Pap) {
        return sub.container.finalize();
    }

    public finalize() {
        Helper.log("[rtf] finalizing container " + this._type);
        if (this._sub == null) {
            throw new RTFJSError("Container already finalized");
        }

        const cont = this.getContent();
        const len = this._sub.length;
        for (let i = 0; i < len; i++) {
            const element = this._finalizeSub(this._sub[i], this._pap);
            if (element != null) {
                cont.append(element);
            }
        }
        delete this._sub;
        return this._element;
    }
}

export class RenderParagraphContainer extends RenderContainer {
    constructor(doc: Document) {
        const par = $("<div>");
        super(doc, "par", par, par);
    }

    public appendSub(container: RenderElement) {
        Helper.log("[rtf] appendSub for container " + this._type);
        this._sub.push({
            container,
            pap: container._pap != null ? container._pap : this._pap,
            chp: container._chp != null ? container._chp : this._chp,
        });
    }

    public updateProps(pap: Pap, chp: Chp) {
        this._pap = pap;
        this._chp = chp;

        if (this._sub.length > 0) {
            const sub = this._sub[this._sub.length - 1];
            sub.pap = pap;
            sub.chp = chp;
        }
    }

    public applyPap(el: JQuery, pap: Pap, chp: Chp) {
        Helper.log("[rtf] RenderParagraphContainer applyPap: chp=" + JSON.stringify(chp)
            + " pap=" + JSON.stringify(pap));
        el = this.getElement();

        if (pap.spacebefore !== 0) {
            el.css("margin-top", Helper._twipsToPt(pap.spacebefore) + "pt");
        } else {
            el.css("margin-top", "");
        }
        if (pap.spaceafter !== 0) {
            el.css("margin-bottom", Helper._twipsToPt(pap.spaceafter) + "pt");
        } else {
            el.css("margin-bottom", "");
        }
        if (chp != null) {
            el.css("min-height", Math.floor(chp.fontsize / 2) + "pt");
        }

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

    public _finalizeSub(sub: ISub, parentPap: Pap) {
        const element = sub.container.finalize();
        if (element) {
            this.applyPap(element, sub.pap ? sub.pap : parentPap, sub.chp);
        }
        return element;
    }

    public finalize() {
        Helper.log("[rtf] finalizing paragraph");
        if (this._sub == null) {
            throw new RTFJSError("Paragraph already finalized");
        }
        if (this._sub.length > 0) {
            return super.finalize();
        }

        delete this._sub;
        return null;
    }
}

export interface IRow {
    element: JQuery;
    cells: ICell[];
}

export interface ICell {
    element: JQuery;
    sub: ISub[];
}

export class RenderTableContainer extends RenderContainer {
    public _rows: IRow[];
    public _row: IRow;
    public _cell: ICell;

    constructor(doc: Document) {
        super(doc, "table", $("<table>"), null);
        this._rows = [];
        this._row = null;
        this._cell = null;
    }

    public appendCell() {
        Helper.log("[rtf] Table appending cell");
        if (this._row == null) {
            this.appendRow();
        }

        this._cell = {
            element: $("<td>").appendTo(this._row.element),
            sub: [],
        };
        this._row.cells.push(this._cell);
    }

    public appendRow() {
        Helper.log("[rtf] Table appending row");
        this._row = {
            element: $("<tr>").appendTo(this._element),
            cells: [],
        };
        this._rows.push(this._row);
        this.appendCell();
    }

    public finishRow() {
        Helper.log("[rtf] Table finish row");
        this.finishCell();
        this._row = null;
    }

    public finishCell() {
        Helper.log("[rtf] Table finish cell");
        const len = this._sub.length;
        if (len > 0) {
            if (this._row == null) {
                this.appendRow();
            }
            if (this._cell == null) {
                this.appendCell();
            }

            for (let i = 0; i < len; i++) {
                this._cell.sub.push(this._sub[i]);
            }
            this._sub = [];
        }

        this._cell = null;
    }

    public finalize() {
        Helper.log("[rtf] Table finalize");
        if (this._sub == null) {
            throw new RTFJSError("Table container already finalized");
        }

        const rlen = this._rows.length;
        Helper.log("[rtf] Table finalize: #rows: " + rlen);
        for (let r = 0; r < rlen; r++) {
            const row = this._rows[r];
            const clen = row.cells.length;
            Helper.log("[rtf] Table finalize: row[" + r + "].#cells: " + clen);
            for (let c = 0; c < clen; c++) {
                const cell = row.cells[c];

                const slen = cell.sub.length;
                Helper.log("[rtf] Table finalize: row[" + r + "].cell[" + c + "].#subs: " + slen);
                for (let s = 0; s < slen; s++) {
                    const sub = cell.sub[s];
                    const element = sub.container.finalize();
                    if (element != null) {
                        cell.element.append(element);
                    }
                }
            }
        }

        delete this._sub;

        return this._element;
    }
}
