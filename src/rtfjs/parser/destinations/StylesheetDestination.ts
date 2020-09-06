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
import { Helper } from "../../Helper";
import { GlobalState } from "../Containers";
import { DestinationBase } from "./DestinationBase";

export class StylesheetDestinationSub extends DestinationBase {
    private _stylesheet: StylesheetDestination;
    private index: number;
    private name: string;
    private handler: (keyword: string, param: number) => boolean;
    private paragraph?: null;

    constructor(stylesheet: StylesheetDestination) {
        super("stylesheet:sub");
        this._stylesheet = stylesheet;
        this.index = 0;
        this.name = null;
        this.handler = this._handleKeywordCommon("paragraph");
    }

    public handleKeyword(keyword: string, param: number): boolean {
        switch (keyword) {
            case "s":
                this.index = param;
                return true;
            case "cs":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("character");
                this.index = param;
                return true;
            case "ds":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("section");
                this.index = param;
                return true;
            case "ts":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("table");
                this.index = param;
                return true;
        }

        return this.handler(keyword, param);
    }

    public appendText(text: string): void {
        if (this.name == null) {
            this.name = text;
        } else {
            this.name += text;
        }
    }

    public apply(): void {
        this._stylesheet.addSub({
            index: this.index,
            name: this.name,
        });
        delete this._stylesheet;
    }

    private _handleKeywordCommon(member: string) {
        return (keyword: string, param: number) => {
            Helper.log("[stylesheet:sub]." + member + ": unhandled keyword: " + keyword + " param: " + param);
            return false;
        };
    }
}

export class StylesheetDestination extends DestinationBase {
    private _stylesheets: { index: number, name: string }[];
    private inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("stylesheet");
        this._stylesheets = [];
        this.inst = inst;
    }

    public sub(): StylesheetDestinationSub {
        return new StylesheetDestinationSub(this);
    }

    public apply(): void {
        Helper.log("[stylesheet] apply()");
        for (const idx in this._stylesheets) {
            Helper.log("[stylesheet] [" + idx + "] name: " + this._stylesheets[idx].name);
        }
        this.inst._stylesheets = this._stylesheets;
        delete this._stylesheets;
    }

    public addSub(sub: { index: number, name: string }): void {
        // Some documents will redefine stylesheets
        // if (this._stylesheets[sub.index] != null)
        //     throw new RTFJSError("Cannot redefine stylesheet with index " + sub.index);
        this._stylesheets[sub.index] = sub;
    }
}
