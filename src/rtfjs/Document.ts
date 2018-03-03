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

export interface Settings {
    onHyperlink?(create: () => void, hyperlink: {url: () => string}): void;
    onPicture?(isLegacy: boolean, create: () => void): void;
    onImport?(relUrls: string, callback: (data: {error?: Error, keyword?: string, blob?: ArrayBuffer, width?: number, height?: number}) => void): void;
}
export class Document {
    _settings: Settings;
    _meta;
    _fonts;
    _colors;
    _autoColor;
    _stylesheets;
    _ins: (string | (() => void))[];

    constructor(settings: Settings) {
        this._settings = settings || {};
        this._meta = {};
        this._fonts = [];
        this._colors = [];
        this._autoColor = null;
        this._stylesheets = [];
        this._ins = [];
    }

    _lookupColor (idx: number) {
        if (idx == 0) {
            if (this._autoColor == null)
                return null;
            return this._colors[this._autoColor];
        }
        if (idx < 0 || idx >= this._colors.length)
            throw new RTFJSError("Invalid color index");
        return this._colors[idx];
    };

    addIns(ins: string | (() => void)) {
        this._ins.push(ins);
    };

};
