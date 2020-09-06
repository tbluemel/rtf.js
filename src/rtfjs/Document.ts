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

import { ISettings } from "./DocumentFacade";
import { RTFJSError } from "./Helper";
import { IColor } from "./parser/destinations/ColortblDestinations";
import { FonttblDestinationSub } from "./parser/destinations/FonttblDestinations";
import { Renderer } from "./renderer/Renderer";

export class Document {
    public _settings: ISettings;
    public _meta: { [key: string]: any };
    public _fonts: FonttblDestinationSub[];
    public _colors: IColor[];
    public _autoColor: number;
    public _stylesheets: { index: number, name: string }[];
    public _ins: (string | ((renderer: Renderer) => void))[];

    constructor(settings: ISettings) {
        this._settings = settings || {};
        this._meta = {};
        this._fonts = [];
        this._colors = [];
        this._autoColor = null;
        this._stylesheets = [];
        this._ins = [];
    }

    public _lookupColor(idx: number): null | IColor {
        if (idx === 0) {
            if (this._autoColor == null) {
                return null;
            }
            return this._colors[this._autoColor];
        }
        if (idx < 0 || idx >= this._colors.length) {
            throw new RTFJSError("Invalid color index");
        }
        return this._colors[idx];
    }

    public addIns(ins: string | ((renderer: Renderer) => void)): void {
        this._ins.push(ins);
    }

}
