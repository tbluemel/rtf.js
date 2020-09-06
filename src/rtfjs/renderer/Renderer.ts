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
import { RTFJSError } from "../Helper";
import { RenderChp } from "./RenderChp";
import { RenderPap } from "./RenderPap";

export interface IContainerElement {
    element: HTMLElement;
    content: HTMLElement;
}

export class Renderer {
    public _doc: Document;
    private _dom: HTMLElement[];

    private _curRChp: RenderChp;
    private _curRPap: RenderPap;
    private _curpar: HTMLElement;
    private _cursubpar: HTMLElement;
    private _curcont: IContainerElement[];

    constructor(doc: Document) {
        this._doc = doc;
        this._dom = null;

        this._curRChp = null;
        this._curRPap = null;
        this._curpar = null;
        this._cursubpar = null;
        this._curcont = [];
    }

    public pushContainer(contel: IContainerElement): void {
        if (this._curpar == null) {
            this.startPar();
        }

        const len = this._curcont.push(contel);
        if (len > 1) {
            const prevcontel = this._curcont[len - 1];
            prevcontel.content.append(contel.element);
        } else {
            if (this._cursubpar != null) {
                this._cursubpar.append(contel.element);
            } else {
                this._curpar.append(contel.element);
            }
        }
    }

    public popContainer(): void {
        const contel = this._curcont.pop();
        if (contel == null) {
            throw new RTFJSError("No container on rendering stack");
        }
    }

    public buildHyperlinkElement(url: string): HTMLElement {
        const link: HTMLAnchorElement = document.createElement("a");
        link.href = url;
        return link;
    }

    public _appendToPar(el: HTMLElement, newsubpar?: boolean): void {
        if (this._curpar == null) {
            this.startPar();
        }
        if (newsubpar === true) {
            let subpar: HTMLDivElement = document.createElement("div");
            if (this._cursubpar == null) {
                subpar.append(...Array.from(this._curpar.childNodes));
                this._curpar.append(subpar);
                subpar = document.createElement("div");
            }
            if (el) {
                subpar.append(el);
            }
            if (this._curRPap != null) {
                this._curRPap.apply(this._doc, subpar, this._curRChp, false);
            }

            this._cursubpar = subpar;
            this._curpar.append(subpar);
        } else if (el) {
            const contelCnt = this._curcont.length;
            if (contelCnt > 0) {
                this._curcont[contelCnt - 1].content.append(el);
            } else if (this._cursubpar != null) {
                this._cursubpar.append(el);
            } else {
                this._curpar.append(el);
            }
        }
    }

    public startPar(): void {
        this._curpar = document.createElement("div");
        if (this._curRPap != null) {
            this._curRPap.apply(this._doc, this._curpar, this._curRChp, true);
            this._curRPap.apply(this._doc, this._curpar, this._curRChp, false);
        }
        this._cursubpar = null;
        this._curcont = [];
        this._dom.push(this._curpar);
    }

    public lineBreak(): void {
        this._appendToPar(null, true);
    }

    public setChp(rchp: RenderChp): void {
        this._curRChp = rchp;
    }

    public setPap(rpap: RenderPap): void {
        this._curRPap = rpap;
        if (this._cursubpar != null) {
            this._curRPap.apply(this._doc, this._cursubpar, null, false);
        } else if (this._curpar != null) {
            // Don't have a sub-paragraph at all, apply everything
            this._curRPap.apply(this._doc, this._curpar, null, true);
            this._curRPap.apply(this._doc, this._curpar, null, false);
        }
    }

    public appendElement(element: HTMLElement): void {
        this._appendToPar(element);
    }

    public buildRenderedPicture(element: HTMLElement): HTMLElement {
        if (element == null) {
            element = document.createElement("span");
            element.textContent = "[failed to render image]";
        }
        return element;
    }

    public renderedPicture(element: HTMLElement): void {
        this._appendToPar(this.buildRenderedPicture(element));
    }

    public buildPicture(mime: string, data: string): HTMLElement {
        if (data != null) {
            const image: HTMLImageElement = document.createElement("img");
            image.src = "data:" + mime + ";base64," + btoa(data);
            return image;
        } else {
            let err = "image type not supported";
            if (typeof mime === "string" && mime !== "") {
                err = mime;
            }
            const span: HTMLSpanElement = document.createElement("span");
            span.textContent = "[" + err + "]";
            return span;
        }
    }

    public picture(mime: string, data: string): void {
        this._appendToPar(this.buildPicture(mime, data));
    }

    public buildDom(): HTMLElement[] {
        if (this._dom != null) {
            return this._dom;
        }

        this._dom = [];

        this._curRChp = null;
        this._curRPap = null;
        this._curpar = null;

        const len = this._doc._ins.length;
        for (let i = 0; i < len; i++) {
            const ins = this._doc._ins[i];
            if (typeof ins === "string") {
                const span: HTMLSpanElement = document.createElement("span");
                span.textContent = ins;
                if (this._curRChp != null) {
                    this._curRChp.apply(this._doc, span);
                }
                this._appendToPar(span);
            } else {
                ins(this);
            }
        }
        return this._dom;
    }
}
