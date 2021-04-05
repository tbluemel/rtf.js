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

export interface IColor {
    r: number;
    g: number;
    b: number;
    tint: number;
    shade: number;
    theme: null;
}

export class ColortblDestination extends DestinationBase {
    private _colors: IColor[];
    private _current: IColor;
    private _autoIndex: number;
    private inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("colortbl");
        this._colors = [];
        this._current = null;
        this._autoIndex = null;
        this.inst = inst;
    }

    public appendText(text: string): void {
        // We expect this method to be called after the color was fully defined.
        if (text.trim() !== ";") {
            throw new RTFJSError("Error parsing colortbl destination");
        }
        if (this._current == null) {
            if (this._autoIndex != null) {
                throw new RTFJSError("colortbl cannot define more than one auto color");
            }
            this._autoIndex = this._colors.length;
            this._startNewColor();
        } else {
            if (this._current.tint < 255 && this._current.shade < 255) {
                throw new RTFJSError("colortbl cannot define shade and tint at the same time");
            }
        }
        this._colors.push(this._current);
        this._current = null;
    }

    public handleKeyword(keyword: string, param: number): boolean {
        if (this._current == null) {
            this._startNewColor();
        }

        switch (keyword) {
            case "red":
                this._current.r = this._validateColorValueRange(keyword, param);
                return true;
            case "green":
                this._current.g = this._validateColorValueRange(keyword, param);
                return true;
            case "blue":
                this._current.b = this._validateColorValueRange(keyword, param);
                return true;
            case "ctint":
                this._current.tint = this._validateColorValueRange(keyword, param);
                return true;
            case "cshade":
                this._current.shade = this._validateColorValueRange(keyword, param);
                return true;
            default:
                if (keyword[0] === "c") {
                    this._current.theme = Helper._mapColorTheme(keyword.slice(1));
                    return true;
                }
                break;
        }

        Helper.log("[colortbl] handleKeyword(): unhandled keyword: " + keyword);
        return false;
    }

    public apply(): void {
        Helper.log("[colortbl] apply()");
        if (this._autoIndex == null) {
            this._autoIndex = 0;
        }
        if (this._autoIndex >= this._colors.length) {
            throw new RTFJSError("colortbl doesn't define auto color");
        }
        for (const idx in this._colors) {
            Helper.log("[colortbl] [" + idx + "] = "
                + this._colors[idx].r + "," + this._colors[idx].g + "," + this._colors[idx].b
                + " theme: " + this._colors[idx].theme);
        }
        this.inst._colors = this._colors;
        this.inst._autoColor = this._autoIndex;
        delete this._colors;
    }

    private _startNewColor() {
        this._current = {
            r: 0,
            g: 0,
            b: 0,
            tint: 255,
            shade: 255,
            theme: null,
        };
        return this._current;
    }

    private _validateColorValueRange(keyword: string, param: number): number {
        if (param == null) {
            throw new RTFJSError(keyword + " has no param");
        }
        if (param < 0 || param > 255) {
            throw new RTFJSError(keyword + " has invalid param value");
        }
        return param;
    }
}
