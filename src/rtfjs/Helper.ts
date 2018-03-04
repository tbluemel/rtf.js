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

import { Color } from './parser/Destinations';

export interface RTFJSError {
    name: string;
    message: string;
    stack: string;
}

export const RTFJSError = function(message: string) {
    this.name = 'RTFJSError';
    this.message = message;
    this.stack = (new Error()).stack;
} as any as { new (message: string): RTFJSError; }
RTFJSError.prototype = new Error;

let isLoggingEnabled = true;
export function loggingEnabled(enabled: boolean){
    isLoggingEnabled = enabled;
}

export class Helper {
    static log(message: string){
        if(isLoggingEnabled) {
            console.log(message);
        }
    };
    static _A = "A".charCodeAt(0);
    static _a = "a".charCodeAt(0);
    static _F = "F".charCodeAt(0);
    static _f = "f".charCodeAt(0);
    static _Z = "Z".charCodeAt(0);
    static _z = "z".charCodeAt(0);
    static _0 = "0".charCodeAt(0);
    static _9 = "9".charCodeAt(0);

    static JUSTIFICATION = {
        LEFT: "left",
        CENTER: "center",
        RIGHT: "right",
        JUSTIFY: "justify"
    };
    static BREAKTYPE = {
        NONE: "none",
        COL: "col", // TODO: ???
        EVEN: "even",
        ODD: "odd",
        PAGE: "page"
    };
    static PAGENUMBER = {
        DECIMAL: "decimal",
        UROM: "urom", // TODO: ???
        LROM: "lrom", // TODO: ???
        ULTR: "ultr", // TODO: ???
        LLTR: "lltr" // TODO: ???
    };
    static UNDERLINE = {
        NONE: "none",
        CONTINUOUS: "continuous",
        DOTTED: "dotted",
        DASHED: "dashed",
        DASHDOTTED: "dashdotted",
        DASHDOTDOTTED:" dashdotdotted",
        DOUBLE: "double",
        HEAVYWAVE: "heavywave",
        LONGDASHED: "longdashed",
        THICK: "thick",
        THICKDOTTED: "thickdotted",
        THICKDASHED: "thickdashed",
        THICKDASHDOTTED: "thickdashdotted",
        THICKDASHDOTDOTTED: "thickdashdotdotted",
        THICKLONGDASH: "thicklongdash",
        DOUBLEWAVE: "doublewave",
        WORD: "word",
        WAVE: "wave"
    };
    static FONTPITCH = {
        DEFAULT: 0,
        FIXED: 1,
        VARIABLE: 2
    };
    static CHARACTER_TYPE = {
        LOWANSI: "loch",
        HIGHANSI: "hich",
        DOUBLE: "dbch"
    };

    static _isalpha(str: string): boolean {
        var len = str.length;
        for (var i = 0; i < len; i++) {
            var ch = str.charCodeAt(i);
            if (!((ch >= this._A && ch <= this._Z) ||
                (ch >= this._a && ch <= this._z))) {
                return false;
            }
        }
        return len > 0;
    }

    static _isdigit(str: string): boolean {
        var len = str.length;
        for (var i = 0; i < len; i++) {
            var ch = str.charCodeAt(i);
            if (ch < this._0 || ch > this._9)
                return false;
        }
        return len > 0;
    }

    static _parseHex(str: string): number {
        var len = str.length;
        for (var i = 0; i < len; i++) {
            var ch = str.charCodeAt(i);
            if (!((ch >= this._0 && ch <= this._9) ||
                (ch >= this._a && ch <= this._f) ||
                (ch >= this._A && ch <= this._F))) {
                return NaN
            }
        }
        if (len > 0)
            return parseInt(str, 16);
        return NaN;
    }

    static _blobToBinary(blob: ArrayBuffer): string {
        var view = new Uint8Array(blob);
        var ret = "";
        var len = view.length;
        for (var i = 0; i < len; i++)
            ret += String.fromCharCode(view[i]);
        return ret;
    }

    static _hexToBlob(str: string): ArrayBuffer {
        var len = str.length;
        var buf = new ArrayBuffer(Math.floor(len-- / 2));
        var view = new Uint8Array(buf);
        var d = 0;
        for (var i = 0; i < len; i += 2) {
            var val = this._parseHex(str.substr(i, 2));
            if (isNaN(val))
                return null;
            view[d++] = val;
        }
        return buf;
    }

    static _hexToBinary(str: string): string {
        var bin = ""
        var len = str.length - 1;
        for (var i = 0; i < len; i += 2) {
            var val = this._parseHex(str.substr(i, 2));
            if (isNaN(val))
                return null;
            bin += String.fromCharCode(val);
        }
        return bin;
    }

    static _charsetMap: {[key: string]: number} = {
        "0":   1252, // ANSI_CHARSET
        "77":  10000, // Mac Roman
        "78":  10001, // Mac Shift Jis
        "79":  10003, // Mac Hangul
        "80":  10008, // Mac GB2312
        "81":  10002, // Mac Big5
        "83":  10005, // Mac Hebrew
        "84":  10004, // Mac Arabic
        "85":  10006, // Mac Greek
        "86":  10081, // Mac Turkish
        "87":  10021, // Mac Thai
        "88":  10029, // Mac East Europe
        "89":  10007, // Mac Russian
        "128": 932,  // SHIFTJIS_CHARSET
        "129": 949,  // HANGEUL_CHARSET
        "130": 1361, // JOHAB_CHARSET
        "134": 936,  // GB2313_CHARSET
        "136": 950,  // CHINESEBIG5_CHARSET
        "161": 1253, // GREEK_CHARSET
        "162": 1254, // TURKISH_CHARSET
        "163": 1258, // VIETNAMESE_CHARSET
        "177": 1255, // HEBREW_CHARSET
        "178": 1256, // ARABIC_CHARSET
        "186": 1257, // BALTIC_CHARSET
        "204": 1251, // RUSSIAN_CHARSET
        "222": 874,  // THAI_CHARSET
        "238": 1250, // EE_CHARSET (Eastern European)
        "254": 437,  // PC 437
        "255": 850,  // OEM
    }

    static _mapCharset(idx: number): number {
        return this._charsetMap[idx.toString()];
    }

    static _colorThemeMap: {[key: string]: null} = {
        // TODO
        maindarkone: null,
        mainlightone: null,
        maindarktwo: null,
        mainlighttwo: null,
        accentone: null,
        accenttwo: null,
        accentthree: null,
        accentfour: null,
        accentfive: null,
        accentsix: null,
        hyperlink: null,
        followedhyperlink: null,
        backgroundone: null,
        textone: null,
        backgroundtwo: null,
        texttwo: null,

    }

    static _mapColorTheme(name: string) {
        return this._colorThemeMap[name];
    }

    static _colorToStr(color: Color) {
        return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    }

    static _twipsToPt(twips: number) {
        return Math.floor(twips / 20);
    }

    static _twipsToPx(twips: number) {
        return Math.floor(twips / 20 * 96 / 72);
    }

    static _pxToTwips(px: number) {
        return Math.floor(px * 20 * 72 / 96);
    }
};
