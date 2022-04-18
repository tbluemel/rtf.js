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

import { IColor } from "./parser/destinations/ColortblDestinations";

export class RTFJSError extends Error {
    constructor(message: string) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

let isLoggingEnabled = true;

export function loggingEnabled(enabled: boolean): void {
    isLoggingEnabled = enabled;
}

export class Helper {
    public static JUSTIFICATION = {
        LEFT: "left",
        CENTER: "center",
        RIGHT: "right",
        JUSTIFY: "justify",
    };
    public static BREAKTYPE = {
        NONE: "none",
        COL: "col", // TODO: ???
        EVEN: "even",
        ODD: "odd",
        PAGE: "page",
    };
    public static PAGENUMBER = {
        DECIMAL: "decimal",
        UROM: "urom", // TODO: ???
        LROM: "lrom", // TODO: ???
        ULTR: "ultr", // TODO: ???
        LLTR: "lltr", // TODO: ???
    };
    public static UNDERLINE = {
        NONE: "none",
        CONTINUOUS: "continuous",
        DOTTED: "dotted",
        DASHED: "dashed",
        DASHDOTTED: "dashdotted",
        DASHDOTDOTTED: " dashdotdotted",
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
        WAVE: "wave",
    };
    public static FONTPITCH = {
        DEFAULT: 0,
        FIXED: 1,
        VARIABLE: 2,
    };
    public static CHARACTER_TYPE = {
        LOWANSI: "loch",
        HIGHANSI: "hich",
        DOUBLE: "dbch",
    };
    public static SUPERSUBSCRIPT = {
        SUPERSCRIPT: 1,
        NONE: 0,
        SUBSCRIPT: -1,
    };

    public static log(message: string): void {
        if (isLoggingEnabled) {
            console.log(message);
        }
    }

    public static _isalpha(str: string): boolean {
        const len = str.length;
        for (let i = 0; i < len; i++) {
            const ch = str.charCodeAt(i);
            if (!((ch >= this._A && ch <= this._Z) ||
                (ch >= this._a && ch <= this._z))) {
                return false;
            }
        }
        return len > 0;
    }

    public static _isdigit(str: string): boolean {
        const len = str.length;
        for (let i = 0; i < len; i++) {
            const ch = str.charCodeAt(i);
            if (ch < this._0 || ch > this._9) {
                return false;
            }
        }
        return len > 0;
    }

    public static _parseHex(str: string): number {
        const len = str.length;
        for (let i = 0; i < len; i++) {
            const ch = str.charCodeAt(i);
            if (!((ch >= this._0 && ch <= this._9) ||
                (ch >= this._a && ch <= this._f) ||
                (ch >= this._A && ch <= this._F))) {
                return NaN;
            }
        }
        if (len > 0) {
            return parseInt(str, 16);
        }
        return NaN;
    }

    public static _blobToBinary(blob: ArrayBuffer): string {
        const view = new Uint8Array(blob);
        let ret = "";
        const len = view.length;
        for (let i = 0; i < len; i++) {
            ret += String.fromCharCode(view[i]);
        }
        return ret;
    }

    public static _hexToBlob(str: string): ArrayBuffer {
        let len = str.length;
        const buf = new ArrayBuffer(Math.floor(len-- / 2));
        const view = new Uint8Array(buf);
        let d = 0;
        for (let i = 0; i < len; i += 2) {
            const val = this._parseHex(str.substr(i, 2));
            if (isNaN(val)) {
                return null;
            }
            view[d++] = val;
        }
        return buf;
    }

    public static _hexToBinary(str: string): string {
        let bin = "";
        const len = str.length - 1;
        for (let i = 0; i < len; i += 2) {
            const val = this._parseHex(str.substr(i, 2));
            if (isNaN(val)) {
                return null;
            }
            bin += String.fromCharCode(val);
        }
        return bin;
    }

    public static _mapCharset(idx: number): number {
        return this._charsetMap[idx.toString()];
    }

    public static _mapColorTheme(name: string): null {
        return this._colorThemeMap[name];
    }

    public static _colorToStr(color: IColor): string {
        return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    }

    public static _twipsToPt(twips: number): number {
        return Math.floor(twips / 20);
    }

    public static _twipsToPx(twips: number): number {
        return Math.floor(twips / 20 * 96 / 72);
    }

    public static _pxToTwips(px: number): number {
        return Math.floor(px * 20 * 72 / 96);
    }

    private static _A = "A".charCodeAt(0);
    private static _a = "a".charCodeAt(0);
    private static _F = "F".charCodeAt(0);
    private static _f = "f".charCodeAt(0);
    private static _Z = "Z".charCodeAt(0);
    private static _z = "z".charCodeAt(0);
    private static _0 = "0".charCodeAt(0);
    private static _9 = "9".charCodeAt(0);

    private static _charsetMap: { [key: string]: number } = {
        0: 1252,  // ANSI_CHARSET
        2: 42,    // Symbol (this is not a real charset, CP_SYMBOL maps unicode characters into a different range)
        77: 10000, // Mac Roman
        78: 10001, // Mac Shift Jis
        79: 10003, // Mac Hangul
        80: 10008, // Mac GB2312
        81: 10002, // Mac Big5
        83: 10005, // Mac Hebrew
        84: 10004, // Mac Arabic
        85: 10006, // Mac Greek
        86: 10081, // Mac Turkish
        87: 10021, // Mac Thai
        88: 10029, // Mac East Europe
        89: 10007, // Mac Russian
        128: 932,   // SHIFTJIS_CHARSET
        129: 949,   // HANGEUL_CHARSET
        130: 1361,  // JOHAB_CHARSET
        134: 936,   // GB2313_CHARSET
        136: 950,   // CHINESEBIG5_CHARSET
        161: 1253,  // GREEK_CHARSET
        162: 1254,  // TURKISH_CHARSET
        163: 1258,  // VIETNAMESE_CHARSET
        177: 1255,  // HEBREW_CHARSET
        178: 1256,  // ARABIC_CHARSET
        186: 1257,  // BALTIC_CHARSET
        204: 1251,  // RUSSIAN_CHARSET
        222: 874,   // THAI_CHARSET
        238: 1250,  // EE_CHARSET (Eastern European)
        254: 437,   // PC 437
        255: 850,   // OEM
    };

    private static _colorThemeMap: { [key: string]: null } = {
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
    };
}
