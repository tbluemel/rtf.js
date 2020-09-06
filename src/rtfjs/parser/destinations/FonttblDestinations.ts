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

import { Document } from "../../Document";
import { Helper, RTFJSError } from "../../Helper";
import { GlobalState } from "../Containers";
import { DestinationBase } from "./DestinationBase";

export class FonttblDestinationSub extends DestinationBase {
    public index: number;
    public fontname: string;
    public altfontname: string;
    public family: string;
    public pitch: number;
    public bias: number;
    public charset: number;
    private _fonttbl: FonttblDestination;

    constructor(fonttbl: FonttblDestination) {
        super("fonttbl:sub");
        this._fonttbl = fonttbl;
        this.index = null;
        this.fontname = null;
        this.altfontname = null;
        this.family = null;
        this.pitch = Helper.FONTPITCH.DEFAULT;
        this.bias = 0;
        this.charset = null;
    }

    public handleKeyword(keyword: string, param: number): boolean {
        switch (keyword) {
            case "f":
                this.index = param;
                return true;
            case "fnil":
                return true;
            case "froman":
            case "fswiss":
            case "fmodern":
            case "fscript":
            case "fdecor":
            case "ftech":
            case "fbidi":
            case "flomajor":
            case "fhimajor":
            case "fdbmajor":
            case "fbimajor":
            case "flominor":
            case "fhiminor":
            case "fdbminor":
            case "fbiminor":
                this.family = keyword.slice(1);
                return true;
            case "fprq":
                switch (param) {
                    case 0:
                        this.pitch = Helper.FONTPITCH.DEFAULT;
                        break;
                    case 1:
                        this.pitch = Helper.FONTPITCH.FIXED;
                        break;
                    case 2:
                        this.pitch = Helper.FONTPITCH.VARIABLE;
                        break;
                }
                return true;
            case "fbias":
                if (param != null) {
                    this.bias = param;
                }
                return true;
            case "fcharset":
                if (param != null) {
                    this.charset = Helper._mapCharset(param);
                    if (this.charset == null) {
                        Helper.log("Unknown font charset: " + param);
                    }
                }
                return true;
            case "cpg":
                if (param != null) {
                    this.charset = param;
                }
                return true;
        }
        return false;
    }

    public appendText(text: string): void {
        if (this.fontname == null) {
            this.fontname = text;
        } else {
            this.fontname += text;
        }
    }

    public apply(): void {
        if (this.index == null) {
            throw new RTFJSError("No font index provided");
        }
        if (this.fontname == null) {
            throw new RTFJSError("No font name provided");
        }
        this._fonttbl.addSub(this);
        delete this._fonttbl;
    }

    public setAltFontName(name: string): void {
        this.altfontname = name;
    }
}

export class FonttblDestination extends DestinationBase {
    private _fonts: FonttblDestinationSub[];
    private _sub: FonttblDestinationSub;
    private inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("fonttbl");
        this._fonts = [];
        this._sub = null;
        this.inst = inst;
    }

    public sub(): FonttblDestinationSub {
        return new FonttblDestinationSub(this);
    }

    public apply(): void {
        Helper.log("[fonttbl] apply()");
        for (const idx in this._fonts) {
            Helper.log("[fonttbl][" + idx + "] index = " + this._fonts[idx].fontname
                + " alternative: " + this._fonts[idx].altfontname);
        }
        this.inst._fonts = this._fonts;
        delete this._fonts;
    }

    public appendText(text: string): void {
        this._sub.appendText(text);
        this._sub.apply();
    }

    public handleKeyword(keyword: string, param: number): void {
        if (keyword === "f") {
            this._sub = this.sub();
        }
        this._sub.handleKeyword(keyword, param);
    }

    public addSub(sub: FonttblDestinationSub): void {
        this._fonts[sub.index] = sub;
    }
}
