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
import {RTFJSError} from "../Helper";
import { Document } from "../Document";
import { RTFJSError } from "../Helper";
import { Chp, Pap } from "../parser/Containers";
import {
    RenderContainer, RenderElement, RenderParagraphContainer, RenderTableContainer,
    RenderTextElement,
} from "./RenderElements";

export interface IContainerElement {
    element: JQuery;
    content: JQuery;
}

export class Renderer {
    public _doc: Document;
    private _dom: JQuery[];

    private _chp: Chp;
    private _pap: Pap;
    private _curpar: Array<RenderElement | RenderContainer>;
    private _cursubparIdx: number;
    private _curcont: RenderContainer[];

    constructor(doc: Document) {
        this._doc = doc;
        this._dom = null;
    }

    public pushContainer(container: RenderContainer) {
        const len = this._curcont.push(container);
        if (len > 1) {
            const prevcontel = this._curcont[len - 1];
            prevcontel.appendSub(container);
        } else {
            if (this._cursubparIdx >= 0) {
                const par = this._curpar[this._cursubparIdx] as RenderContainer;
                par.appendSub(container);
            } else {
                this._curpar.push(container);
            }
        }
    }

    public currentContainer(type: string) {
        const len = this._curcont.length;
        if (len === 0) {
            return null;
        }
        if (type != null) {
            for (let i = len - 1; i >= 0; i--) {
                const cont = this._curcont[i];
                if (cont.getType() === type) {
                    return cont;
                }
            }
            return null;
        }
        return this._curcont[len - 1];
    }

    public popContainer(type?: string) {
        let cont;
        if (type != null) {
            let popped = false;
            while (this._curcont.length > 0) {
                cont = this._curcont.pop();
                if (cont.getType() === type) {
                    popped = true;
                    break;
                }
            }
            if (!popped) {
                throw new RTFJSError("No container of type " + type + " on rendering stack");
            }
        } else {
            cont = this._curcont.pop();
            if (cont == null) {
                throw new RTFJSError("No container on rendering stack");
            }
        }
        return cont;
    }

    public buildHyperlinkElement(url: string): JQuery {
        return $("<a>").attr("href", url);
    }

    public _appendToPar(content: RenderElement, newsubpar?: boolean) {
        if (newsubpar === true) {
            // Move everything in _curpar since the last sub-paragraph into a new one
            let par = new RenderParagraphContainer(this._doc);
            const len = this._curpar.length;
            for (let i = this._cursubparIdx + 1; i < len; i++) {
                par.appendSub(this._curpar[i]);
            }
            this._curpar.splice(this._cursubparIdx + 1, len - this._cursubparIdx - 1);
            par.updateProps(this._pap, this._chp);
            this._curpar.push(par);

            // Add a new sub-paragraph
            par = new RenderParagraphContainer(this._doc);
            this._cursubparIdx = this._curpar.push(par) - 1;
            par.updateProps(this._pap, this._chp);

            if (content != null) {
                this._curpar.push(content);
            }
        } else if (content != null) {
            if (this._curcont.length > 0 && this._curcont[this._curcont.length - 1] instanceof RenderTableContainer
                && this._pap.intable === false) {
                this._curcont.pop();
            }

            const contelCnt = this._curcont.length;
            if (contelCnt > 0) {
                this._curcont[contelCnt - 1].appendSub(content as RenderContainer);
            } else if (this._cursubparIdx >= 0) {
                (this._curpar[this._cursubparIdx] as RenderContainer).appendSub(content as RenderContainer);
            } else {
                this._curpar.push(content);
            }
        }
    }

    public finishPar() {
        this._appendToPar(null, true);
        // if (this._pap != null && this._pap.intable) {
        //     Helper.log("[rtf] finishPar: finishing table row");
        //     this.finishRow();
        // }
    }

    public lineBreak() {
        this._appendToPar(null, true);
    }

    public finishRow() {
        const table = this.currentContainer("table") as RenderTableContainer;
        if (table == null) {
            throw new RTFJSError("No table on rendering stack");
        }
        table.finishRow();
    }

    public finishCell() {
        const table = this.currentContainer("table") as RenderTableContainer;
        if (table == null) {
            throw new RTFJSError("No table on rendering stack");
        }
        table.finishCell();
    }

    public setChp(chp: Chp) {
        this._chp = chp;
    }

    public setPap(pap: Pap) {
        this._pap = pap;
        if (this._cursubparIdx >= 0) {
            this._curpar[this._cursubparIdx - 1].updateProps(this._pap, this._chp);
        }
    }

    public appendElement(element: JQuery) {
        this._appendToPar(new RenderElement(this._doc, "element", element));
    }

    public buildRenderedPicture(element: JQuery) {
        if (element == null) {
            element = $("<span>").text("[failed to render image]");
        }
        return new RenderElement(this._doc, "picture", element);
    }

    public renderedPicture(element: JQuery) {
        this._appendToPar(this.buildRenderedPicture(element));
    }

    public buildPicture(mime: string, data: string) {
        let element;
        if (data != null) {
            element = $("<img>", {
                src: "data:" + mime + ";base64," + btoa(data),
            });
        } else {
            let err = "image type not supported";
            if (typeof mime === "string" && mime !== "") {
                err = mime;
            }
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

        this._chp = null;
        this._pap = null;
        this._curpar = [];
        this._cursubparIdx = -1;
        this._curcont = [];

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
        for (let i = 0; i < len; i++) {
            // At this point all render elements have been wrapped in RenderParagraphContainer objects
            const element = this._curpar[i].finalize();
            if (element) {
                this._dom.push(element);
            }
        }

        return this._dom;
    }
}
