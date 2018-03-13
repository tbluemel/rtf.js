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

import * as $ from "jquery";
import { RTFJSError } from "../Helper";
import { Document } from "../Document";
import { RenderElement, RenderParagraphContainer, RenderTableContainer, RenderTextElement } from "./RenderChp";

export interface IContainerElement {
    element: JQuery;
    content: JQuery;
}

export class Renderer {
    public _doc: Document;
    private _dom: JQuery[];

    private _chp;
    private _pap;
    private _curpar;
    private _cursubparIdx: number;
    private _curcont;

    constructor(doc: Document) {
        this._doc = doc;
        this._dom = null;
        this.initRender();
    }

    initRender() {
        this._chp = null;
        this._pap = null;
        this._curpar = [];
        this._cursubparIdx = -1;
        this._curcont = [];
    };

    public pushContainer(container) {
        var len = this._curcont.push(container);
        if (len > 1) {
            var prevcontel = this._curcont[len - 1];
            prevcontel.appendSub(container);
        } else {
            if (this._cursubparIdx >= 0) {
                var par = this._curpar[this._cursubparIdx];
                par.appendSub(container);
            } else {
                this._curpar.push(container);
            }
        }
    }

    currentContainer(type) {
        var len = this._curcont.length;
        if (len == 0)
            return null;
        if (type != null) {
            for (var i = len - 1; i >= 0; i--) {
                var cont = this._curcont[i];
                if (cont.getType() == type)
                    return cont;
            }
            return null;
        }
        return this._curcont[len - 1];
    };

    public popContainer(type?) {
        var cont;
        if (type != null) {
            var popped = false;
            while (this._curcont.length > 0) {
                cont = this._curcont.pop();
                if (cont.getType() == type) {
                    popped = true;
                    break;
                }
            }
            if (!popped)
                throw new RTFJSError("No container of type " + type + " on rendering stack");
        } else {
            cont = this._curcont.pop();
            if (cont == null)
                throw new RTFJSError("No container on rendering stack");
        }
        return cont;
    }

    public buildHyperlinkElement(url: string): JQuery {
        return $("<a>").attr("href", url);
    }

    public _appendToPar(content, newsubpar?: boolean) {
        if (newsubpar == true) {
            // Move everything in _curpar since the last sub-paragraph into a new one
            var par = new RenderParagraphContainer(this._doc);
            var len = this._curpar.length;
            for (var i = this._cursubparIdx + 1; i < len; i++)
                par.appendSub(this._curpar[i]);
            this._curpar.splice(this._cursubparIdx + 1, len - this._cursubparIdx - 1);
            par.updateProps(this._pap, this._chp);
            this._curpar.push(par);

            // Add a new sub-paragraph
            par = new RenderParagraphContainer(this._doc);
            this._cursubparIdx = this._curpar.push(par) - 1;
            par.updateProps(this._pap, this._chp);

            if (content != null)
                this._curpar.push(content);
        } else if (content != null) {
            if(this._curcont.length > 0 && this._curcont[this._curcont.length - 1] instanceof RenderTableContainer
                && this._pap.intable === false){
                this._curcont.pop();
            }

            var contelCnt = this._curcont.length;
            if (contelCnt > 0) {
                this._curcont[contelCnt - 1].appendSub(content);
            } else if (this._cursubparIdx >= 0) {
                this._curpar[this._cursubparIdx].appendSub(content);
            } else {
                this._curpar.push(content);
            }
        }
    }

    finishPar() {
        this._appendToPar(null, true);
        //if (this._pap != null && this._pap.intable) {
        //	Helper.log("[rtf] finishPar: finishing table row");
        //	this.finishRow();
        //}
    };

    public lineBreak() {
        this._appendToPar(null, true);
    }

    finishRow() {
        var table = this.currentContainer("table");
        if (table == null)
            throw new RTFJSError("No table on rendering stack");
        table.finishRow();
    };

    finishCell() {
        var table = this.currentContainer("table");
        if (table == null)
            throw new RTFJSError("No table on rendering stack");
        table.finishCell();
    };

    setChp(chp) {
        this._chp = chp;
    };

    setPap(pap) {
        this._pap = pap;
        if (this._cursubparIdx >= 0) {
            this._curpar[this._cursubparIdx - 1].updateProps(this._pap, this._chp);
        }
    };

    appendElement(element: JQuery) {
        this._appendToPar(new RenderElement(this._doc, "element", element));
    };

    buildRenderedPicture(element) {
        if (element == null)
            element = $("<span>").text("[failed to render image]")
        return new RenderElement(this._doc, "picture", element);
    };

    public renderedPicture(element: JQuery) {
        this._appendToPar(this.buildRenderedPicture(element));
    }

    public buildPicture(mime: string, data: string) {
        var element;
        if (data != null) {
            element = $("<img>", {
                src: "data:" + mime + ";base64," + btoa(data)
            });
        } else {
            var err = "image type not supported";
            if (typeof mime === "string" && mime != "")
                err = mime;
            element = $("<span>").text("[" + err + "]");
        }
        return new RenderElement(this._doc, "picture", element);
    }

    public picture(mime: string, data: string) {
        this._appendToPar(this.buildPicture(mime, data));
    }

    public buildDom(): JQuery[] {
        if (this._dom != null) {
            return this._dom;
        }

        this._dom = [];

        this.initRender();

        let len = this._doc._ins.length;
        for (let i = 0; i < len; i++) {
            const ins = this._doc._ins[i];
            if (typeof ins === "string") {
                this._appendToPar(new RenderTextElement(this._doc, ins, this._chp));
            } else {
                ins(this);
            }
        }

        len = this._curpar.length;
        for (var i = 0; i < len; i++) {
            var element = this._curpar[i].finalize();
            if (element)
                this._dom.push(element);
        }

        return this._dom;
    }
}
