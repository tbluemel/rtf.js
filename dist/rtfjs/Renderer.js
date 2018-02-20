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
import { RTFJSError } from './Helper';
var Renderer = /** @class */ (function () {
    function Renderer(doc) {
        this._doc = doc;
        this._ins = [];
        this._dom = null;
        this._curRChp = null;
        this._curRPap = null;
        this._curpar = null;
        this._cursubpar = null;
        this._curcont = [];
    }
    Renderer.prototype.addIns = function (ins) {
        this._ins.push(ins);
    };
    ;
    Renderer.prototype.pushContainer = function (contel) {
        if (this._curpar == null)
            this.startPar();
        var len = this._curcont.push(contel);
        if (len > 1) {
            var prevcontel = this._curcont[len - 1];
            prevcontel.content.append(contel);
        }
        else {
            if (this._cursubpar != null)
                this._cursubpar.append(contel.element);
            else
                this._curpar.append(contel.element);
        }
    };
    ;
    Renderer.prototype.popContainer = function () {
        var contel = this._curcont.pop();
        if (contel == null)
            throw new RTFJSError("No container on rendering stack");
    };
    ;
    Renderer.prototype.buildHyperlinkElement = function (url) {
        return $("<a>").attr("href", url);
    };
    ;
    Renderer.prototype._appendToPar = function (el, newsubpar) {
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
        }
        else if (el) {
            var contelCnt = this._curcont.length;
            if (contelCnt > 0) {
                this._curcont[contelCnt - 1].content.append(el);
            }
            else if (this._cursubpar != null) {
                this._cursubpar.append(el);
            }
            else {
                this._curpar.append(el);
            }
        }
    };
    ;
    Renderer.prototype.startPar = function () {
        this._curpar = $("<div>");
        if (this._curRPap != null) {
            this._curRPap.apply(this._doc, this._curpar, this._curRChp, true);
            this._curRPap.apply(this._doc, this._curpar, this._curRChp, false);
        }
        this._cursubpar = null;
        this._curcont = [];
        this._dom.push(this._curpar);
    };
    ;
    Renderer.prototype.lineBreak = function () {
        this._appendToPar(null, true);
    };
    ;
    Renderer.prototype.setChp = function (rchp) {
        this._curRChp = rchp;
    };
    ;
    Renderer.prototype.setPap = function (rpap) {
        this._curRPap = rpap;
        if (this._cursubpar != null)
            this._curRPap.apply(this._doc, this._cursubpar, null, false);
        else if (this._curpar != null) {
            // Don't have a sub-paragraph at all, apply everything
            this._curRPap.apply(this._doc, this._curpar, null, true);
            this._curRPap.apply(this._doc, this._curpar, null, false);
        }
    };
    ;
    Renderer.prototype.appendElement = function (element) {
        this._appendToPar(element);
    };
    ;
    Renderer.prototype.buildRenderedPicture = function (element) {
        if (element == null)
            element = $("<span>").text("[failed to render image]");
        return element;
    };
    ;
    Renderer.prototype.renderedPicture = function (element) {
        this._appendToPar(this.buildRenderedPicture(element));
    };
    ;
    Renderer.prototype.buildPicture = function (mime, data) {
        if (data != null) {
            return $("<img>", {
                src: "data:" + mime + ";base64," + btoa(data)
            });
        }
        else {
            var err = "image type not supported";
            if (typeof mime === "string" && mime != "")
                err = mime;
            return $("<span>").text("[" + mime + "]");
        }
    };
    ;
    Renderer.prototype.picture = function (mime, data) {
        this._appendToPar(this.buildPicture(mime, data));
    };
    ;
    Renderer.prototype.buildDom = function () {
        if (this._dom != null)
            return this._dom;
        this._dom = [];
        this._curRChp = null;
        this._curRPap = null;
        this._curpar = null;
        var len = this._ins.length;
        for (var i = 0; i < len; i++) {
            var ins = this._ins[i];
            if (typeof ins === "string") {
                var span = $("<span>");
                if (this._curRChp != null)
                    this._curRChp.apply(this._doc, span);
                this._appendToPar(span.text(ins));
            }
            else {
                ins.call(this);
            }
        }
        return this._dom;
    };
    ;
    return Renderer;
}());
export { Renderer };
;
//# sourceMappingURL=Renderer.js.map