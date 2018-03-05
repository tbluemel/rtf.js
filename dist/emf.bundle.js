(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.EMFJS = {})));
}(this, (function (exports) { 'use strict';

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
// tslint:disable-next-line:variable-name
var EMFJSError = function (message) {
    this.name = "EMFJSError";
    this.message = message;
    this.stack = (new Error()).stack;
};
EMFJSError.prototype = new Error();
var isLoggingEnabled = true;
function loggingEnabled(enabled) {
    isLoggingEnabled = enabled;
}
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.log = function (message) {
        if (isLoggingEnabled) {
            // tslint:disable-next-line:no-console
            console.log(message);
        }
    };
    Helper._makeUniqueId = function (prefix) {
        return "EMFJS_" + prefix + (this._uniqueId++);
    };
    Helper._writeUint32Val = function (uint8arr, pos, val) {
        uint8arr[pos++] = val & 0xff;
        uint8arr[pos++] = (val >>> 8) & 0xff;
        uint8arr[pos++] = (val >>> 16) & 0xff;
        uint8arr[pos++] = (val >>> 24) & 0xff;
    };
    Helper._blobToBinary = function (blob) {
        var ret = "";
        var len = blob.length;
        for (var i = 0; i < len; i++) {
            ret += String.fromCharCode(blob[i]);
        }
        return ret;
    };
    Helper.GDI = {
        FormatSignature: {
            ENHMETA_SIGNATURE: 0x464D4520,
            EPS_SIGNATURE: 0x46535045,
        },
        BITMAPINFOHEADER_SIZE: 40,
        BITMAPCOREHEADER_SIZE: 12,
        RecordType: {
            EMR_POLYBEZIER: 0x00000002,
            EMR_POLYGON: 0x00000003,
            EMR_POLYLINE: 0x00000004,
            EMR_POLYBEZIERTO: 0x00000005,
            EMR_POLYLINETO: 0x00000006,
            EMR_POLYPOLYLINE: 0x00000007,
            EMR_POLYPOLYGON: 0x00000008,
            EMR_SETWINDOWEXTEX: 0x00000009,
            EMR_SETWINDOWORGEX: 0x0000000A,
            EMR_SETVIEWPORTEXTEX: 0x0000000B,
            EMR_SETVIEWPORTORGEX: 0x0000000C,
            EMR_SETBRUSHORGEX: 0x0000000D,
            EMR_EOF: 0x0000000E,
            EMR_SETPIXELV: 0x0000000F,
            EMR_SETMAPPERFLAGS: 0x00000010,
            EMR_SETMAPMODE: 0x00000011,
            EMR_SETBKMODE: 0x00000012,
            EMR_SETPOLYFILLMODE: 0x00000013,
            EMR_SETROP2: 0x00000014,
            EMR_SETSTRETCHBLTMODE: 0x00000015,
            EMR_SETTEXTALIGN: 0x00000016,
            EMR_SETCOLORADJUSTMENT: 0x00000017,
            EMR_SETTEXTCOLOR: 0x00000018,
            EMR_SETBKCOLOR: 0x00000019,
            EMR_OFFSETCLIPRGN: 0x0000001A,
            EMR_MOVETOEX: 0x0000001B,
            EMR_SETMETARGN: 0x0000001C,
            EMR_EXCLUDECLIPRECT: 0x0000001D,
            EMR_INTERSECTCLIPRECT: 0x0000001E,
            EMR_SCALEVIEWPORTEXTEX: 0x0000001F,
            EMR_SCALEWINDOWEXTEX: 0x00000020,
            EMR_SAVEDC: 0x00000021,
            EMR_RESTOREDC: 0x00000022,
            EMR_SETWORLDTRANSFORM: 0x00000023,
            EMR_MODIFYWORLDTRANSFORM: 0x00000024,
            EMR_SELECTOBJECT: 0x00000025,
            EMR_CREATEPEN: 0x00000026,
            EMR_CREATEBRUSHINDIRECT: 0x00000027,
            EMR_DELETEOBJECT: 0x00000028,
            EMR_ANGLEARC: 0x00000029,
            EMR_ELLIPSE: 0x0000002A,
            EMR_RECTANGLE: 0x0000002B,
            EMR_ROUNDRECT: 0x0000002C,
            EMR_ARC: 0x0000002D,
            EMR_CHORD: 0x0000002E,
            EMR_PIE: 0x0000002F,
            EMR_SELECTPALETTE: 0x00000030,
            EMR_CREATEPALETTE: 0x00000031,
            EMR_SETPALETTEENTRIES: 0x00000032,
            EMR_RESIZEPALETTE: 0x00000033,
            EMR_REALIZEPALETTE: 0x00000034,
            EMR_EXTFLOODFILL: 0x00000035,
            EMR_LINETO: 0x00000036,
            EMR_ARCTO: 0x00000037,
            EMR_POLYDRAW: 0x00000038,
            EMR_SETARCDIRECTION: 0x00000039,
            EMR_SETMITERLIMIT: 0x0000003A,
            EMR_BEGINPATH: 0x0000003B,
            EMR_ENDPATH: 0x0000003C,
            EMR_CLOSEFIGURE: 0x0000003D,
            EMR_FILLPATH: 0x0000003E,
            EMR_STROKEANDFILLPATH: 0x0000003F,
            EMR_STROKEPATH: 0x00000040,
            EMR_FLATTENPATH: 0x00000041,
            EMR_WIDENPATH: 0x00000042,
            EMR_SELECTCLIPPATH: 0x00000043,
            EMR_ABORTPATH: 0x00000044,
            EMR_COMMENT: 0x00000046,
            EMR_FILLRGN: 0x00000047,
            EMR_FRAMERGN: 0x00000048,
            EMR_INVERTRGN: 0x00000049,
            EMR_PAINTRGN: 0x0000004A,
            EMR_EXTSELECTCLIPRGN: 0x0000004B,
            EMR_BITBLT: 0x0000004C,
            EMR_STRETCHBLT: 0x0000004D,
            EMR_MASKBLT: 0x0000004E,
            EMR_PLGBLT: 0x0000004F,
            EMR_SETDIBITSTODEVICE: 0x00000050,
            EMR_STRETCHDIBITS: 0x00000051,
            EMR_EXTCREATEFONTINDIRECTW: 0x00000052,
            EMR_EXTTEXTOUTA: 0x00000053,
            EMR_EXTTEXTOUTW: 0x00000054,
            EMR_POLYBEZIER16: 0x00000055,
            EMR_POLYGON16: 0x00000056,
            EMR_POLYLINE16: 0x00000057,
            EMR_POLYBEZIERTO16: 0x00000058,
            EMR_POLYLINETO16: 0x00000059,
            EMR_POLYPOLYLINE16: 0x0000005A,
            EMR_POLYPOLYGON16: 0x0000005B,
            EMR_POLYDRAW16: 0x0000005C,
            EMR_CREATEMONOBRUSH: 0x0000005D,
            EMR_CREATEDIBPATTERNBRUSHPT: 0x0000005E,
            EMR_EXTCREATEPEN: 0x0000005F,
            EMR_POLYTEXTOUTA: 0x00000060,
            EMR_POLYTEXTOUTW: 0x00000061,
            EMR_SETICMMODE: 0x00000062,
            EMR_CREATECOLORSPACE: 0x00000063,
            EMR_SETCOLORSPACE: 0x00000064,
            EMR_DELETECOLORSPACE: 0x00000065,
            EMR_GLSRECORD: 0x00000066,
            EMR_GLSBOUNDEDRECORD: 0x00000067,
            EMR_PIXELFORMAT: 0x00000068,
            EMR_DRAWESCAPE: 0x00000069,
            EMR_EXTESCAPE: 0x0000006A,
            EMR_SMALLTEXTOUT: 0x0000006C,
            EMR_FORCEUFIMAPPING: 0x0000006D,
            EMR_NAMEDESCAPE: 0x0000006E,
            EMR_COLORCORRECTPALETTE: 0x0000006F,
            EMR_SETICMPROFILEA: 0x00000070,
            EMR_SETICMPROFILEW: 0x00000071,
            EMR_ALPHABLEND: 0x00000072,
            EMR_SETLAYOUT: 0x00000073,
            EMR_TRANSPARENTBLT: 0x00000074,
            EMR_GRADIENTFILL: 0x00000076,
            EMR_SETLINKEDUFIS: 0x00000077,
            EMR_SETTEXTJUSTIFICATION: 0x00000078,
            EMR_COLORMATCHTOTARGETW: 0x00000079,
            EMR_CREATECOLORSPACEW: 0x0000007A,
        },
        MetafileEscapes: {
            NEWFRAME: 0x0001,
            ABORTDOC: 0x0002,
            NEXTBAND: 0x0003,
            SETCOLORTABLE: 0x0004,
            GETCOLORTABLE: 0x0005,
            FLUSHOUT: 0x0006,
            DRAFTMODE: 0x0007,
            QUERYESCSUPPORT: 0x0008,
            SETABORTPROC: 0x0009,
            STARTDOC: 0x000a,
            ENDDOC: 0x000b,
            GETPHYSPAGESIZE: 0x000c,
            GETPRINTINGOFFSET: 0x000d,
            GETSCALINGFACTOR: 0x000e,
            META_ESCAPE_ENHANCED_METAFILE: 0x000f,
            SETPENWIDTH: 0x0010,
            SETCOPYCOUNT: 0x0011,
            SETPAPERSOURCE: 0x0012,
            PASSTHROUGH: 0x0013,
            GETTECHNOLOGY: 0x0014,
            SETLINECAP: 0x0015,
            SETLINEJOIN: 0x0016,
            SETMITERLIMIT: 0x0017,
            BANDINFO: 0x0018,
            DRAWPATTERNRECT: 0x0019,
            GETVECTORPENSIZE: 0x001a,
            GETVECTORBRUSHSIZE: 0x001b,
            ENABLEDUPLEX: 0x001c,
            GETSETPAPERBINS: 0x001d,
            GETSETPRINTORIENT: 0x001e,
            ENUMPAPERBINS: 0x001f,
            SETDIBSCALING: 0x0020,
            EPSPRINTING: 0x0021,
            ENUMPAPERMETRICS: 0x0022,
            GETSETPAPERMETRICS: 0x0023,
            POSTSCRIPT_DATA: 0x0025,
            POSTSCRIPT_IGNORE: 0x0026,
            GETDEVICEUNITS: 0x002a,
            GETEXTENDEDTEXTMETRICS: 0x0100,
            GETPAIRKERNTABLE: 0x0102,
            EXTTEXTOUT: 0x0200,
            GETFACENAME: 0x0201,
            DOWNLOADFACE: 0x0202,
            METAFILE_DRIVER: 0x0801,
            QUERYDIBSUPPORT: 0x0c01,
            BEGIN_PATH: 0x1000,
            CLIP_TO_PATH: 0x1001,
            END_PATH: 0x1002,
            OPEN_CHANNEL: 0x100e,
            DOWNLOADHEADER: 0x100f,
            CLOSE_CHANNEL: 0x1010,
            POSTSCRIPT_PASSTHROUGH: 0x1013,
            ENCAPSULATED_POSTSCRIPT: 0x1014,
            POSTSCRIPT_IDENTIFY: 0x1015,
            POSTSCRIPT_INJECTION: 0x1016,
            CHECKJPEGFORMAT: 0x1017,
            CHECKPNGFORMAT: 0x1018,
            GET_PS_FEATURESETTING: 0x1019,
            MXDC_ESCAPE: 0x101a,
            SPCLPASSTHROUGH2: 0x11d8,
        },
        MapMode: {
            MM_TEXT: 1,
            MM_LOMETRIC: 2,
            MM_HIMETRIC: 3,
            MM_LOENGLISH: 4,
            MM_HIENGLISH: 5,
            MM_TWIPS: 6,
            MM_ISOTROPIC: 7,
            MM_ANISOTROPIC: 8,
        },
        StretchMode: {
            BLACKONWHITE: 1,
            WHITEONBLACK: 2,
            COLORONCOLOR: 3,
            HALFTONE: 4,
        },
        MixMode: {
            TRANSPARENT: 1,
            OPAQUE: 2,
        },
        BrushStyle: {
            BS_SOLID: 0,
            BS_NULL: 1,
            BS_HATCHED: 2,
            BS_PATTERN: 3,
            BS_INDEXED: 4,
            BS_DIBPATTERN: 5,
            BS_DIBPATTERNPT: 6,
            BS_PATTERN8X8: 7,
            BS_DIBPATTERN8X8: 8,
            BS_MONOPATTERN: 9,
        },
        PenStyle: {
            PS_COSMETIC: 0x00000000,
            PS_ENDCAP_ROUND: 0x00000000,
            PS_JOIN_ROUND: 0x00000000,
            PS_SOLID: 0x00000000,
            PS_DASH: 0x00000001,
            PS_DOT: 0x00000002,
            PS_DASHDOT: 0x00000003,
            PS_DASHDOTDOT: 0x00000004,
            PS_NULL: 0x00000005,
            PS_INSIDEFRAME: 0x00000006,
            PS_USERSTYLE: 0x00000007,
            PS_ALTERNATE: 0x00000008,
            PS_ENDCAP_SQUARE: 0x00000100,
            PS_ENDCAP_FLAT: 0x00000200,
            PS_JOIN_BEVEL: 0x00001000,
            PS_JOIN_MITER: 0x00002000,
            PS_GEOMETRIC: 0x00010000,
        },
        PolygonFillMode: {
            ALTERNATE: 1,
            WINDING: 2,
        },
        BitmapCompression: {
            BI_RGB: 0,
            BI_RLE8: 1,
            BI_RLE4: 2,
            BI_BITFIELDS: 3,
            BI_JPEG: 4,
            BI_PNG: 5,
        },
        RegionMode: {
            RGN_AND: 1,
            RGN_OR: 2,
            RGN_XOR: 3,
            RGN_DIFF: 4,
            RGN_COPY: 5,
        },
        StockObject: {
            WHITE_BRUSH: 0x80000000,
            LTGRAY_BRUSH: 0x80000001,
            GRAY_BRUSH: 0x80000002,
            DKGRAY_BRUSH: 0x80000003,
            BLACK_BRUSH: 0x80000004,
            NULL_BRUSH: 0x80000005,
            WHITE_PEN: 0x80000006,
            BLACK_PEN: 0x80000007,
            NULL_PEN: 0x80000008,
            OEM_FIXED_FONT: 0x8000000A,
            ANSI_FIXED_FONT: 0x8000000B,
            ANSI_VAR_FONT: 0x8000000C,
            SYSTEM_FONT: 0x8000000D,
            DEVICE_DEFAULT_FONT: 0x8000000E,
            DEFAULT_PALETTE: 0x8000000F,
            SYSTEM_FIXED_FONT: 0x80000010,
            DEFAULT_GUI_FONT: 0x80000011,
            DC_BRUSH: 0x80000012,
            DC_PEN: 0x80000013,
        },
    };
    Helper._uniqueId = 0;
    return Helper;
}());

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var Blob = /** @class */ (function () {
    function Blob(blob, offset) {
        if (blob instanceof Blob) {
            this.blob = blob.blob;
            this.data = blob.data;
            this.pos = offset || blob.pos;
        }
        else {
            this.blob = blob;
            this.data = new Uint8Array(blob);
            this.pos = offset || 0;
        }
    }
    Blob.prototype.eof = function () {
        return this.pos >= this.data.length;
    };
    Blob.prototype.seek = function (newpos) {
        if (newpos < 0 || newpos > this.data.length) {
            throw new EMFJSError("Invalid seek position");
        }
        this.pos = newpos;
    };
    Blob.prototype.skip = function (cnt) {
        var newPos = this.pos + cnt;
        if (newPos > this.data.length) {
            throw new EMFJSError("Unexpected end of file");
        }
        this.pos = newPos;
    };
    Blob.prototype.readBinary = function (cnt) {
        var end = this.pos + cnt;
        if (end > this.data.length) {
            throw new EMFJSError("Unexpected end of file");
        }
        var ret = "";
        while (cnt-- > 0) {
            ret += String.fromCharCode(this.data[this.pos++]);
        }
        return ret;
    };
    Blob.prototype.readInt8 = function () {
        if (this.pos + 1 > this.data.length) {
            throw new EMFJSError("Unexpected end of file");
        }
        return this.data[this.pos++];
    };
    Blob.prototype.readUint8 = function () {
        return this.readInt8() >>> 0;
    };
    Blob.prototype.readInt32 = function () {
        if (this.pos + 4 > this.data.length) {
            throw new EMFJSError("Unexpected end of file");
        }
        var val = this.data[this.pos++];
        val |= this.data[this.pos++] << 8;
        val |= this.data[this.pos++] << 16;
        val |= this.data[this.pos++] << 24;
        return val;
    };
    Blob.prototype.readUint32 = function () {
        return this.readInt32() >>> 0;
    };
    Blob.prototype.readUint16 = function () {
        if (this.pos + 2 > this.data.length) {
            throw new EMFJSError("Unexpected end of file");
        }
        var val = this.data[this.pos++];
        val |= this.data[this.pos++] << 8;
        return val;
    };
    Blob.prototype.readInt16 = function () {
        var val = this.readUint16();
        if (val > 32767) {
            val -= 65536;
        }
        return val;
    };
    Blob.prototype.readString = function (length) {
        if (this.pos + length > this.data.length) {
            throw new EMFJSError("Unexpected end of file");
        }
        var ret = "";
        for (var i = 0; i < length; i++) {
            ret += String.fromCharCode(this.data[this.pos++] >>> 0);
        }
        return ret;
    };
    Blob.prototype.readNullTermString = function (maxSize) {
        var ret = "";
        if (maxSize > 0) {
            maxSize--;
            for (var i = 0; i < maxSize; i++) {
                if (this.pos + i + 1 > this.data.length) {
                    throw new EMFJSError("Unexpected end of file");
                }
                var byte = this.data[this.pos + i] >>> 0;
                if (byte == 0) {
                    break;
                }
                ret += String.fromCharCode(byte);
            }
        }
        return ret;
    };
    Blob.prototype.readFixedSizeUnicodeString = function (fixedSizeChars) {
        var ret = "";
        for (var i = 0; i < fixedSizeChars; i++) {
            var charCode = this.readUint16();
            if (charCode == 0) {
                if (++i < fixedSizeChars) {
                    this.skip((fixedSizeChars - i) * 2);
                }
                break;
            }
            ret += String.fromCharCode(charCode);
        }
        return ret;
    };
    return Blob;
}());

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var PointS = /** @class */ (function () {
    function PointS(reader, x, y) {
        if (reader != null) {
            this.x = reader.readInt16();
            this.y = reader.readInt16();
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    PointS.prototype.clone = function () {
        return new PointS(null, this.x, this.y);
    };
    PointS.prototype.toString = function () {
        return "{x: " + this.x + ", y: " + this.y + "}";
    };
    return PointS;
}());
var PointL = /** @class */ (function () {
    function PointL(reader, x, y) {
        if (reader != null) {
            this.x = reader.readInt32();
            this.y = reader.readInt32();
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    PointL.prototype.clone = function () {
        return new PointL(null, this.x, this.y);
    };
    PointL.prototype.toString = function () {
        return "{x: " + this.x + ", y: " + this.y + "}";
    };
    return PointL;
}());
var RectL = /** @class */ (function () {
    function RectL(reader, left, top, right, bottom) {
        if (reader != null) {
            this.left = reader.readInt32();
            this.top = reader.readInt32();
            this.right = reader.readInt32();
            this.bottom = reader.readInt32();
        }
        else {
            this.bottom = bottom;
            this.right = right;
            this.top = top;
            this.left = left;
        }
    }
    RectL.prototype.clone = function () {
        return new RectL(null, this.left, this.top, this.right, this.bottom);
    };
    RectL.prototype.toString = function () {
        return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
    };
    RectL.prototype.empty = function () {
        return this.left >= this.right || this.top >= this.bottom;
    };
    RectL.prototype.intersect = function (rectL) {
        if (this.empty() || rectL.empty()) {
            return null;
        }
        if (this.left >= rectL.right || this.top >= rectL.bottom ||
            this.right <= rectL.left || this.bottom <= rectL.top) {
            return null;
        }
        return new RectL(null, Math.max(this.left, rectL.left), Math.max(this.top, rectL.top), Math.min(this.right, rectL.right), Math.min(this.bottom, rectL.bottom));
    };
    return RectL;
}());
var SizeL = /** @class */ (function () {
    function SizeL(reader, cx, cy) {
        if (reader != null) {
            this.cx = reader.readUint32();
            this.cy = reader.readUint32();
        }
        else {
            this.cx = cx;
            this.cy = cy;
        }
    }
    SizeL.prototype.clone = function () {
        return new SizeL(null, this.cx, this.cy);
    };
    SizeL.prototype.toString = function () {
        return "{cx: " + this.cx + ", cy: " + this.cy + "}";
    };
    return SizeL;
}());
var Obj = /** @class */ (function () {
    function Obj(type) {
        this.type = type;
    }
    Obj.prototype.clone = function () {
        throw new EMFJSError("clone not implemented");
    };
    Obj.prototype.toString = function () {
        throw new EMFJSError("toString not implemented");
    };
    return Obj;
}());

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Region = /** @class */ (function (_super) {
    __extends(Region, _super);
    function Region(reader, copy) {
        var _this = _super.call(this, "region") || this;
        if (reader != null) {
            var hdrSize = reader.readUint32();
            if (hdrSize != 32) {
                throw new EMFJSError("Invalid region header");
            }
            reader.skip(4);
            var rectCnt = reader.readUint32();
            var rgnSize = reader.readUint32();
            if (rectCnt * 16 != rgnSize) {
                throw new EMFJSError("Invalid region data");
            }
            _this.bounds = new RectL(reader);
            _this.scans = [];
            var scanLine = void 0;
            for (var i = 0; i < rectCnt; i++) {
                var r = new RectL(reader);
                if (scanLine == null || scanLine.top != r.top || scanLine.bottom != r.bottom) {
                    scanLine = new Scan(r);
                    _this.scans.push(scanLine);
                }
                else {
                    scanLine.append(r);
                }
            }
            _this._updateComplexity();
        }
        else if (copy != null) {
            _this.bounds = copy.bounds != null ? copy.bounds.clone() : null;
            if (copy.scans != null) {
                _this.scans = [];
                for (var i = 0; i < copy.scans.length; i++) {
                    _this.scans.push(copy.scans[i].clone());
                }
            }
            else {
                _this.scans = null;
            }
            _this.complexity = copy.complexity;
        }
        else {
            _this.bounds = null;
            _this.scans = null;
            _this.complexity = 0;
        }
        return _this;
    }
    Region.prototype.clone = function () {
        return new Region(null, this);
    };
    Region.prototype.toString = function () {
        var _complexity = ["null", "simple", "complex"];
        return "{complexity: " + _complexity[this.complexity] + " bounds: " + (this.bounds != null ? this.bounds.toString() : "[none]") + " #scans: " + (this.scans != null ? this.scans.length : "[none]") + "}";
    };
    Region.prototype._updateComplexity = function () {
        if (this.bounds == null) {
            this.complexity = 0;
            this.scans = null;
        }
        else if (this.bounds.empty()) {
            this.complexity = 0;
            this.scans = null;
            this.bounds = null;
        }
        else if (this.scans == null) {
            this.complexity = 1;
        }
        else {
            this.complexity = 2;
            if (this.scans.length == 1) {
                var scan = this.scans[0];
                if (scan.top == this.bounds.top && scan.bottom == this.bounds.bottom && scan.scanlines.length == 1) {
                    var scanline = scan.scanlines[0];
                    if (scanline.left == this.bounds.left && scanline.right == this.bounds.right) {
                        this.scans = null;
                        this.complexity = 1;
                    }
                }
            }
        }
    };
    Region.prototype.subtract = function (rect) {
        Helper.log("[emf] Region " + this.toString() + " subtract " + rect.toString());
        if (this.bounds != null) {
            var isect = this.bounds.intersect(rect);
            if (isect != null) {
                if (this.scans == null) {
                    // We currently have a simple region and there is some kind of an overlap.
                    // We need to create scanlines now.  Simplest method is to fake one scan line
                    // that equals the simple region and re-use the same logic as for complex regions
                    this.scans = [];
                    this.scans.push(new Scan(new RectL(null, this.bounds.left, this.bounds.top, this.bounds.right, this.bounds.bottom)));
                    this.complexity = 2;
                }
                // We (now) have a complex region.  First we skip any scans that are entirely above rect.top
                // The first scan that falls partially below rect.top needs to be split into two scans.
                var si = 0;
                while (si < this.scans.length) {
                    var scan = this.scans[si];
                    if (scan.bottom >= rect.top) {
                        // We need to clone this scan into two so that we can subtract from the second one
                        var cloned = scan.clone();
                        scan.bottom = rect.top - 1;
                        cloned.top = rect.top;
                        if (scan.top >= scan.bottom) {
                            this.scans[si] = cloned;
                        }
                        else {
                            Helper.log("[emf] Region split top scan " + si + " for substraction");
                            this.scans.splice(++si, 0, cloned);
                        }
                        break;
                    }
                    si++;
                }
                // Now find the first one that falls at least partially below rect.bottom, which needs to be
                // split if it is only partially below rect.bottom
                var first = si;
                while (si < this.scans.length) {
                    var scan = this.scans[si];
                    if (scan.top > rect.bottom) {
                        break;
                    }
                    if (scan.bottom > rect.bottom) {
                        // We need to clone this scan into two so that we can subtract from the first one
                        var cloned = scan.clone();
                        scan.bottom = rect.bottom;
                        cloned.top = rect.bottom + 1;
                        if (scan.top >= scan.bottom) {
                            this.scans[si] = cloned;
                        }
                        else {
                            Helper.log("[emf] Region split bottom scan " + si + " for substraction");
                            this.scans.splice(++si, 0, cloned);
                        }
                        break;
                    }
                    si++;
                }
                // Now perform a subtraction on each scan in between rect.top and rect.bottom.  Because we
                // cloned scans that partially overlapped rect.top and rect.bottom, we don't have to
                // account for this anymore.
                if (first < this.scans.length) {
                    var last = si;
                    si = first;
                    while (si < last) {
                        var scan = this.scans[si];
                        if (!scan.subtract(rect.left, rect.right)) {
                            Helper.log("[emf] Region remove now empty scan " + si + " due to subtraction");
                            this.scans.splice(si, 1);
                            last--;
                            continue;
                        }
                        si++;
                    }
                }
                // Update bounds
                if (this.scans != null) {
                    var left = void 0;
                    var top_1;
                    var right = void 0;
                    var bottom = void 0;
                    var len = this.scans.length;
                    for (var i = 0; i < len; i++) {
                        var scan = this.scans[i];
                        if (i == 0) {
                            top_1 = scan.top;
                        }
                        if (i == len - 1) {
                            bottom = scan.bottom;
                        }
                        var slen = scan.scanlines.length;
                        if (slen > 0) {
                            var scanline = scan.scanlines[0];
                            if (left == null || scanline.left < left) {
                                left = scanline.left;
                            }
                            scanline = scan.scanlines[slen - 1];
                            if (right == null || scanline.right > right) {
                                right = scanline.right;
                            }
                        }
                    }
                    if (left != null && top_1 != null && right != null && bottom != null) {
                        this.bounds = new RectL(null, left, top_1, right, bottom);
                        this._updateComplexity();
                    }
                    else {
                        // This has to be a null region now
                        this.bounds = null;
                        this.scans = null;
                        this.complexity = 0;
                    }
                }
                else {
                    this._updateComplexity();
                }
            }
        }
        Helper.log("[emf] Region subtraction -> " + this.toString());
    };
    Region.prototype.intersect = function (rect) {
        Helper.log("[emf] Region " + this.toString() + " intersect with " + rect.toString());
        if (this.bounds != null) {
            this.bounds = this.bounds.intersect(rect);
            if (this.bounds != null) {
                if (this.scans != null) {
                    var si = 0;
                    // Remove any scans that are entirely above the new bounds.top
                    while (si < this.scans.length) {
                        var scan = this.scans[si];
                        if (scan.bottom < this.bounds.top) {
                            si++;
                        }
                        else {
                            break;
                        }
                    }
                    if (si > 0) {
                        Helper.log("[emf] Region remove " + si + " scans from top");
                        this.scans.splice(0, si);
                        // Adjust the first scan's top to match the new bounds.top
                        if (this.scans.length > 0) {
                            this.scans[0].top = this.bounds.top;
                        }
                    }
                    // Get rid of anything that falls outside the new bounds.left/bounds.right
                    si = 0;
                    while (si < this.scans.length) {
                        var scan = this.scans[si];
                        if (scan.top > this.bounds.bottom) {
                            // Remove this and all remaining scans that fall entirely below the new bounds.bottom
                            Helper.log("[emf] Region remove " + (this.scans.length - si) + " scans from bottom");
                            this.scans.splice(si, this.scans.length - si);
                            break;
                        }
                        if (!scan.intersect(this.bounds.left, this.bounds.right)) {
                            // Remove now empty scan
                            Helper.log("[emf] Region remove now empty scan " + si + " due to intersection");
                            this.scans.splice(si, 1);
                            continue;
                        }
                        si++;
                    }
                    // If there are any scans left, adjust the last one's bottom to the new bounds.bottom
                    if (this.scans.length > 0) {
                        this.scans[this.scans.length - 1].bottom = this.bounds.bottom;
                    }
                    this._updateComplexity();
                }
            }
            else {
                this.scans = null;
                this.complexity = 0;
            }
        }
        Helper.log("[emf] Region intersection -> " + this.toString());
    };
    Region.prototype.offset = function (offX, offY) {
        if (this.bounds != null) {
            this.bounds.left += offX;
            this.bounds.top += offY;
            this.bounds.right += offX;
            this.bounds.bottom += offY;
        }
        if (this.scans != null) {
            var slen = this.scans.length;
            for (var si = 0; si < slen; si++) {
                var scan = this.scans[si];
                scan.top += offY;
                scan.bottom += offY;
                var len = scan.scanlines.length;
                for (var i = 0; i < len; i++) {
                    var scanline = scan.scanlines[i];
                    scanline.left += offX;
                    scanline.right += offX;
                }
            }
        }
    };
    return Region;
}(Obj));
function CreateSimpleRegion(left, top, right, bottom) {
    var rgn = new Region(null, null);
    rgn.bounds = new RectL(null, left, top, right, bottom);
    rgn._updateComplexity();
    return rgn;
}
var Scan = /** @class */ (function () {
    function Scan(r, copy) {
        if (r != null) {
            this.top = r.top;
            this.bottom = r.bottom;
            this.scanlines = [{ left: r.left, right: r.right }];
        }
        else if (copy != null) {
            this.top = copy.top;
            this.bottom = copy.bottom;
            this.scanlines = [];
            for (var i = 0; i < copy.scanlines.length; i++) {
                var scanline = copy.scanlines[i];
                this.scanlines.push({ left: scanline.left, right: scanline.right });
            }
        }
    }
    Scan.prototype.clone = function () {
        return new Scan(null, this);
    };
    Scan.prototype.append = function (r) {
        this.scanlines.push({ left: r.left, right: r.right });
    };
    Scan.prototype.subtract = function (left, right) {
        var i;
        // Keep everything on the left side
        i = 0;
        while (i < this.scanlines.length) {
            var scanline = this.scanlines[i];
            if (scanline.left <= left) {
                if (scanline.right >= left) {
                    scanline.right = left - 1;
                    if (scanline.left >= scanline.right) {
                        this.scanlines.splice(i, 1);
                        continue;
                    }
                }
                i++;
            }
            else {
                break;
            }
        }
        // Find the first one that may exceed to the right side
        var first = i;
        var cnt = 0;
        while (i < this.scanlines.length) {
            var scanline = this.scanlines[i];
            if (scanline.right > right) {
                scanline.left = right;
                cnt = i - first;
                if (scanline.left >= scanline.right) {
                    cnt++;
                }
                break;
            }
            i++;
        }
        // Delete everything we're subtracting
        if (cnt > 0 && first < this.scanlines.length) {
            this.scanlines.splice(first, cnt);
        }
        return this.scanlines.length > 0;
    };
    Scan.prototype.intersect = function (left, right) {
        // Get rid of anything that falls entirely outside to the left
        for (var i = 0; i < this.scanlines.length; i++) {
            var scanline = this.scanlines[i];
            if (scanline.left >= left || scanline.right >= left) {
                if (i > 0) {
                    this.scanlines.splice(0, i);
                }
                break;
            }
        }
        if (this.scanlines.length > 0) {
            // Adjust the first to match the left, if needed
            var scanline = this.scanlines[0];
            if (scanline.left < left) {
                scanline.left = left;
            }
            // Get rid of anything that falls entirely outside to the right
            for (var i = 0; i < this.scanlines.length; i++) {
                scanline = this.scanlines[i];
                if (scanline.left > right) {
                    this.scanlines.splice(i, this.scanlines.length - i);
                    break;
                }
            }
            if (this.scanlines.length > 0) {
                // Adjust the last to match the right, if needed
                scanline = this.scanlines[this.scanlines.length - 1];
                if (scanline.right > right) {
                    scanline.right = right;
                }
            }
        }
        return this.scanlines.length > 0;
    };
    return Scan;
}());

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BitmapBase = /** @class */ (function () {
    function BitmapBase() {
    }
    BitmapBase.prototype.getWidth = function () {
        throw new EMFJSError("getWidth not implemented");
    };
    BitmapBase.prototype.getHeight = function () {
        throw new EMFJSError("getHeight not implemented");
    };
    return BitmapBase;
}());
var BitmapCoreHeader = /** @class */ (function () {
    function BitmapCoreHeader(reader, skipsize) {
        if (skipsize) {
            reader.skip(4);
        }
        this.width = reader.readUint16();
        this.height = reader.readUint16();
        this.planes = reader.readUint16();
        this.bitcount = reader.readUint16();
    }
    BitmapCoreHeader.prototype.colors = function () {
        return this.bitcount <= 8 ? 1 << this.bitcount : 0;
    };
    return BitmapCoreHeader;
}());
var BitmapInfoHeader = /** @class */ (function () {
    function BitmapInfoHeader(reader, skipsize) {
        if (skipsize) {
            reader.skip(4);
        }
        this.width = reader.readInt32();
        this.height = reader.readInt32();
        this.planes = reader.readUint16();
        this.bitcount = reader.readUint16();
        this.compression = reader.readUint32();
        this.sizeimage = reader.readUint32();
        this.xpelspermeter = reader.readInt32();
        this.ypelspermeter = reader.readInt32();
        this.clrused = reader.readUint32();
        this.clrimportant = reader.readUint32();
    }
    BitmapInfoHeader.prototype.colors = function () {
        if (this.clrused != 0) {
            return this.clrused < 256 ? this.clrused : 256;
        }
        else {
            return this.bitcount > 8 ? 0 : 1 << this.bitcount;
        }
    };
    return BitmapInfoHeader;
}());
var BitmapInfo = /** @class */ (function (_super) {
    __extends$1(BitmapInfo, _super);
    function BitmapInfo(reader, usergb) {
        var _this = _super.call(this) || this;
        _this._reader = reader;
        _this._offset = reader.pos;
        _this._usergb = usergb;
        var hdrsize = reader.readUint32();
        _this._infosize = hdrsize;
        if (hdrsize == Helper.GDI.BITMAPCOREHEADER_SIZE) {
            _this._header = new BitmapCoreHeader(reader, false);
            _this._infosize += _this._header.colors() * (usergb ? 3 : 2);
        }
        else {
            _this._header = new BitmapInfoHeader(reader, false);
            var masks = _this._header.compression == Helper.GDI.BitmapCompression.BI_BITFIELDS ? 3 : 0;
            if (hdrsize <= Helper.GDI.BITMAPINFOHEADER_SIZE + (masks * 4)) {
                _this._infosize = Helper.GDI.BITMAPINFOHEADER_SIZE + (masks * 4);
            }
            _this._infosize += _this._header.colors() * (usergb ? 4 : 2);
        }
        return _this;
    }
    BitmapInfo.prototype.getWidth = function () {
        return this._header.width;
    };
    BitmapInfo.prototype.getHeight = function () {
        return Math.abs(this._header.height);
    };
    BitmapInfo.prototype.infosize = function () {
        return this._infosize;
    };
    BitmapInfo.prototype.header = function () {
        return this._header;
    };
    return BitmapInfo;
}(BitmapBase));
var DIBitmap = /** @class */ (function (_super) {
    __extends$1(DIBitmap, _super);
    function DIBitmap(reader, bitmapInfo) {
        var _this = _super.call(this) || this;
        _this._reader = reader;
        _this._offset = reader.pos;
        _this._location = bitmapInfo;
        _this._info = new BitmapInfo(reader, true);
        return _this;
    }
    DIBitmap.prototype.getWidth = function () {
        return this._info.getWidth();
    };
    DIBitmap.prototype.getHeight = function () {
        return this._info.getHeight();
    };
    DIBitmap.prototype.totalSize = function () {
        return this._location.header.size + this._location.data.size;
    };
    DIBitmap.prototype.makeBitmapFileHeader = function () {
        var buf = new ArrayBuffer(14);
        var view = new Uint8Array(buf);
        view[0] = 0x42;
        view[1] = 0x4d;
        Helper._writeUint32Val(view, 2, this.totalSize() + 14);
        Helper._writeUint32Val(view, 10, this._info.infosize() + 14);
        return Helper._blobToBinary(view);
    };
    DIBitmap.prototype.base64ref = function () {
        var prevpos = this._reader.pos;
        this._reader.seek(this._offset);
        var mime = "image/bmp";
        var header = this._info.header();
        var data;
        if (header instanceof BitmapInfoHeader && header.compression != null) {
            switch (header.compression) {
                case Helper.GDI.BitmapCompression.BI_JPEG:
                    mime = "data:image/jpeg";
                    break;
                case Helper.GDI.BitmapCompression.BI_PNG:
                    mime = "data:image/png";
                    break;
                default:
                    data = this.makeBitmapFileHeader();
                    break;
            }
        }
        else {
            data = this.makeBitmapFileHeader();
        }
        this._reader.seek(this._location.header.offset);
        if (data != null) {
            data += this._reader.readBinary(this._location.header.size);
        }
        else {
            data = this._reader.readBinary(this._location.header.size);
        }
        this._reader.seek(this._location.data.offset);
        data += this._reader.readBinary(this._location.data.size);
        var ref = "data:" + mime + ";base64," + btoa(data);
        this._reader.seek(prevpos);
        return ref;
    };
    return DIBitmap;
}(BitmapBase));

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ColorRef = /** @class */ (function () {
    function ColorRef(reader, r, g, b) {
        if (reader != null) {
            this.r = reader.readUint8();
            this.g = reader.readUint8();
            this.b = reader.readUint8();
            reader.skip(1);
        }
        else {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }
    ColorRef.prototype.clone = function () {
        return new ColorRef(null, this.r, this.g, this.b);
    };
    ColorRef.prototype.toHex = function () {
        var rgb = (this.r << 16) | (this.g << 8) | this.b;
        return (0x1000000 + rgb).toString(16).slice(1);
    };
    ColorRef.prototype.toString = function () {
        return "{r: " + this.r + ", g: " + this.g + ", b: " + this.b + "}";
    };
    return ColorRef;
}());
var Font = /** @class */ (function (_super) {
    __extends$2(Font, _super);
    function Font(reader, copy) {
        var _this = _super.call(this, "font") || this;
        if (reader != null) {
            _this.height = reader.readInt32();
            _this.width = reader.readInt32();
            _this.escapement = reader.readInt32();
            _this.orientation = reader.readInt32();
            _this.weight = reader.readInt32();
            _this.italic = reader.readUint8();
            _this.underline = reader.readUint8();
            _this.strikeout = reader.readUint8();
            _this.charset = reader.readUint8();
            _this.outprecision = reader.readUint8();
            _this.clipprecision = reader.readUint8();
            _this.quality = reader.readUint8();
            var pitchAndFamily = reader.readUint8();
            _this.pitch = pitchAndFamily & 0xf; // TODO: double check
            _this.family = (pitchAndFamily >> 6) & 0x3; // TODO: double check
            var dataLength = copy;
            var start = reader.pos;
            _this.facename = reader.readFixedSizeUnicodeString(Math.min(dataLength - (reader.pos - start), 32));
        }
        else if (copy != null) {
            copy = copy;
            _this.height = copy.height;
            _this.width = copy.width;
            _this.escapement = copy.escapement;
            _this.orientation = copy.orientation;
            _this.weight = copy.weight;
            _this.italic = copy.italic;
            _this.underline = copy.underline;
            _this.strikeout = copy.strikeout;
            _this.charset = copy.charset;
            _this.outprecision = copy.outprecision;
            _this.clipprecision = copy.clipprecision;
            _this.quality = copy.quality;
            _this.pitch = copy.pitch;
            _this.family = copy.family;
            _this.facename = copy.facename;
        }
        else {
            // TODO: Values for a default font?
            _this.height = -80;
            _this.width = 0;
            _this.escapement = 0;
            _this.orientation = 0;
            _this.weight = 400;
            _this.italic = 0;
            _this.underline = 0;
            _this.strikeout = 0;
            _this.charset = 0;
            _this.outprecision = 0;
            _this.clipprecision = 0;
            _this.quality = 0;
            _this.pitch = 0;
            _this.family = 0;
            _this.facename = "Helvetica";
        }
        return _this;
    }
    Font.prototype.clone = function () {
        return new Font(null, this);
    };
    Font.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return Font;
}(Obj));
var Brush = /** @class */ (function (_super) {
    __extends$2(Brush, _super);
    function Brush(reader, copy) {
        var _this = _super.call(this, "brush") || this;
        if (reader != null) {
            var start = reader.pos;
            _this.style = reader.readUint32();
            switch (_this.style) {
                case Helper.GDI.BrushStyle.BS_SOLID:
                    _this.color = new ColorRef(reader);
                    break;
                case Helper.GDI.BrushStyle.BS_PATTERN:
                    _this.pattern = new DIBitmap(reader);
                    break;
                case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                    _this.dibpatternpt = new DIBitmap(reader);
                    break;
                case Helper.GDI.BrushStyle.BS_HATCHED:
                    _this.color = new ColorRef(reader);
                    _this.hatchstyle = reader.readUint32();
                    break;
            }
            reader.seek(start + 12);
        }
        else {
            _this.style = copy.style;
            switch (_this.style) {
                case Helper.GDI.BrushStyle.BS_SOLID:
                    _this.color = copy.color.clone();
                    break;
                case Helper.GDI.BrushStyle.BS_PATTERN:
                    _this.pattern = copy.pattern;
                    break;
                case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                    _this.dibpatternpt = copy.dibpatternpt;
                    break;
                case Helper.GDI.BrushStyle.BS_HATCHED:
                    _this.color = copy.color.clone();
                    _this.hatchstyle = copy.hatchstyle;
                    break;
            }
        }
        return _this;
    }
    Brush.prototype.clone = function () {
        return new Brush(null, this);
    };
    Brush.prototype.toString = function () {
        var ret = "{style: " + this.style;
        switch (this.style) {
            case Helper.GDI.BrushStyle.BS_SOLID:
                ret += ", color: " + this.color.toString();
                break;
            case Helper.GDI.BrushStyle.BS_HATCHED:
                ret += ", color: " + this.color.toString() + ", hatchstyle: " + this.hatchstyle;
                break;
        }
        return ret + "}";
    };
    return Brush;
}(Obj));
var Pen = /** @class */ (function (_super) {
    __extends$2(Pen, _super);
    function Pen(reader, style, width, color, brush) {
        var _this = _super.call(this, "pen") || this;
        if (reader != null) {
            if (style != null) {
                _this.style = reader.readUint32() & 0xFF;
                _this.width = reader.readUint32();
                _this.brush = new Brush(reader);
                _this.color = _this.brush.color != null ? _this.brush.color.clone() : new ColorRef(null, 0, 0, 0);
                // TODO: NumStyleEntries, StyleEntry
            }
            else {
                // LogPen
                _this.style = reader.readUint32() & 0xFF;
                _this.width = (new PointL(reader)).x;
                _this.color = new ColorRef(reader);
            }
        }
        else {
            _this.style = style;
            _this.width = width;
            if (color != null) {
                _this.color = color;
            }
            if (brush != null) {
                _this.brush = brush;
            }
        }
        return _this;
    }
    Pen.prototype.clone = function () {
        return new Pen(null, this.style, this.width, this.color != null ? this.color.clone() : null, this.brush != null ? this.brush.clone() : null);
    };
    Pen.prototype.toString = function () {
        return "{style: " + this.style + ", width: " + this.width + ", color: " + (this.color != null ? this.color.toString() : "none") + "}";
    };
    return Pen;
}(Obj));

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var EmfHeader = /** @class */ (function () {
    function EmfHeader(reader, headerSize) {
        var recordStart = reader.pos - 8;
        this.size = headerSize;
        this.bounds = new RectL(reader);
        this.frame = new RectL(reader);
        if (reader.readUint32() != Helper.GDI.FormatSignature.ENHMETA_SIGNATURE) {
            throw new EMFJSError("Invalid header signature");
        }
        reader.skip(4); // version
        reader.skip(4); // bytes (size of metafile)
        reader.skip(4); // number of records
        reader.skip(2); // number of handles
        reader.skip(2); // reserved
        var descriptionLen = reader.readUint32();
        var descriptionOff = reader.readUint32();
        this.nPalEntries = reader.readUint32();
        this.refDevCx = reader.readUint32();
        this.refDevCy = reader.readUint32();
        this.refDevCxMm = reader.readUint32();
        this.refDevCyMm = reader.readUint32();
        var hdrSize = headerSize;
        if (descriptionLen > 0) {
            if (descriptionOff < 88) {
                throw new EMFJSError("Invalid header description offset");
            }
            hdrSize = descriptionOff + (descriptionLen * 2);
            if (hdrSize > headerSize) {
                throw new EMFJSError("Invalid header description length");
            }
            var prevPos = reader.pos;
            reader.seek(recordStart + descriptionOff);
            this.description = reader.readFixedSizeUnicodeString(descriptionLen);
            reader.seek(prevPos);
        }
        else {
            this.description = "";
        }
        if (hdrSize >= 100) {
            // We have a EmfMetafileHeaderExtension1 record
            var pixelFormatSize = reader.readUint32();
            var pixelFormatOff = reader.readUint32();
            var haveOpenGl = reader.readUint32();
            if (haveOpenGl != 0) {
                throw new EMFJSError("OpenGL records are not yet supported");
            }
            if (pixelFormatOff != 0) {
                if (pixelFormatOff < 100 || pixelFormatOff < hdrSize) {
                    throw new EMFJSError("Invalid pixel format offset");
                }
                hdrSize = pixelFormatOff + pixelFormatSize;
                if (hdrSize > headerSize) {
                    throw new EMFJSError("Invalid pixel format size");
                }
                // TODO: read pixel format blob
            }
            if (hdrSize >= 108) {
                // We have a EmfMetafileHeaderExtension2 record
                this.displayDevCxUm = reader.readUint32(); // in micrometers
                this.displayDevCyUm = reader.readUint32(); // in micrometers
            }
        }
    }
    EmfHeader.prototype.toString = function () {
        return "{bounds: " + this.bounds.toString() + ", frame: " + this.frame.toString() + ", description: " + this.description + "}";
    };
    return EmfHeader;
}());
var EMFRecords = /** @class */ (function () {
    function EMFRecords(reader, first) {
        this._records = [];
        this._header = new EmfHeader(reader, first);
        var all = false;
        var curpos = first;
        var _loop_1 = function () {
            reader.seek(curpos);
            var type = reader.readUint32();
            var size = reader.readUint32();
            if (size < 8) {
                throw new EMFJSError("Invalid record size");
            }
            switch (type) {
                case Helper.GDI.RecordType.EMR_EOF:
                    all = true;
                    return "break-main_loop";
                case Helper.GDI.RecordType.EMR_SETMAPMODE: {
                    var mapMode_1 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.setMapMode(mapMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETWINDOWORGEX: {
                    var x_1 = reader.readInt32();
                    var y_1 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowOrgEx(x_1, y_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETWINDOWEXTEX: {
                    var x_2 = reader.readUint32();
                    var y_2 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowExtEx(x_2, y_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETVIEWPORTORGEX: {
                    var x_3 = reader.readInt32();
                    var y_3 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportOrgEx(x_3, y_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETVIEWPORTEXTEX: {
                    var x_4 = reader.readUint32();
                    var y_4 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportExtEx(x_4, y_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SAVEDC: {
                    this_1._records.push(function (gdi) {
                        gdi.saveDC();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_RESTOREDC: {
                    var saved_1 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.restoreDC(saved_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETBKMODE: {
                    var bkMode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setBkMode(bkMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETBKCOLOR: {
                    var bkColor_1 = new ColorRef(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setBkColor(bkColor_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_CREATEBRUSHINDIRECT: {
                    var index_1 = reader.readUint32();
                    var brush_1 = new Brush(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createBrush(index_1, brush_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_CREATEPEN: {
                    var index_2 = reader.readUint32();
                    var pen_1 = new Pen(reader, null);
                    this_1._records.push(function (gdi) {
                        gdi.createPen(index_2, pen_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_EXTCREATEPEN: {
                    var index_3 = reader.readUint32();
                    var offBmi = reader.readUint32();
                    var cbBmi = reader.readUint32();
                    var offBits = reader.readUint32();
                    var cbBits = reader.readUint32();
                    var pen_2 = new Pen(reader, {
                        header: {
                            off: offBmi,
                            size: cbBmi,
                        },
                        data: {
                            off: offBits,
                            size: cbBits,
                        },
                    });
                    this_1._records.push(function (gdi) {
                        gdi.createPen(index_3, pen_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SELECTOBJECT: {
                    var idx_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_1, null);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_DELETEOBJECT: {
                    var idx_2 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.deleteObject(idx_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_RECTANGLE: {
                    var rect_1 = new RectL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_1, 0, 0);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_ROUNDRECT: {
                    var rect_2 = new RectL(reader);
                    var corner_1 = new SizeL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_2, corner_1.cx, corner_1.cy);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_LINETO: {
                    var x_5 = reader.readInt32();
                    var y_5 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.lineTo(x_5, y_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_MOVETOEX: {
                    var x_6 = reader.readInt32();
                    var y_6 = reader.readInt32();
                    this_1._records.push(function (gdi) {
                        gdi.moveToEx(x_6, y_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYGON:
                case Helper.GDI.RecordType.EMR_POLYGON16: {
                    var isSmall = (type == Helper.GDI.RecordType.EMR_POLYGON16);
                    var bounds_1 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_1 = [];
                    while (cnt > 0) {
                        points_1.push(isSmall ? new PointS(reader) : new PointL(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polygon(points_1, bounds_1, true);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYPOLYGON:
                case Helper.GDI.RecordType.EMR_POLYPOLYGON16: {
                    var isSmall = (type == Helper.GDI.RecordType.EMR_POLYPOLYGON16);
                    var bounds_2 = new RectL(reader);
                    var polyCnt = reader.readUint32();
                    reader.skip(4); // count
                    var polygonsPtCnts = [];
                    for (var i = 0; i < polyCnt; i++) {
                        polygonsPtCnts.push(reader.readUint32());
                    }
                    var polygons_1 = [];
                    for (var i = 0; i < polyCnt; i++) {
                        var ptCnt = polygonsPtCnts[i];
                        var p = [];
                        for (var ip = 0; ip < ptCnt; ip++) {
                            p.push(isSmall ? new PointS(reader) : new PointL(reader));
                        }
                        polygons_1.push(p);
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyPolygon(polygons_1, bounds_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETPOLYFILLMODE: {
                    var polyfillmode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setPolyFillMode(polyfillmode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYLINE16:
                case Helper.GDI.RecordType.EMR_POLYLINETO16: {
                    var isLineTo_1 = (type == Helper.GDI.RecordType.EMR_POLYLINETO16);
                    var bounds_3 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_2 = [];
                    while (cnt > 0) {
                        points_2.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyline(isLineTo_1, points_2, bounds_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYBEZIER:
                case Helper.GDI.RecordType.EMR_POLYBEZIERTO: {
                    var isPolyBezierTo_1 = (type == Helper.GDI.RecordType.EMR_POLYBEZIERTO);
                    var bounds_4 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_3 = [];
                    while (cnt > 0) {
                        points_3.push(new PointL(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polybezier(isPolyBezierTo_1, points_3, bounds_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYBEZIER16: {
                    var bounds_5 = new RectL(reader);
                    var start = new PointL(reader);
                    var cnt = reader.readUint32();
                    var points_4 = [start];
                    while (cnt > 0) {
                        points_4.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polybezier(false, points_4, bounds_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYBEZIERTO16: {
                    var bounds_6 = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points_5 = [];
                    while (cnt > 0) {
                        points_5.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polybezier(true, points_5, bounds_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETTEXTALIGN: {
                    var textAlign_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setTextAlign(textAlign_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETSTRETCHBLTMODE: {
                    var stretchMode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setStretchBltMode(stretchMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETBRUSHORGEX: {
                    var origin_1 = new PointL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setBrushOrgEx(origin_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_BEGINPATH: {
                    this_1._records.push(function (gdi) {
                        gdi.beginPath();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_ENDPATH: {
                    this_1._records.push(function (gdi) {
                        gdi.endPath();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_ABORTPATH: {
                    this_1._records.push(function (gdi) {
                        gdi.abortPath();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_CLOSEFIGURE: {
                    this_1._records.push(function (gdi) {
                        gdi.closeFigure();
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_FILLPATH: {
                    var bounds_7 = new RectL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.fillPath(bounds_7);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_STROKEPATH: {
                    var bounds_8 = new RectL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.strokePath(bounds_8);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SELECTCLIPPATH: {
                    var rgnMode_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.selectClipPath(rgnMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_EXTSELECTCLIPRGN: {
                    reader.skip(4);
                    var rgnMode_2 = reader.readUint32();
                    var region_1 = rgnMode_2 != Helper.GDI.RegionMode.RGN_COPY ? new Region(reader) : null;
                    this_1._records.push(function (gdi) {
                        gdi.selectClipRgn(rgnMode_2, region_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_OFFSETCLIPRGN: {
                    var offset_1 = new PointL(reader);
                    this_1._records.push(function (gdi) {
                        gdi.offsetClipRgn(offset_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_SETMITERLIMIT: {
                    var miterLimit_1 = reader.readUint32();
                    this_1._records.push(function (gdi) {
                        gdi.setMiterLimit(miterLimit_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.EMR_POLYLINE:
                case Helper.GDI.RecordType.EMR_POLYLINETO:
                case Helper.GDI.RecordType.EMR_POLYPOLYLINE:
                case Helper.GDI.RecordType.EMR_SETPIXELV:
                case Helper.GDI.RecordType.EMR_SETMAPPERFLAGS:
                case Helper.GDI.RecordType.EMR_SETROP2:
                case Helper.GDI.RecordType.EMR_SETCOLORADJUSTMENT:
                case Helper.GDI.RecordType.EMR_SETTEXTCOLOR:
                case Helper.GDI.RecordType.EMR_SETMETARGN:
                case Helper.GDI.RecordType.EMR_EXCLUDECLIPRECT:
                case Helper.GDI.RecordType.EMR_INTERSECTCLIPRECT:
                case Helper.GDI.RecordType.EMR_SCALEVIEWPORTEXTEX:
                case Helper.GDI.RecordType.EMR_SCALEWINDOWEXTEX:
                case Helper.GDI.RecordType.EMR_SETWORLDTRANSFORM:
                case Helper.GDI.RecordType.EMR_MODIFYWORLDTRANSFORM:
                case Helper.GDI.RecordType.EMR_ANGLEARC:
                case Helper.GDI.RecordType.EMR_ELLIPSE:
                case Helper.GDI.RecordType.EMR_ARC:
                case Helper.GDI.RecordType.EMR_CHORD:
                case Helper.GDI.RecordType.EMR_PIE:
                case Helper.GDI.RecordType.EMR_SELECTPALETTE:
                case Helper.GDI.RecordType.EMR_CREATEPALETTE:
                case Helper.GDI.RecordType.EMR_SETPALETTEENTRIES:
                case Helper.GDI.RecordType.EMR_RESIZEPALETTE:
                case Helper.GDI.RecordType.EMR_REALIZEPALETTE:
                case Helper.GDI.RecordType.EMR_EXTFLOODFILL:
                case Helper.GDI.RecordType.EMR_ARCTO:
                case Helper.GDI.RecordType.EMR_POLYDRAW:
                case Helper.GDI.RecordType.EMR_SETARCDIRECTION:
                case Helper.GDI.RecordType.EMR_STROKEANDFILLPATH:
                case Helper.GDI.RecordType.EMR_FLATTENPATH:
                case Helper.GDI.RecordType.EMR_WIDENPATH:
                case Helper.GDI.RecordType.EMR_COMMENT:
                case Helper.GDI.RecordType.EMR_FILLRGN:
                case Helper.GDI.RecordType.EMR_FRAMERGN:
                case Helper.GDI.RecordType.EMR_INVERTRGN:
                case Helper.GDI.RecordType.EMR_PAINTRGN:
                case Helper.GDI.RecordType.EMR_BITBLT:
                case Helper.GDI.RecordType.EMR_STRETCHBLT:
                case Helper.GDI.RecordType.EMR_MASKBLT:
                case Helper.GDI.RecordType.EMR_PLGBLT:
                case Helper.GDI.RecordType.EMR_SETDIBITSTODEVICE:
                case Helper.GDI.RecordType.EMR_STRETCHDIBITS:
                case Helper.GDI.RecordType.EMR_EXTCREATEFONTINDIRECTW:
                case Helper.GDI.RecordType.EMR_EXTTEXTOUTA:
                case Helper.GDI.RecordType.EMR_EXTTEXTOUTW:
                case Helper.GDI.RecordType.EMR_POLYPOLYLINE16:
                case Helper.GDI.RecordType.EMR_POLYDRAW16:
                case Helper.GDI.RecordType.EMR_CREATEMONOBRUSH:
                case Helper.GDI.RecordType.EMR_CREATEDIBPATTERNBRUSHPT:
                case Helper.GDI.RecordType.EMR_POLYTEXTOUTA:
                case Helper.GDI.RecordType.EMR_POLYTEXTOUTW:
                case Helper.GDI.RecordType.EMR_SETICMMODE:
                case Helper.GDI.RecordType.EMR_CREATECOLORSPACE:
                case Helper.GDI.RecordType.EMR_SETCOLORSPACE:
                case Helper.GDI.RecordType.EMR_DELETECOLORSPACE:
                case Helper.GDI.RecordType.EMR_GLSRECORD:
                case Helper.GDI.RecordType.EMR_GLSBOUNDEDRECORD:
                case Helper.GDI.RecordType.EMR_PIXELFORMAT:
                case Helper.GDI.RecordType.EMR_DRAWESCAPE:
                case Helper.GDI.RecordType.EMR_EXTESCAPE:
                case Helper.GDI.RecordType.EMR_SMALLTEXTOUT:
                case Helper.GDI.RecordType.EMR_FORCEUFIMAPPING:
                case Helper.GDI.RecordType.EMR_NAMEDESCAPE:
                case Helper.GDI.RecordType.EMR_COLORCORRECTPALETTE:
                case Helper.GDI.RecordType.EMR_SETICMPROFILEA:
                case Helper.GDI.RecordType.EMR_SETICMPROFILEW:
                case Helper.GDI.RecordType.EMR_ALPHABLEND:
                case Helper.GDI.RecordType.EMR_SETLAYOUT:
                case Helper.GDI.RecordType.EMR_TRANSPARENTBLT:
                case Helper.GDI.RecordType.EMR_GRADIENTFILL:
                case Helper.GDI.RecordType.EMR_SETLINKEDUFIS:
                case Helper.GDI.RecordType.EMR_SETTEXTJUSTIFICATION:
                case Helper.GDI.RecordType.EMR_COLORMATCHTOTARGETW:
                case Helper.GDI.RecordType.EMR_CREATECOLORSPACEW:
                default: {
                    var recordName = "UNKNOWN";
                    for (var name_1 in Helper.GDI.RecordType) {
                        var recordTypes = Helper.GDI.RecordType;
                        if (recordTypes[name_1] == type) {
                            recordName = name_1;
                            break;
                        }
                    }
                    Helper.log("[EMF] " + recordName + " record (0x" + type.toString(16) + ") at offset 0x" + curpos.toString(16) + " with " + size + " bytes");
                    break;
                }
            }
            curpos += size;
        };
        var this_1 = this;
        main_loop: while (!all) {
            var state_1 = _loop_1();
            switch (state_1) {
                case "break-main_loop": break main_loop;
            }
        }
        if (!all) {
            throw new EMFJSError("Could not read all records");
        }
    }
    EMFRecords.prototype.play = function (gdi) {
        var len = this._records.length;
        for (var i = 0; i < len; i++) {
            this._records[i].call(this, gdi);
        }
    };
    return EMFRecords;
}());

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Path = /** @class */ (function (_super) {
    __extends$3(Path, _super);
    function Path(svgPath, copy) {
        var _this = _super.call(this, "path") || this;
        if (svgPath != null) {
            _this.svgPath = svgPath;
        }
        else {
            _this.svgPath = copy.svgPath;
        }
        return _this;
    }
    Path.prototype.clone = function () {
        return new Path(null, this.svgPath);
    };
    Path.prototype.toString = function () {
        return "{[path]}";
    };
    return Path;
}(Obj));
function createStockObjects() {
    // Create global stock objects
    var createSolidBrush = function (r, g, b) {
        return new Brush(null, {
            style: Helper.GDI.BrushStyle.BS_SOLID,
            color: new ColorRef(null, r, g, b),
        });
    };
    var createSolidPen = function (r, g, b) {
        return new Pen(null, Helper.GDI.PenStyle.PS_SOLID, 1, new ColorRef(null, r, g, b), null);
    };
    var stockObjs = {
        WHITE_BRUSH: createSolidBrush(255, 255, 255),
        LTGRAY_BRUSH: createSolidBrush(212, 208, 200),
        GRAY_BRUSH: createSolidBrush(128, 128, 128),
        DKGRAY_BRUSH: createSolidBrush(64, 64, 64),
        BLACK_BRUSH: createSolidBrush(0, 0, 0),
        NULL_BRUSH: new Brush(null, {
            style: Helper.GDI.BrushStyle.BS_NULL,
        }),
        WHITE_PEN: createSolidPen(255, 255, 255),
        BLACK_PEN: createSolidPen(0, 0, 0),
        NULL_PEN: new Pen(null, Helper.GDI.PenStyle.PS_NULL, 0, null, null),
        OEM_FIXED_FONT: null,
        ANSI_FIXED_FONT: null,
        ANSI_VAR_FONT: null,
        SYSTEM_FONT: null,
        DEVICE_DEFAULT_FONT: null,
        DEFAULT_PALETTE: null,
        SYSTEM_FIXED_FONT: null,
        DEFAULT_GUI_FONT: null,
    };
    var objs = {};
    for (var t in stockObjs) {
        var stockObjects = Helper.GDI.StockObject;
        var idx = stockObjects[t] - 0x80000000;
        objs[idx.toString()] = stockObjs[t];
    }
    return objs;
}
var _StockObjects = createStockObjects();
var GDIContextState = /** @class */ (function () {
    function GDIContextState(copy, defObjects) {
        if (copy != null) {
            this._svggroup = copy._svggroup;
            this._svgclipChanged = copy._svgclipChanged;
            this._svgtextbkfilter = copy._svgtextbkfilter;
            this.mapmode = copy.mapmode;
            this.stretchmode = copy.stretchmode;
            this.textalign = copy.textalign;
            this.bkmode = copy.bkmode;
            this.textcolor = copy.textcolor.clone();
            this.bkcolor = copy.bkcolor.clone();
            this.polyfillmode = copy.polyfillmode;
            this.miterlimit = copy.miterlimit;
            this.wx = copy.wx;
            this.wy = copy.wy;
            this.ww = copy.ww;
            this.wh = copy.wh;
            this.vx = copy.vx;
            this.vy = copy.vy;
            this.vw = copy.vw;
            this.vh = copy.vh;
            this.x = copy.x;
            this.y = copy.y;
            this.nextbrx = copy.nextbrx;
            this.nextbry = copy.nextbry;
            this.brx = copy.brx;
            this.bry = copy.bry;
            this.clip = copy.clip;
            this.ownclip = false;
            this.selected = {};
            for (var type in copy.selected) {
                this.selected[type] = copy.selected[type];
            }
        }
        else {
            this._svggroup = null;
            this._svgclipChanged = false;
            this._svgtextbkfilter = null;
            this.mapmode = Helper.GDI.MapMode.MM_ANISOTROPIC;
            this.stretchmode = Helper.GDI.StretchMode.COLORONCOLOR;
            this.textalign = 0; // TA_LEFT | TA_TOP | TA_NOUPDATECP
            this.bkmode = Helper.GDI.MixMode.OPAQUE;
            this.textcolor = new ColorRef(null, 0, 0, 0);
            this.bkcolor = new ColorRef(null, 255, 255, 255);
            this.polyfillmode = Helper.GDI.PolygonFillMode.ALTERNATE;
            this.miterlimit = 10;
            this.wx = 0;
            this.wy = 0;
            this.ww = 0;
            this.wh = 0;
            this.vx = 0;
            this.vy = 0;
            this.vw = 0;
            this.vh = 0;
            this.x = 0;
            this.y = 0;
            this.nextbrx = 0;
            this.nextbry = 0;
            this.brx = 0;
            this.bry = 0;
            this.clip = null;
            this.ownclip = false;
            this.selected = {};
            for (var type in defObjects) {
                var defObj = defObjects[type];
                this.selected[type] = defObj != null ? defObj.clone() : null;
            }
        }
    }
    return GDIContextState;
}());
var GDIContext = /** @class */ (function () {
    function GDIContext(svg) {
        this._svg = svg;
        this._svgdefs = null;
        this._svgPatterns = {};
        this._svgClipPaths = {};
        this._svgPath = null;
        this.defObjects = {
            brush: new Brush(null, {
                style: Helper.GDI.BrushStyle.BS_SOLID,
                color: new ColorRef(null, 0, 0, 0),
            }),
            pen: new Pen(null, Helper.GDI.PenStyle.PS_SOLID, 1, new ColorRef(null, 0, 0, 0), null),
            font: new Font(null, null),
            palette: null,
            region: null,
        };
        this.state = new GDIContextState(null, this.defObjects);
        this.statestack = [this.state];
        this.objects = {};
    }
    GDIContext.prototype._pushGroup = function () {
        if (this.state._svggroup == null || this.state._svgclipChanged) {
            this.state._svgclipChanged = false;
            this.state._svgtextbkfilter = null;
            var settings = {
                viewBox: [this.state.vx, this.state.vy, this.state.vw, this.state.vh].join(" "),
                preserveAspectRatio: "none",
            };
            if (this.state.clip != null) {
                Helper.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " with clipping");
                settings["clip-path"] = "url(#" + this._getSvgClipPathForRegion(this.state.clip) + ")";
            }
            else {
                Helper.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " without clipping");
            }
            this.state._svggroup = this._svg.svg(this.state._svggroup, this.state.vx, this.state.vy, this.state.vw, this.state.vh, settings);
        }
    };
    GDIContext.prototype._getStockObject = function (idx) {
        if (idx >= 0x80000000 && idx <= 0x80000011) {
            return _StockObjects[(idx - 0x80000000).toString()];
        }
        else if (idx == Helper.GDI.StockObject.DC_BRUSH) {
            return this.state.selected.brush;
        }
        else if (idx == Helper.GDI.StockObject.DC_PEN) {
            return this.state.selected.pen;
        }
        return null;
    };
    GDIContext.prototype._storeObject = function (obj, idx) {
        if (!idx) {
            idx = 0;
            while (this.objects[idx.toString()] != null && idx <= 65535) {
                idx++;
            }
            if (idx > 65535) {
                Helper.log("[gdi] Too many objects!");
                return -1;
            }
        }
        this.objects[idx.toString()] = obj;
        return idx;
    };
    GDIContext.prototype._getObject = function (objIdx) {
        var obj = this.objects[objIdx.toString()];
        if (obj == null) {
            obj = this._getStockObject(objIdx);
            if (obj == null) {
                Helper.log("[gdi] No object with handle " + objIdx);
            }
        }
        return obj;
    };
    GDIContext.prototype._getSvgDef = function () {
        if (this._svgdefs == null) {
            this._svgdefs = this._svg.defs();
        }
        return this._svgdefs;
    };
    GDIContext.prototype._getSvgClipPathForRegion = function (region) {
        for (var existingId in this._svgClipPaths) {
            var rgn = this._svgClipPaths[existingId];
            if (rgn == region) {
                return existingId;
            }
        }
        var id = Helper._makeUniqueId("c");
        var sclip = this._svg.clipPath(this._getSvgDef(), id, "userSpaceOnUse");
        switch (region.complexity) {
            case 1:
                this._svg.rect(sclip, this._todevX(region.bounds.left), this._todevY(region.bounds.top), this._todevW(region.bounds.right - region.bounds.left), this._todevH(region.bounds.bottom - region.bounds.top), { fill: "black", strokeWidth: 0 });
                break;
            case 2:
                for (var i = 0; i < region.scans.length; i++) {
                    var scan = region.scans[i];
                    for (var j = 0; j < scan.scanlines.length; j++) {
                        var scanline = scan.scanlines[j];
                        this._svg.rect(sclip, this._todevX(scanline.left), this._todevY(scan.top), this._todevW(scanline.right - scanline.left), this._todevH(scan.bottom - scan.top), { fill: "black", strokeWidth: 0 });
                    }
                }
                break;
        }
        this._svgClipPaths[id] = region;
        return id;
    };
    GDIContext.prototype._getSvgPatternForBrush = function (brush) {
        for (var existingId in this._svgPatterns) {
            var pat = this._svgPatterns[existingId];
            if (pat == brush) {
                return existingId;
            }
        }
        var width;
        var height;
        var img;
        switch (brush.style) {
            case Helper.GDI.BrushStyle.BS_PATTERN:
                width = brush.pattern.getWidth();
                height = brush.pattern.getHeight();
                break;
            case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                width = brush.dibpatternpt.getWidth();
                height = brush.dibpatternpt.getHeight();
                img = brush.dibpatternpt.base64ref();
                break;
            default:
                throw new EMFJSError("Invalid brush style");
        }
        var id = Helper._makeUniqueId("p");
        var spat = this._svg.pattern(this._getSvgDef(), id, this.state.brx, this.state.bry, width, height, { patternUnits: "userSpaceOnUse" });
        this._svg.image(spat, 0, 0, width, height, img);
        this._svgPatterns[id] = brush;
        return id;
    };
    GDIContext.prototype._selectObject = function (obj) {
        this.state.selected[obj.type] = obj;
        switch (obj.type) {
            case "region":
                this.state._svgclipChanged = true;
                break;
            case "brush":
                this.state.brx = this.state.nextbrx;
                this.state.bry = this.state.nextbry;
                break;
        }
    };
    GDIContext.prototype._deleteObject = function (objIdx) {
        var obj = this.objects[objIdx.toString()];
        if (obj != null) {
            for (var i = 0; i < this.statestack.length; i++) {
                var state = this.statestack[i];
                if (state.selected[obj.type] == obj) {
                    state.selected[obj.type] = this.defObjects[obj.type].clone();
                }
            }
            delete this.objects[objIdx.toString()];
            return true;
        }
        Helper.log("[gdi] Cannot delete object with invalid handle " + objIdx);
        return false;
    };
    GDIContext.prototype._getClipRgn = function () {
        if (this.state.clip != null) {
            if (!this.state.ownclip) {
                this.state.clip = this.state.clip.clone();
            }
        }
        else {
            if (this.state.selected.region != null) {
                this.state.clip = this.state.selected.region.clone();
            }
            else {
                this.state.clip = CreateSimpleRegion(this.state.wx, this.state.wy, this.state.wx + this.state.ww, this.state.wy + this.state.wh);
            }
        }
        this.state.ownclip = true;
        return this.state.clip;
    };
    GDIContext.prototype._todevX = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.wx) * (this.state.vw / this.state.ww)) + this.state.vx;
    };
    GDIContext.prototype._todevY = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.wy) * (this.state.vh / this.state.wh)) + this.state.vy;
    };
    GDIContext.prototype._todevW = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val * (this.state.vw / this.state.ww)) + this.state.vx;
    };
    GDIContext.prototype._todevH = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val * (this.state.vh / this.state.wh)) + this.state.vy;
    };
    GDIContext.prototype._tologicalX = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.vx) / (this.state.vw / this.state.ww)) + this.state.wx;
    };
    GDIContext.prototype._tologicalY = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.vy) / (this.state.vh / this.state.wh)) + this.state.wy;
    };
    GDIContext.prototype._tologicalW = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val / (this.state.vw / this.state.ww)) + this.state.wx;
    };
    GDIContext.prototype._tologicalH = function (val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val / (this.state.vh / this.state.wh)) + this.state.wy;
    };
    GDIContext.prototype.setMapMode = function (mode) {
        Helper.log("[gdi] setMapMode: mode=" + mode);
        this.state.mapmode = mode;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setWindowOrgEx = function (x, y) {
        Helper.log("[gdi] setWindowOrgEx: x=" + x + " y=" + y);
        this.state.wx = x;
        this.state.wy = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setWindowExtEx = function (x, y) {
        Helper.log("[gdi] setWindowExtEx: x=" + x + " y=" + y);
        this.state.ww = x;
        this.state.wh = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setViewportOrgEx = function (x, y) {
        Helper.log("[gdi] setViewportOrgEx: x=" + x + " y=" + y);
        this.state.vx = x;
        this.state.vy = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setViewportExtEx = function (x, y) {
        Helper.log("[gdi] setViewportExtEx: x=" + x + " y=" + y);
        this.state.vw = x;
        this.state.vh = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setBrushOrgEx = function (origin) {
        Helper.log("[gdi] setBrushOrgEx: x=" + origin.x + " y=" + origin.y);
        this.state.nextbrx = origin.x;
        this.state.nextbry = origin.y;
    };
    GDIContext.prototype.saveDC = function () {
        Helper.log("[gdi] saveDC");
        var prevstate = this.state;
        this.state = new GDIContextState(this.state);
        this.statestack.push(prevstate);
        this.state._svggroup = null;
    };
    GDIContext.prototype.restoreDC = function (saved) {
        Helper.log("[gdi] restoreDC: saved=" + saved);
        if (this.statestack.length > 1) {
            if (saved == -1) {
                this.state = this.statestack.pop();
            }
            else if (saved < -1) {
                throw new EMFJSError("restoreDC: relative restore not implemented");
            }
            else if (saved > 1) {
                throw new EMFJSError("restoreDC: absolute restore not implemented");
            }
        }
        else {
            throw new EMFJSError("No saved contexts");
        }
        this.state._svggroup = null;
    };
    GDIContext.prototype.setStretchBltMode = function (stretchMode) {
        Helper.log("[gdi] setStretchBltMode: stretchMode=" + stretchMode);
    };
    GDIContext.prototype._applyOpts = function (opts, usePen, useBrush, useFont) {
        if (opts == null) {
            opts = {};
        }
        if (usePen) {
            var pen = this.state.selected.pen;
            if (pen.style != Helper.GDI.PenStyle.PS_NULL) {
                opts.stroke = "#" + pen.color.toHex(); // TODO: pen style
                opts.strokeWidth = pen.width;
                opts["stroke-miterlimit"] = this.state.miterlimit;
                var dotWidth = void 0;
                opts["stroke-linecap"] = "round";
                dotWidth = 1;
                opts["stroke-linejoin"] = "round";
                var dashWidth = opts.strokeWidth * 4;
                var dotSpacing = opts.strokeWidth * 2;
                switch (pen.style) {
                    case Helper.GDI.PenStyle.PS_DASH:
                        opts["stroke-dasharray"] = [dashWidth, dotSpacing].toString();
                        break;
                    case Helper.GDI.PenStyle.PS_DOT:
                        opts["stroke-dasharray"] = [dotWidth, dotSpacing].toString();
                        break;
                    case Helper.GDI.PenStyle.PS_DASHDOT:
                        opts["stroke-dasharray"] = [dashWidth, dotSpacing, dotWidth, dotSpacing].toString();
                        break;
                    case Helper.GDI.PenStyle.PS_DASHDOTDOT:
                        opts["stroke-dasharray"] = [dashWidth, dotSpacing, dotWidth, dotSpacing, dotWidth, dotSpacing].toString();
                        break;
                }
            }
        }
        if (useBrush) {
            var brush = this.state.selected.brush;
            switch (brush.style) {
                case Helper.GDI.BrushStyle.BS_SOLID:
                    opts.fill = "#" + brush.color.toHex();
                    break;
                case Helper.GDI.BrushStyle.BS_PATTERN:
                case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                    opts.fill = "url(#" + this._getSvgPatternForBrush(brush) + ")";
                    break;
                case Helper.GDI.BrushStyle.BS_NULL:
                    opts.fill = "none";
                    break;
                default:
                    Helper.log("[gdi] unsupported brush style: " + brush.style);
                    opts.fill = "none";
                    break;
            }
        }
        if (useFont) {
            var font = this.state.selected.font;
            opts["font-family"] = font.facename;
            opts["font-size"] = Math.abs(font.height);
            opts.fill = "#" + this.state.textcolor.toHex();
        }
        return opts;
    };
    GDIContext.prototype.rectangle = function (rect, rw, rh) {
        Helper.log("[gdi] rectangle: rect=" + rect.toString() + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var bottom = this._todevY(rect.bottom);
        var right = this._todevX(rect.right);
        var top = this._todevY(rect.top);
        var left = this._todevX(rect.left);
        rw = this._todevH(rw);
        rh = this._todevH(rh);
        Helper.log("[gdi] rectangle: TRANSLATED: bottom=" + bottom + " right=" + right + " top=" + top + " left=" + left + " rh=" + rh + " rw=" + rw);
        this._pushGroup();
        var opts = this._applyOpts(null, true, true, false);
        this._svg.rect(this.state._svggroup, left, top, right - left, bottom - top, rw / 2, rh / 2, opts);
    };
    GDIContext.prototype.lineTo = function (x, y) {
        Helper.log("[gdi] lineTo: x=" + x + " y=" + y + " with pen " + this.state.selected.pen.toString());
        var toX = this._todevX(x);
        var toY = this._todevY(y);
        var fromX = this._todevX(this.state.x);
        var fromY = this._todevY(this.state.y);
        // Update position
        this.state.x = x;
        this.state.y = y;
        Helper.log("[gdi] lineTo: TRANSLATED: toX=" + toX + " toY=" + toY + " fromX=" + fromX + " fromY=" + fromY);
        this._pushGroup();
        var opts = this._applyOpts(null, true, false, false);
        this._svg.line(this.state._svggroup, fromX, fromY, toX, toY, opts);
    };
    GDIContext.prototype.moveToEx = function (x, y) {
        Helper.log("[gdi] moveToEx: x=" + x + " y=" + y);
        this.state.x = x;
        this.state.y = y;
        if (this._svgPath != null) {
            this._svgPath.move(this.state.x, this.state.y);
            Helper.log("[gdi] new path: " + this._svgPath.path());
        }
    };
    GDIContext.prototype.polygon = function (points, bounds, first) {
        Helper.log("[gdi] polygon: points=" + points + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        if (first) {
            this._pushGroup();
        }
        var opts = {
            "fill-rule": this.state.polyfillmode == Helper.GDI.PolygonFillMode.ALTERNATE ? "evenodd" : "nonzero",
        };
        this._applyOpts(opts, true, true, false);
        this._svg.polygon(this.state._svggroup, pts, opts);
    };
    GDIContext.prototype.polyPolygon = function (polygons, bounds) {
        Helper.log("[gdi] polyPolygon: polygons.length=" + polygons.length + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var cnt = polygons.length;
        for (var i = 0; i < cnt; i++) {
            this.polygon(polygons[i], bounds, i == 0);
        }
    };
    GDIContext.prototype.polyline = function (isLineTo, points, bounds) {
        Helper.log("[gdi] polyline: isLineTo=" + isLineTo.toString() + ", points=" + points + ", bounds=" + bounds.toString() + " with pen " + this.state.selected.pen.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        if (this._svgPath != null) {
            if (!isLineTo || pts.length == 0) {
                this._svgPath.move(this._todevX(this.state.x), this._todevY(this.state.y));
            }
            else {
                var firstPts = pts[0];
                this._svgPath.move(firstPts[0], firstPts[1]);
            }
            this._svgPath.line(pts);
            Helper.log("[gdi] new path: " + this._svgPath.path());
        }
        else {
            this._pushGroup();
            var opts = this._applyOpts(null, true, false, false);
            if (isLineTo && points.length > 0) {
                var firstPt = points[0];
                if (firstPt.x != this.state.x || firstPt.y != this.state.y) {
                    pts.unshift([this._todevX(this.state.x), this._todevY(this.state.y)]);
                }
            }
            this._svg.polyline(this.state._svggroup, pts, opts);
        }
        if (points.length > 0) {
            var lastPt = points[points.length - 1];
            this.state.x = lastPt.x;
            this.state.y = lastPt.y;
        }
    };
    GDIContext.prototype.polybezier = function (isPolyBezierTo, points, bounds) {
        Helper.log("[gdi] polybezier: isPolyBezierTo=" + isPolyBezierTo.toString() + ", points=" + points + ", bounds=" + bounds.toString() + " with pen " + this.state.selected.pen.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push({ x: this._todevX(point.x), y: this._todevY(point.y) });
        }
        if (this._svgPath != null) {
            if (isPolyBezierTo && pts.length > 0) {
                var firstPts = pts[0];
                this._svgPath.move(firstPts.x, firstPts.y);
            }
            else {
                this._svgPath.move(this._todevX(this.state.x), this._todevY(this.state.y));
            }
            if (pts.length < (isPolyBezierTo ? 3 : 4)) {
                throw new EMFJSError("Not enough points to draw bezier");
            }
            for (var i = isPolyBezierTo ? 1 : 0; i + 3 <= pts.length; i += 3) {
                var cp1 = pts[i];
                var cp2 = pts[i + 1];
                var ep = pts[i + 2];
                this._svgPath.curveC(cp1.x, cp1.y, cp2.x, cp2.y, ep.x, ep.y);
            }
            Helper.log("[gdi] new path: " + this._svgPath.path());
        }
        else {
            throw new EMFJSError("polybezier not implemented (not a path)");
        }
        if (points.length > 0) {
            var lastPt = points[points.length - 1];
            this.state.x = lastPt.x;
            this.state.y = lastPt.y;
        }
    };
    GDIContext.prototype.selectClipPath = function (rgnMode) {
        Helper.log("[gdi] selectClipPath: rgnMode=0x" + rgnMode.toString(16));
    };
    GDIContext.prototype.selectClipRgn = function (rgnMode, region) {
        Helper.log("[gdi] selectClipRgn: rgnMode=0x" + rgnMode.toString(16));
        if (rgnMode == Helper.GDI.RegionMode.RGN_COPY) {
            this.state.selected.region = region;
            this.state.clip = null;
            this.state.ownclip = false;
        }
        else {
            if (region == null) {
                throw new EMFJSError("No clip region to select");
            }
            throw new EMFJSError("Not implemented: rgnMode=0x" + rgnMode.toString(16));
        }
        this.state._svgclipChanged = true;
    };
    GDIContext.prototype.offsetClipRgn = function (offset) {
        Helper.log("[gdi] offsetClipRgn: offset=" + offset.toString());
        this._getClipRgn().offset(offset.x, offset.y);
    };
    GDIContext.prototype.setTextAlign = function (textAlignmentMode) {
        Helper.log("[gdi] setTextAlign: textAlignmentMode=0x" + textAlignmentMode.toString(16));
        this.state.textalign = textAlignmentMode;
    };
    GDIContext.prototype.setMiterLimit = function (miterLimit) {
        Helper.log("[gdi] setMiterLimit: miterLimit=" + miterLimit);
        this.state.miterlimit = miterLimit;
    };
    GDIContext.prototype.setBkMode = function (bkMode) {
        Helper.log("[gdi] setBkMode: bkMode=0x" + bkMode.toString(16));
        this.state.bkmode = bkMode;
    };
    GDIContext.prototype.setBkColor = function (bkColor) {
        Helper.log("[gdi] setBkColor: bkColor=" + bkColor.toString());
        this.state.bkcolor = bkColor;
        this.state._svgtextbkfilter = null;
    };
    GDIContext.prototype.setPolyFillMode = function (polyFillMode) {
        Helper.log("[gdi] setPolyFillMode: polyFillMode=" + polyFillMode);
        this.state.polyfillmode = polyFillMode;
    };
    GDIContext.prototype.createBrush = function (index, brush) {
        var idx = this._storeObject(brush, index);
        Helper.log("[gdi] createBrush: brush=" + brush.toString() + " with handle " + idx);
    };
    GDIContext.prototype.createPen = function (index, pen) {
        var idx = this._storeObject(pen, index);
        Helper.log("[gdi] createPen: pen=" + pen.toString() + " width handle " + idx);
    };
    GDIContext.prototype.createPenEx = function (index, pen) {
        var idx = this._storeObject(pen, index);
        Helper.log("[gdi] createPenEx: pen=" + pen.toString() + " width handle " + idx);
    };
    GDIContext.prototype.selectObject = function (objIdx, checkType) {
        var obj = this._getObject(objIdx);
        if (obj != null && (checkType == null || obj.type == checkType)) {
            this._selectObject(obj);
            Helper.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " selected " + obj.type + ": " + obj.toString() : "[invalid index]"));
        }
        else {
            Helper.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " invalid object type: " + obj.type : "[invalid index]"));
        }
    };
    GDIContext.prototype._abortPath = function () {
        if (this._svgPath != null) {
            this._svgPath = null;
        }
    };
    GDIContext.prototype.abortPath = function () {
        Helper.log("[gdi] abortPath");
        this._abortPath();
    };
    GDIContext.prototype.beginPath = function () {
        Helper.log("[gdi] beginPath");
        this._abortPath();
        this._svgPath = this._svg.createPath();
    };
    GDIContext.prototype.closeFigure = function () {
        Helper.log("[gdi] closeFigure");
        if (this._svgPath == null) {
            throw new EMFJSError("No path bracket: cannot close figure");
        }
        this._svgPath.close();
    };
    GDIContext.prototype.fillPath = function (bounds) {
        Helper.log("[gdi] fillPath");
        if (this.state.selected.path == null) {
            throw new EMFJSError("No path selected");
        }
        var selPath = this.state.selected.path;
        var opts = this._applyOpts(null, true, true, false);
        this._svg.path(this.state._svggroup, selPath.svgPath, opts);
        this._pushGroup();
        this.state.selected.path = null;
    };
    GDIContext.prototype.strokePath = function (bounds) {
        Helper.log("[gdi] strokePath");
        if (this.state.selected.path == null) {
            throw new EMFJSError("No path selected");
        }
        var selPath = this.state.selected.path;
        var opts = this._applyOpts({ fill: "none" }, true, false, false);
        this._svg.path(this.state._svggroup, selPath.svgPath, opts);
        this._pushGroup();
        this.state.selected.path = null;
    };
    GDIContext.prototype.endPath = function () {
        Helper.log("[gdi] endPath");
        if (this._svgPath == null) {
            throw new EMFJSError("No path bracket: cannot end path");
        }
        this._pushGroup();
        this._selectObject(new Path(this._svgPath));
        this._svgPath = null;
    };
    GDIContext.prototype.deleteObject = function (objIdx) {
        var ret = this._deleteObject(objIdx);
        Helper.log("[gdi] deleteObject: objIdx=" + objIdx + (ret ? " deleted object" : "[invalid index]"));
    };
    return GDIContext;
}());

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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
var RendererSettings = /** @class */ (function () {
    function RendererSettings() {
    }
    return RendererSettings;
}());
var Renderer = /** @class */ (function () {
    function Renderer(blob) {
        this.parse(blob);
        Helper.log("EMFJS.Renderer instantiated");
    }
    Renderer.prototype.parse = function (blob) {
        this._img = null;
        var reader = new Blob(blob);
        var type = reader.readUint32();
        if (type !== 0x00000001) {
            throw new EMFJSError("Not an EMF file");
        }
        var size = reader.readUint32();
        if (size % 4 != 0) {
            throw new EMFJSError("Not an EMF file");
        }
        this._img = new EMF(reader, size);
        if (this._img == null) {
            throw new EMFJSError("Format not recognized");
        }
    };
    Renderer.prototype._render = function (svg, mapMode, w, h, xExt, yExt) {
        var gdi = new GDIContext(svg);
        gdi.setWindowExtEx(w, h);
        gdi.setViewportExtEx(xExt, yExt);
        gdi.setMapMode(mapMode);
        Helper.log("[EMF] BEGIN RENDERING --->");
        this._img.render(gdi);
        Helper.log("[EMF] <--- DONE RENDERING");
    };
    Renderer.prototype.render = function (info) {
        var inst = this;
        var img = (function (mapMode, w, h, xExt, yExt) {
            return $("<div>").svg({
                onLoad: function (svg) {
                    return inst._render.call(inst, svg, mapMode, w, h, xExt, yExt);
                },
                settings: {
                    viewBox: [0, 0, xExt, yExt].join(" "),
                    preserveAspectRatio: "none",
                },
            });
        })(info.mapMode, info.wExt, info.hExt, info.xExt, info.yExt);
        var svgContainer = $(img[0]).svg("get");
        return $(svgContainer.root()).attr("width", info.width).attr("height", info.height);
    };
    return Renderer;
}());
var EMF = /** @class */ (function () {
    function EMF(reader, hdrsize) {
        this._reader = reader;
        this._hdrsize = hdrsize;
        this._records = new EMFRecords(reader, this._hdrsize);
    }
    EMF.prototype.render = function (gdi) {
        this._records.play(gdi);
    };
    return EMF;
}());

/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner
Copyright (c) 2018 Thomas Bluemel

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

exports.Error = EMFJSError;
exports.loggingEnabled = loggingEnabled;
exports.RendererSettings = RendererSettings;
exports.Renderer = Renderer;
exports.EMF = EMF;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=emf.bundle.js.map
