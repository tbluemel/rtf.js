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

import { Document } from './Document';
import { RTFJSError } from './Helper';
import { RenderChp } from './parser/RenderChp';
import { RenderPap } from './parser/RenderPap';

export interface ContainerElement {
    element: JQuery,
    content: JQuery
}

export class Renderer {
    _doc: Document;
    _dom: JQuery[];

    _curRChp: RenderChp;
    _curRPap: RenderPap;
    _curpar: JQuery;
    _cursubpar: JQuery;
    _curcont: ContainerElement[];

    constructor(doc: Document) {
        this._doc = doc;
        this._dom = null;

        this._curRChp = null;
        this._curRPap = null;
        this._curpar = null;
        this._cursubpar = null;
        this._curcont = [];
    }

    private pushContainer(contel: ContainerElement) {
        if (this._curpar == null)
            this.startPar();

        var len = this._curcont.push(contel);
        if (len > 1) {
            var prevcontel = this._curcont[len - 1];
            prevcontel.content.append(contel.element);
        } else {
            if (this._cursubpar != null)
                this._cursubpar.append(contel.element);
            else
                this._curpar.append(contel.element);
        }
    };

    private popContainer() {
        var contel = this._curcont.pop();
        if (contel == null)
            throw new RTFJSError("No container on rendering stack");
    };

    private buildHyperlinkElement(url: string): JQuery {
        return $("<a>").attr("href", url);
    };

    private _appendToPar(el: JQuery, newsubpar?: boolean) {
        if (this._curpar == null)
            this.startPar();
        if (newsubpar == true) {
            var subpar = $("<div>");
            if (this._cursubpar == null) {
                this._curpar.children().appendTo(subpar);
                this._curpar.append(subpar);
                subpar = $("<div>");
            }
            if (el)
                subpar.append(el);
            if (this._curRPap != null)
                this._curRPap.apply(this._doc, subpar, this._curRChp, false);

            this._cursubpar = subpar;
            this._curpar.append(subpar);
        } else if (el) {
            var contelCnt = this._curcont.length;
            if (contelCnt > 0) {
                this._curcont[contelCnt - 1].content.append(el);
            } else if (this._cursubpar != null) {
                this._cursubpar.append(el);
            } else {
                this._curpar.append(el);
            }
        }
    };

    private startPar() {
        this._curpar = $("<div>");
        if (this._curRPap != null) {
            this._curRPap.apply(this._doc, this._curpar, this._curRChp, true);
            this._curRPap.apply(this._doc, this._curpar, this._curRChp, false);
        }
        this._cursubpar = null;
        this._curcont = [];
        this._dom.push(this._curpar);
    };

    private lineBreak() {
        this._appendToPar(null, true);
    };

    private setChp(rchp: RenderChp) {
        this._curRChp = rchp;
    };

    private setPap(rpap: RenderPap) {
        this._curRPap = rpap;
        if (this._cursubpar != null)
            this._curRPap.apply(this._doc, this._cursubpar, null, false);
        else if (this._curpar != null) {
            // Don't have a sub-paragraph at all, apply everything
            this._curRPap.apply(this._doc, this._curpar, null, true);
            this._curRPap.apply(this._doc, this._curpar, null, false);
        }
    };

    private appendElement(element: JQuery) {
        this._appendToPar(element);
    };

    private buildRenderedPicture(element: JQuery): JQuery {
        if (element == null)
            element = $("<span>").text("[failed to render image]")
        return element;
    };

    private renderedPicture(element: JQuery) {
        this._appendToPar(this.buildRenderedPicture(element));
    };

    private buildPicture(mime: string, data: string): JQuery {
        if (data != null) {
            return $("<img>", {
                src: "data:" + mime + ";base64," + btoa(data)
            });
        } else {
            var err = "image type not supported";
            if (typeof mime === "string" && mime != "")
                err = mime;
            return $("<span>").text("[" + mime + "]");
        }
    };

    private picture(mime: string, data: string) {
        this._appendToPar(this.buildPicture(mime, data));
    };

    public buildDom(): JQuery[] {
        if (this._dom != null)
            return this._dom;

        this._dom = [];

        this._curRChp = null;
        this._curRPap = null;
        this._curpar = null;

        var len = this._doc._ins.length;
        for (var i = 0; i < len; i++) {
            var ins = this._doc._ins[i];
            if (typeof ins === "string") {
                var span = $("<span>");
                if (this._curRChp != null)
                    this._curRChp.apply(this._doc, span);
                this._appendToPar(span.text(ins));
            } else {
                ins.call(this);
            }
        }
        return this._dom;
    };
};
