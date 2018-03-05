(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WMFJS = {})));
}(this, (function (exports) { 'use strict';

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
// tslint:disable-next-line:variable-name
var WMFJSError = function (message) {
    this.name = "WMFJSError";
    this.message = message;
    this.stack = (new Error()).stack;
};
WMFJSError.prototype = new Error();
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
        return "wmfjs_" + prefix + (this._uniqueId++);
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
        METAHEADER_SIZE: 18,
        BITMAPINFOHEADER_SIZE: 40,
        BITMAPCOREHEADER_SIZE: 12,
        MetafileType: {
            MEMORYMETAFILE: 1,
            DISKMETAFILE: 2,
        },
        MetafileVersion: {
            METAVERSION100: 0x100,
            METAVERSION300: 0x300,
        },
        RecordType: {
            META_EOF: 0x0000,
            META_REALIZEPALETTE: 0x0035,
            META_SETPALENTRIES: 0x0037,
            META_SETBKMODE: 0x0102,
            META_SETMAPMODE: 0x0103,
            META_SETROP2: 0x0104,
            META_SETRELABS: 0x0105,
            META_SETPOLYFILLMODE: 0x0106,
            META_SETSTRETCHBLTMODE: 0x0107,
            META_SETTEXTCHAREXTRA: 0x0108,
            META_RESTOREDC: 0x0127,
            META_RESIZEPALETTE: 0x0139,
            META_DIBCREATEPATTERNBRUSH: 0x0142,
            META_SETLAYOUT: 0x0149,
            META_SETBKCOLOR: 0x0201,
            META_SETTEXTCOLOR: 0x0209,
            META_OFFSETVIEWPORTORG: 0x0211,
            META_LINETO: 0x0213,
            META_MOVETO: 0x0214,
            META_OFFSETCLIPRGN: 0x0220,
            META_FILLREGION: 0x0228,
            META_SETMAPPERFLAGS: 0x0231,
            META_SELECTPALETTE: 0x0234,
            META_POLYGON: 0x0324,
            META_POLYLINE: 0x0325,
            META_SETTEXTJUSTIFICATION: 0x020a,
            META_SETWINDOWORG: 0x020b,
            META_SETWINDOWEXT: 0x020c,
            META_SETVIEWPORTORG: 0x020d,
            META_SETVIEWPORTEXT: 0x020e,
            META_OFFSETWINDOWORG: 0x020f,
            META_SCALEWINDOWEXT: 0x0410,
            META_SCALEVIEWPORTEXT: 0x0412,
            META_EXCLUDECLIPRECT: 0x0415,
            META_INTERSECTCLIPRECT: 0x0416,
            META_ELLIPSE: 0x0418,
            META_FLOODFILL: 0x0419,
            META_FRAMEREGION: 0x0429,
            META_ANIMATEPALETTE: 0x0436,
            META_TEXTOUT: 0x0521,
            META_POLYPOLYGON: 0x0538,
            META_EXTFLOODFILL: 0x0548,
            META_RECTANGLE: 0x041b,
            META_SETPIXEL: 0x041f,
            META_ROUNDRECT: 0x061c,
            META_PATBLT: 0x061d,
            META_SAVEDC: 0x001e,
            META_PIE: 0x081a,
            META_STRETCHBLT: 0x0b23,
            META_ESCAPE: 0x0626,
            META_INVERTREGION: 0x012a,
            META_PAINTREGION: 0x012b,
            META_SELECTCLIPREGION: 0x012c,
            META_SELECTOBJECT: 0x012d,
            META_SETTEXTALIGN: 0x012e,
            META_ARC: 0x0817,
            META_CHORD: 0x0830,
            META_BITBLT: 0x0922,
            META_EXTTEXTOUT: 0x0a32,
            META_SETDIBTODEV: 0x0d33,
            META_DIBBITBLT: 0x0940,
            META_DIBSTRETCHBLT: 0x0b41,
            META_STRETCHDIB: 0x0f43,
            META_DELETEOBJECT: 0x01f0,
            META_CREATEPALETTE: 0x00f7,
            META_CREATEPATTERNBRUSH: 0x01f9,
            META_CREATEPENINDIRECT: 0x02fa,
            META_CREATEFONTINDIRECT: 0x02fb,
            META_CREATEBRUSHINDIRECT: 0x02fc,
            META_CREATEREGION: 0x06ff,
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
        TextAlignmentMode: {
            TA_UPDATECP: 1,
            TA_RIGHT: 2,
            TA_CENTER: 6,
            TA_BOTTOM: 8,
            TA_BASELINE: 24,
            TA_RTLREADING: 256,
        },
        MixMode: {
            TRANSPARENT: 1,
            OPAQUE: 2,
        },
        VerticalTextAlignmentMode: {
            VTA_BOTTOM: 2,
            VTA_CENTER: 6,
            VTA_LEFT: 8,
            VTA_BASELINE: 24,
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
            PS_SOLID: 0,
            PS_DASH: 1,
            PS_DOT: 2,
            PS_DASHDOT: 3,
            PS_DASHDOTDOT: 4,
            PS_NULL: 5,
            PS_INSIDEFRAME: 6,
            PS_USERSTYLE: 7,
            PS_ALTERNATE: 8,
            PS_ENDCAP_SQUARE: 256,
            PS_ENDCAP_FLAT: 512,
            PS_JOIN_BEVEL: 4096,
            PS_JOIN_MITER: 8192,
        },
        PolyFillMode: {
            ALTERNATE: 1,
            WINDING: 2,
        },
        ColorUsage: {
            DIB_RGB_COLORS: 0,
            DIB_PAL_COLORS: 1,
            DIB_PAL_INDICES: 2,
        },
        PaletteEntryFlag: {
            PC_RESERVED: 1,
            PC_EXPLICIT: 2,
            PC_NOCOLLAPSE: 4,
        },
        BitmapCompression: {
            BI_RGB: 0,
            BI_RLE8: 1,
            BI_RLE4: 2,
            BI_BITFIELDS: 3,
            BI_JPEG: 4,
            BI_PNG: 5,
        },
    };
    Helper._uniqueId = 0;
    return Helper;
}());

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
            throw new WMFJSError("Invalid seek position");
        }
        this.pos = newpos;
    };
    Blob.prototype.skip = function (cnt) {
        var newPos = this.pos + cnt;
        if (newPos > this.data.length) {
            throw new WMFJSError("Unexpected end of file");
        }
        this.pos = newPos;
    };
    Blob.prototype.readBinary = function (cnt) {
        var end = this.pos + cnt;
        if (end > this.data.length) {
            throw new WMFJSError("Unexpected end of file");
        }
        var ret = "";
        while (cnt-- > 0) {
            ret += String.fromCharCode(this.data[this.pos++]);
        }
        return ret;
    };
    Blob.prototype.readInt8 = function () {
        if (this.pos + 1 > this.data.length) {
            throw new WMFJSError("Unexpected end of file");
        }
        return this.data[this.pos++];
    };
    Blob.prototype.readUint8 = function () {
        return this.readInt8() >>> 0;
    };
    Blob.prototype.readInt32 = function () {
        if (this.pos + 4 > this.data.length) {
            throw new WMFJSError("Unexpected end of file");
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
            throw new WMFJSError("Unexpected end of file");
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
            throw new WMFJSError("Unexpected end of file");
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
                    throw new WMFJSError("Unexpected end of file");
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
    return Blob;
}());

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
var Rect = /** @class */ (function () {
    function Rect(reader, left, top, right, bottom) {
        if (reader != null) {
            this.bottom = reader.readInt16();
            this.right = reader.readInt16();
            this.top = reader.readInt16();
            this.left = reader.readInt16();
        }
        else {
            this.bottom = bottom;
            this.right = right;
            this.top = top;
            this.left = left;
        }
    }
    Rect.prototype.clone = function () {
        return new Rect(null, this.left, this.top, this.right, this.bottom);
    };
    Rect.prototype.toString = function () {
        return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
    };
    Rect.prototype.empty = function () {
        return this.left >= this.right || this.top >= this.bottom;
    };
    Rect.prototype.intersect = function (rect) {
        if (this.empty() || rect.empty()) {
            return null;
        }
        if (this.left >= rect.right || this.top >= rect.bottom ||
            this.right <= rect.left || this.bottom <= rect.top) {
            return null;
        }
        return new Rect(null, Math.max(this.left, rect.left), Math.max(this.top, rect.top), Math.min(this.right, rect.right), Math.min(this.bottom, rect.bottom));
    };
    return Rect;
}());
var Obj = /** @class */ (function () {
    function Obj(type) {
        this.type = type;
    }
    Obj.prototype.clone = function () {
        throw new WMFJSError("clone not implemented");
    };
    Obj.prototype.toString = function () {
        throw new WMFJSError("toString not implemented");
    };
    return Obj;
}());

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
            reader.skip(2);
            if (reader.readInt16() != 6) {
                throw new WMFJSError("Invalid region identifier");
            }
            reader.skip(2);
            var rgnSize = reader.readInt16();
            var scanCnt = reader.readInt16();
            reader.skip(2);
            // note, Rect in reverse, can't use Rect(reader) directly
            var left = reader.readInt16();
            var top_1 = reader.readInt16();
            var right = reader.readInt16();
            var bottom = reader.readInt16();
            _this.bounds = new Rect(null, left, top_1, right, bottom);
            _this.scans = [];
            for (var i = 0; i < scanCnt; i++) {
                _this.scans.push(new Scan(reader));
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
        Helper.log("[wmf] Region " + this.toString() + " subtract " + rect.toString());
        if (this.bounds != null) {
            var isect = this.bounds.intersect(rect);
            if (isect != null) {
                if (this.scans == null) {
                    // We currently have a simple region and there is some kind of an overlap.
                    // We need to create scanlines now.  Simplest method is to fake one scan line
                    // that equals the simple region and re-use the same logic as for complex regions
                    this.scans = [];
                    this.scans.push(new Scan(null, null, this.bounds.top, this.bounds.bottom, [{ left: this.bounds.left, right: this.bounds.right }]));
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
                            Helper.log("[wmf] Region split top scan " + si + " for substraction");
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
                            Helper.log("[wmf] Region split bottom scan " + si + " for substraction");
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
                            Helper.log("[wmf] Region remove now empty scan " + si + " due to subtraction");
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
                    var top_2;
                    var right = void 0;
                    var bottom = void 0;
                    var len = this.scans.length;
                    for (var i = 0; i < len; i++) {
                        var scan = this.scans[i];
                        if (i == 0) {
                            top_2 = scan.top;
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
                    if (left != null && top_2 != null && right != null && bottom != null) {
                        this.bounds = new Rect(null, left, top_2, right, bottom);
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
        Helper.log("[wmf] Region subtraction -> " + this.toString());
    };
    Region.prototype.intersect = function (rect) {
        Helper.log("[wmf] Region " + this.toString() + " intersect with " + rect.toString());
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
                        Helper.log("[wmf] Region remove " + si + " scans from top");
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
                            Helper.log("[wmf] Region remove " + (this.scans.length - si) + " scans from bottom");
                            this.scans.splice(si, this.scans.length - si);
                            break;
                        }
                        if (!scan.intersect(this.bounds.left, this.bounds.right)) {
                            // Remove now empty scan
                            Helper.log("[wmf] Region remove now empty scan " + si + " due to intersection");
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
        Helper.log("[wmf] Region intersection -> " + this.toString());
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
    rgn.bounds = new Rect(null, left, top, right, bottom);
    rgn._updateComplexity();
    return rgn;
}
var Scan = /** @class */ (function () {
    function Scan(reader, copy, top, bottom, scanlines) {
        if (reader != null) {
            var cnt = reader.readUint16();
            this.top = reader.readUint16();
            this.bottom = reader.readUint16();
            this.scanlines = [];
            for (var i = 0; i < cnt; i++) {
                var left = reader.readUint16();
                var right = reader.readUint16();
                this.scanlines.push({ left: left, right: right });
            }
            reader.skip(2);
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
        else {
            this.top = top;
            this.bottom = bottom;
            this.scanlines = scanlines;
        }
    }
    Scan.prototype.clone = function () {
        return new Scan(null, this);
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
    Scan.prototype.toString = function () {
        return "{ #scanlines: " + this.scanlines.length + "}";
    };
    return Scan;
}());

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
        throw new WMFJSError("getWidth not implemented");
    };
    BitmapBase.prototype.getHeight = function () {
        throw new WMFJSError("getHeight not implemented");
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
    function DIBitmap(reader, size) {
        var _this = _super.call(this) || this;
        _this._reader = reader;
        _this._offset = reader.pos;
        _this._size = size;
        _this._info = new BitmapInfo(reader, true);
        return _this;
    }
    DIBitmap.prototype.getWidth = function () {
        return this._info.getWidth();
    };
    DIBitmap.prototype.getHeight = function () {
        return this._info.getHeight();
    };
    DIBitmap.prototype.makeBitmapFileHeader = function () {
        var buf = new ArrayBuffer(14);
        var view = new Uint8Array(buf);
        view[0] = 0x42;
        view[1] = 0x4d;
        Helper._writeUint32Val(view, 2, this._size + 14);
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
        if (data != null) {
            data += this._reader.readBinary(this._size);
        }
        else {
            data = this._reader.readBinary(this._size);
        }
        var ref = "data:" + mime + ";base64," + btoa(data);
        this._reader.seek(prevpos);
        return ref;
    };
    return DIBitmap;
}(BitmapBase));
var Bitmap16 = /** @class */ (function (_super) {
    __extends$1(Bitmap16, _super);
    function Bitmap16(reader, size) {
        var _this = _super.call(this) || this;
        if (reader != null) {
            size = size;
            _this._reader = reader;
            _this._offset = reader.pos;
            _this._size = size;
            _this.type = reader.readInt16();
            _this.width = reader.readInt16();
            _this.height = reader.readInt16();
            _this.widthBytes = reader.readInt16();
            _this.planes = reader.readUint8();
            _this.bitsPixel = reader.readUint8();
            _this.bitsOffset = reader.pos;
            _this.bitsSize = (((_this.width * _this.bitsPixel + 15) >> 4) << 1) * _this.height;
            if (_this.bitsSize > size - 10) {
                throw new WMFJSError("Bitmap should have " + _this.bitsSize + " bytes, but has " + (size - 10));
            }
        }
        else {
            var copy = size;
            _this._reader = copy._reader;
            _this._offset = copy._offset;
            _this._size = copy._size;
            _this.type = copy.type;
            _this.width = copy.width;
            _this.height = copy.height;
            _this.widthBytes = copy.widthBytes;
            _this.planes = copy.planes;
            _this.bitsPixel = copy.bitsPixel;
            _this.bitsOffset = copy.bitsOffset;
            _this.bitsSize = copy.bitsSize;
        }
        return _this;
    }
    Bitmap16.prototype.getWidth = function () {
        return this.width;
    };
    Bitmap16.prototype.getHeight = function () {
        return this.height;
    };
    Bitmap16.prototype.clone = function () {
        return new Bitmap16(null, this);
    };
    return Bitmap16;
}(BitmapBase));
var PatternBitmap16 = /** @class */ (function (_super) {
    __extends$1(PatternBitmap16, _super);
    function PatternBitmap16(reader, size) {
        var _this = _super.call(this, reader, size) || this;
        if (reader != null) {
            _this.bitsOffset += 22; // skip bits (4 bytes) + reserved (18 bytes)
        }
        return _this;
    }
    PatternBitmap16.prototype.clone = function () {
        return new PatternBitmap16(null, this);
    };
    return PatternBitmap16;
}(Bitmap16));

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
            _this.height = reader.readInt16();
            _this.width = reader.readInt16();
            _this.escapement = reader.readInt16();
            _this.orientation = reader.readInt16();
            _this.weight = reader.readInt16();
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
            _this.facename = reader.readNullTermString(Math.min(dataLength - (reader.pos - start), 32));
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
    function Brush(reader, copy, forceDibPattern) {
        var _this = _super.call(this, "brush") || this;
        if (reader != null) {
            var dataLength = copy;
            var start = reader.pos;
            if (forceDibPattern === true || forceDibPattern === false) {
                _this.style = reader.readUint16();
                if (forceDibPattern && _this.style != Helper.GDI.BrushStyle.BS_PATTERN) {
                    _this.style = Helper.GDI.BrushStyle.BS_DIBPATTERNPT;
                }
                switch (_this.style) {
                    case Helper.GDI.BrushStyle.BS_SOLID:
                        _this.color = new ColorRef(reader);
                        break;
                    case Helper.GDI.BrushStyle.BS_PATTERN:
                        reader.skip(forceDibPattern ? 2 : 6);
                        _this.pattern = new Bitmap16(reader, dataLength - (reader.pos - start));
                        break;
                    case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                        _this.colorusage = forceDibPattern ? reader.readUint16() : reader.readUint32();
                        if (!forceDibPattern) {
                            reader.skip(2);
                        }
                        _this.dibpatternpt = new DIBitmap(reader, dataLength - (reader.pos - start));
                        break;
                    case Helper.GDI.BrushStyle.BS_HATCHED:
                        _this.color = new ColorRef(reader);
                        _this.hatchstyle = reader.readUint16();
                        break;
                }
            }
            else if (forceDibPattern instanceof PatternBitmap16) {
                _this.style = Helper.GDI.BrushStyle.BS_PATTERN;
                _this.pattern = forceDibPattern;
            }
        }
        else if (copy != null) {
            copy = copy;
            _this.style = copy.style;
            switch (_this.style) {
                case Helper.GDI.BrushStyle.BS_SOLID:
                    _this.color = copy.color.clone();
                    break;
                case Helper.GDI.BrushStyle.BS_PATTERN:
                    _this.pattern = copy.pattern.clone();
                    break;
                case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                    _this.colorusage = copy.colorusage;
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
            case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                ret += ", colorusage: " + this.colorusage;
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
    function Pen(reader, style, width, color, linecap, join) {
        var _this = _super.call(this, "pen") || this;
        if (reader != null) {
            style = reader.readUint16();
            _this.style = style & 0xFF;
            _this.width = new PointS(reader);
            _this.color = new ColorRef(reader);
            _this.linecap = (style & (Helper.GDI.PenStyle.PS_ENDCAP_SQUARE | Helper.GDI.PenStyle.PS_ENDCAP_FLAT));
            _this.join = (style & (Helper.GDI.PenStyle.PS_JOIN_BEVEL | Helper.GDI.PenStyle.PS_JOIN_MITER));
        }
        else {
            _this.style = style;
            _this.width = width;
            _this.color = color;
            _this.linecap = linecap;
            _this.join = join;
        }
        return _this;
    }
    Pen.prototype.clone = function () {
        return new Pen(null, this.style, this.width.clone(), this.color.clone(), this.linecap, this.join);
    };
    Pen.prototype.toString = function () {
        return "{style: " + this.style + ", width: " + this.width.toString() + ", color: " + this.color.toString() + ", linecap: " + this.linecap + ", join: " + this.join + "}";
    };
    return Pen;
}(Obj));
var PaletteEntry = /** @class */ (function () {
    function PaletteEntry(reader, copy) {
        if (reader != null) {
            this.flag = reader.readUint8();
            this.b = reader.readUint8();
            this.g = reader.readUint8();
            this.r = reader.readUint8();
        }
        else {
            this.flag = copy.flag;
            this.b = copy.b;
            this.g = copy.g;
            this.r = copy.r;
        }
    }
    PaletteEntry.prototype.clone = function () {
        return new PaletteEntry(null, this);
    };
    return PaletteEntry;
}());
var Palette = /** @class */ (function (_super) {
    __extends$2(Palette, _super);
    function Palette(reader, copy) {
        var _this = _super.call(this, "palette") || this;
        if (reader != null) {
            _this.start = reader.readUint16();
            var cnt = reader.readUint16();
            _this.entries = [];
            while (cnt > 0) {
                _this.entries.push(new PaletteEntry(reader));
            }
        }
        else {
            _this.start = copy.start;
            _this.entries = [];
            var len = copy.entries.length;
            for (var i = 0; i < len; i++) {
                _this.entries.push(copy.entries[i]);
            }
        }
        return _this;
    }
    Palette.prototype.clone = function () {
        return new Palette(null, this);
    };
    Palette.prototype.toString = function () {
        return "{ #entries: " + this.entries.length + "}"; // TODO
    };
    return Palette;
}(Obj));

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
            this.polyfillmode = Helper.GDI.PolyFillMode.ALTERNATE;
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
        this.defObjects = {
            brush: new Brush(null, null),
            pen: new Pen(null, Helper.GDI.PenStyle.PS_SOLID, new PointS(null, 1, 1), new ColorRef(null, 0, 0, 0), 0, 0),
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
    GDIContext.prototype._storeObject = function (obj) {
        var i = 0;
        while (this.objects[i.toString()] != null && i <= 65535) {
            i++;
        }
        if (i > 65535) {
            Helper.log("[gdi] Too many objects!");
            return -1;
        }
        this.objects[i.toString()] = obj;
        return i;
    };
    GDIContext.prototype._getObject = function (objIdx) {
        var obj = this.objects[objIdx.toString()];
        if (obj == null) {
            Helper.log("[gdi] No object with handle " + objIdx);
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
                throw new WMFJSError("Invalid brush style");
        }
        var id = Helper._makeUniqueId("p");
        var spat = this._svg.pattern(this._getSvgDef(), id, 0, 0, width, height, { patternUnits: "userSpaceOnUse" });
        this._svg.image(spat, 0, 0, width, height, img);
        this._svgPatterns[id] = brush;
        return id;
    };
    GDIContext.prototype._selectObject = function (obj) {
        this.state.selected[obj.type] = obj;
        if (obj.type == "region") {
            this.state._svgclipChanged = true;
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
    GDIContext.prototype.setWindowOrg = function (x, y) {
        Helper.log("[gdi] setWindowOrg: x=" + x + " y=" + y);
        this.state.wx = x;
        this.state.wy = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setWindowExt = function (x, y) {
        Helper.log("[gdi] setWindowExt: x=" + x + " y=" + y);
        this.state.ww = x;
        this.state.wh = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.offsetWindowOrg = function (offX, offY) {
        Helper.log("[gdi] offsetWindowOrg: offX=" + offX + " offY=" + offY);
        this.state.wx += offX;
        this.state.wy += offY;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setViewportOrg = function (x, y) {
        Helper.log("[gdi] setViewportOrg: x=" + x + " y=" + y);
        this.state.vx = x;
        this.state.vy = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.setViewportExt = function (x, y) {
        Helper.log("[gdi] setViewportExt: x=" + x + " y=" + y);
        this.state.vw = x;
        this.state.vh = y;
        this.state._svggroup = null;
    };
    GDIContext.prototype.offsetViewportOrg = function (offX, offY) {
        Helper.log("[gdi] offsetViewportOrg: offX=" + offX + " offY=" + offY);
        this.state.vx += offX;
        this.state.vy += offY;
        this.state._svggroup = null;
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
                throw new WMFJSError("restoreDC: relative restore not implemented");
            }
            else if (saved > 1) {
                throw new WMFJSError("restoreDC: absolute restore not implemented");
            }
        }
        else {
            throw new WMFJSError("No saved contexts");
        }
        this.state._svggroup = null;
    };
    GDIContext.prototype.escape = function (func, blob, offset, count) {
        Helper.log("[gdi] escape: func=" + func + " offset=" + offset + " count=" + count);
    };
    GDIContext.prototype.setStretchBltMode = function (stretchMode) {
        Helper.log("[gdi] setStretchBltMode: stretchMode=" + stretchMode);
    };
    GDIContext.prototype.stretchDib = function (srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, rasterOp, colorUsage, dib) {
        Helper.log("[gdi] stretchDib: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16));
        srcX = this._todevX(srcX);
        srcY = this._todevY(srcY);
        srcW = this._todevW(srcW);
        srcH = this._todevH(srcH);
        dstX = this._todevX(dstX);
        dstY = this._todevY(dstY);
        dstW = this._todevW(dstW);
        dstH = this._todevH(dstH);
        Helper.log("[gdi] stretchDib: TRANSLATED: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16) + " colorUsage=0x" + colorUsage.toString(16));
        this._pushGroup();
        this._svg.image(this.state._svggroup, dstX, dstY, dstW, dstH, dib.base64ref());
    };
    GDIContext.prototype.stretchDibBits = function (srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, rasterOp, dib) {
        Helper.log("[gdi] stretchDibBits: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16));
        srcX = this._todevX(srcX);
        srcY = this._todevY(srcY);
        srcW = this._todevW(srcW);
        srcH = this._todevH(srcH);
        dstX = this._todevX(dstX);
        dstY = this._todevY(dstY);
        dstW = this._todevW(dstW);
        dstH = this._todevH(dstH);
        Helper.log("[gdi] stretchDibBits: TRANSLATED: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16));
        this._pushGroup();
        this._svg.image(this.state._svggroup, dstX, dstY, dstW, dstH, dib.base64ref());
    };
    GDIContext.prototype._applyOpts = function (opts, usePen, useBrush, useFont) {
        if (opts == null) {
            opts = {};
        }
        if (usePen) {
            var pen = this.state.selected.pen;
            if (pen.style != Helper.GDI.PenStyle.PS_NULL) {
                opts.stroke = "#" + pen.color.toHex(), opts.strokeWidth = this._todevW(pen.width.x); // TODO: is .y ever used?
                var dotWidth = void 0;
                if ((pen.linecap & Helper.GDI.PenStyle.PS_ENDCAP_SQUARE) != 0) {
                    opts["stroke-linecap"] = "square";
                    dotWidth = 1;
                }
                else if ((pen.linecap & Helper.GDI.PenStyle.PS_ENDCAP_FLAT) != 0) {
                    opts["stroke-linecap"] = "butt";
                    dotWidth = opts.strokeWidth;
                }
                else {
                    opts["stroke-linecap"] = "round";
                    dotWidth = 1;
                }
                if ((pen.join & Helper.GDI.PenStyle.PS_JOIN_BEVEL) != 0) {
                    opts["stroke-linejoin"] = "bevel";
                }
                else if ((pen.join & Helper.GDI.PenStyle.PS_JOIN_MITER) != 0) {
                    opts["stroke-linejoin"] = "miter";
                }
                else {
                    opts["stroke-linejoin"] = "round";
                }
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
            opts["font-size"] = this._todevH(Math.abs(font.height));
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
    GDIContext.prototype.textOut = function (x, y, text) {
        Helper.log("[gdi] textOut: x=" + x + " y=" + y + " text=" + text + " with font " + this.state.selected.font.toString());
        x = this._todevX(x);
        y = this._todevY(y);
        Helper.log("[gdi] textOut: TRANSLATED: x=" + x + " y=" + y);
        this._pushGroup();
        var opts = this._applyOpts(null, false, false, true);
        if (this.state.selected.font.escapement != 0) {
            opts.transform = "rotate(" + [(-this.state.selected.font.escapement / 10), x, y] + ")";
            opts.style = "dominant-baseline: middle; text-anchor: start;";
        }
        if (this.state.bkmode == Helper.GDI.MixMode.OPAQUE) {
            if (this.state._svgtextbkfilter == null) {
                var filterId = Helper._makeUniqueId("f");
                var filter = this._svg.filter(this._getSvgDef(), filterId, 0, 0, 1, 1);
                this._svg.filters.flood(filter, null, "#" + this.state.bkcolor.toHex(), 1.0);
                this._svg.filters.composite(filter, null, null, "SourceGraphic");
                this.state._svgtextbkfilter = filter;
            }
            opts.filter = "url(#" + $(this.state._svgtextbkfilter).attr("id") + ")";
        }
        this._svg.text(this.state._svggroup, x, y, text, opts);
    };
    GDIContext.prototype.extTextOut = function (x, y, text, fwOpts, rect, dx) {
        Helper.log("[gdi] extTextOut: x=" + x + " y=" + y + " text=" + text + " with font " + this.state.selected.font.toString());
        x = this._todevX(x);
        y = this._todevY(y);
        Helper.log("[gdi] extTextOut: TRANSLATED: x=" + x + " y=" + y);
        this._pushGroup();
        var opts = this._applyOpts(null, false, false, true);
        if (this.state.selected.font.escapement != 0) {
            opts.transform = "rotate(" + [(-this.state.selected.font.escapement / 10), x, y] + ")";
            opts.style = "dominant-baseline: middle; text-anchor: start;";
        }
        if (this.state.bkmode == Helper.GDI.MixMode.OPAQUE) {
            if (this.state._svgtextbkfilter == null) {
                var filterId = Helper._makeUniqueId("f");
                var filter = this._svg.filter(this._getSvgDef(), filterId, 0, 0, 1, 1);
                this._svg.filters.flood(filter, null, "#" + this.state.bkcolor.toHex(), 1.0);
                this._svg.filters.composite(filter, null, null, "SourceGraphic");
                this.state._svgtextbkfilter = filter;
            }
            opts.filter = "url(#" + $(this.state._svgtextbkfilter).attr("id") + ")";
        }
        this._svg.text(this.state._svggroup, x, y, text, opts);
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
    GDIContext.prototype.moveTo = function (x, y) {
        Helper.log("[gdi] moveTo: x=" + x + " y=" + y);
        this.state.x = x;
        this.state.y = y;
    };
    GDIContext.prototype.polygon = function (points, first) {
        Helper.log("[gdi] polygon: points=" + points + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        Helper.log("[gdi] polygon: TRANSLATED: pts=" + pts);
        if (first) {
            this._pushGroup();
        }
        var opts = {
            "fill-rule": this.state.polyfillmode == Helper.GDI.PolyFillMode.ALTERNATE ? "evenodd" : "nonzero",
        };
        this._applyOpts(opts, true, true, false);
        this._svg.polygon(this.state._svggroup, pts, opts);
    };
    GDIContext.prototype.polyPolygon = function (polygons) {
        Helper.log("[gdi] polyPolygon: polygons.length=" + polygons.length + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var cnt = polygons.length;
        for (var i = 0; i < cnt; i++) {
            this.polygon(polygons[i], i == 0);
        }
    };
    GDIContext.prototype.polyline = function (points) {
        Helper.log("[gdi] polyline: points=" + points + " with pen " + this.state.selected.pen.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        Helper.log("[gdi] polyline: TRANSLATED: pts=" + pts);
        this._pushGroup();
        var opts = this._applyOpts({ fill: "none" }, true, false, false);
        this._svg.polyline(this.state._svggroup, pts, opts);
    };
    GDIContext.prototype.ellipse = function (rect) {
        Helper.log("[gdi] ellipse: rect=" + rect.toString() + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var bottom = this._todevY(rect.bottom);
        var right = this._todevX(rect.right);
        var top = this._todevY(rect.top);
        var left = this._todevX(rect.left);
        Helper.log("[gdi] ellipse: TRANSLATED: bottom=" + bottom + " right=" + right + " top=" + top + " left=" + left);
        this._pushGroup();
        var width2 = (right - left) / 2;
        var height2 = (bottom - top) / 2;
        var opts = this._applyOpts(null, true, true, false);
        this._svg.ellipse(this.state._svggroup, left + width2, top + height2, width2, height2, opts);
    };
    GDIContext.prototype.excludeClipRect = function (rect) {
        Helper.log("[gdi] excludeClipRect: rect=" + rect.toString());
        this._getClipRgn().subtract(rect);
    };
    GDIContext.prototype.intersectClipRect = function (rect) {
        Helper.log("[gdi] intersectClipRect: rect=" + rect.toString());
        this._getClipRgn().intersect(rect);
    };
    GDIContext.prototype.offsetClipRgn = function (offX, offY) {
        Helper.log("[gdi] offsetClipRgn: offX=" + offX + " offY=" + offY);
        this._getClipRgn().offset(offX, offY);
    };
    GDIContext.prototype.setTextAlign = function (textAlignmentMode) {
        Helper.log("[gdi] setTextAlign: textAlignmentMode=0x" + textAlignmentMode.toString(16));
        this.state.textalign = textAlignmentMode;
    };
    GDIContext.prototype.setBkMode = function (bkMode) {
        Helper.log("[gdi] setBkMode: bkMode=0x" + bkMode.toString(16));
        this.state.bkmode = bkMode;
    };
    GDIContext.prototype.setTextColor = function (textColor) {
        Helper.log("[gdi] setTextColor: textColor=" + textColor.toString());
        this.state.textcolor = textColor;
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
    GDIContext.prototype.createBrush = function (brush) {
        var idx = this._storeObject(brush);
        Helper.log("[gdi] createBrush: brush=" + brush.toString() + " with handle " + idx);
    };
    GDIContext.prototype.createFont = function (font) {
        var idx = this._storeObject(font);
        Helper.log("[gdi] createFont: font=" + font.toString() + " with handle " + idx);
    };
    GDIContext.prototype.createPen = function (pen) {
        var idx = this._storeObject(pen);
        Helper.log("[gdi] createPen: pen=" + pen.toString() + " width handle " + idx);
    };
    GDIContext.prototype.createPalette = function (palette) {
        var idx = this._storeObject(palette);
        Helper.log("[gdi] createPalette: palette=" + palette.toString() + " width handle " + idx);
    };
    GDIContext.prototype.createRegion = function (region) {
        var idx = this._storeObject(region);
        Helper.log("[gdi] createRegion: region=" + region.toString() + " width handle " + idx);
    };
    GDIContext.prototype.createPatternBrush = function (patternBrush) {
        var idx = this._storeObject(patternBrush);
        Helper.log("[gdi] createRegion: region=" + patternBrush.toString() + " width handle " + idx);
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
    GDIContext.prototype.deleteObject = function (objIdx) {
        var ret = this._deleteObject(objIdx);
        Helper.log("[gdi] deleteObject: objIdx=" + objIdx + (ret ? " deleted object" : "[invalid index]"));
    };
    return GDIContext;
}());

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
var WMFRecords = /** @class */ (function () {
    function WMFRecords(reader, first) {
        this._records = [];
        var all = false;
        var curpos = first;
        var _loop_1 = function () {
            reader.seek(curpos);
            var size = reader.readUint32();
            if (size < 3) {
                throw new WMFJSError("Invalid record size");
            }
            var type = reader.readUint16();
            switch (type) {
                case Helper.GDI.RecordType.META_EOF:
                    all = true;
                    return "break-main_loop";
                case Helper.GDI.RecordType.META_SETMAPMODE: {
                    var mapMode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setMapMode(mapMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETWINDOWORG: {
                    var y_1 = reader.readInt16();
                    var x_1 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowOrg(x_1, y_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETWINDOWEXT: {
                    var y_2 = reader.readInt16();
                    var x_2 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setWindowExt(x_2, y_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_OFFSETWINDOWORG: {
                    var offY_1 = reader.readInt16();
                    var offX_1 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.offsetWindowOrg(offX_1, offY_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETVIEWPORTORG: {
                    var y_3 = reader.readInt16();
                    var x_3 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportOrg(x_3, y_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETVIEWPORTEXT: {
                    var y_4 = reader.readInt16();
                    var x_4 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.setViewportExt(x_4, y_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_OFFSETVIEWPORTORG: {
                    var offY_2 = reader.readInt16();
                    var offX_2 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.offsetViewportOrg(offX_2, offY_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SAVEDC: {
                    this_1._records.push(function (gdi) {
                        gdi.saveDC();
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_RESTOREDC: {
                    var saved_1 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.restoreDC(saved_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETSTRETCHBLTMODE: {
                    var stretchMode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setStretchBltMode(stretchMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_DIBSTRETCHBLT: {
                    var rasterOp_1 = reader.readUint16() | (reader.readUint16() << 16);
                    var srcH_1 = reader.readInt16();
                    var srcW_1 = reader.readInt16();
                    var srcY_1 = reader.readInt16();
                    var srcX_1 = reader.readInt16();
                    var destH_1 = reader.readInt16();
                    var destW_1 = reader.readInt16();
                    var destY_1 = reader.readInt16();
                    var destX_1 = reader.readInt16();
                    var datalength = size * 2 - (reader.pos - curpos);
                    var dib_1 = new DIBitmap(reader, datalength);
                    this_1._records.push(function (gdi) {
                        gdi.stretchDibBits(srcX_1, srcY_1, srcW_1, srcH_1, destX_1, destY_1, destW_1, destH_1, rasterOp_1, dib_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_STRETCHDIB: {
                    var rasterOp_2 = reader.readUint16() | (reader.readUint16() << 16);
                    var colorUsage_1 = reader.readInt16();
                    var srcH_2 = reader.readInt16();
                    var srcW_2 = reader.readInt16();
                    var srcY_2 = reader.readInt16();
                    var srcX_2 = reader.readInt16();
                    var destH_2 = reader.readInt16();
                    var destW_2 = reader.readInt16();
                    var destY_2 = reader.readInt16();
                    var destX_2 = reader.readInt16();
                    var datalength = size * 2 - (reader.pos - curpos);
                    var dib_2 = new DIBitmap(reader, datalength);
                    this_1._records.push(function (gdi) {
                        gdi.stretchDib(srcX_2, srcY_2, srcW_2, srcH_2, destX_2, destY_2, destW_2, destH_2, rasterOp_2, colorUsage_1, dib_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_ESCAPE: {
                    var func_1 = reader.readUint16();
                    var count_1 = reader.readUint16();
                    var offset_1 = reader.pos;
                    var blob_1 = new Blob(reader, offset_1);
                    this_1._records.push(function (gdi) {
                        gdi.escape(func_1, blob_1, offset_1, count_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETTEXTALIGN: {
                    var textAlign_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setTextAlign(textAlign_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETBKMODE: {
                    var bkMode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setBkMode(bkMode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETTEXTCOLOR: {
                    var textColor_1 = new ColorRef(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setTextColor(textColor_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETBKCOLOR: {
                    var bkColor_1 = new ColorRef(reader);
                    this_1._records.push(function (gdi) {
                        gdi.setBkColor(bkColor_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEBRUSHINDIRECT: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var brush_1 = new Brush(reader, datalength, false);
                    this_1._records.push(function (gdi) {
                        gdi.createBrush(brush_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_DIBCREATEPATTERNBRUSH: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var brush_2 = new Brush(reader, datalength, true);
                    this_1._records.push(function (gdi) {
                        gdi.createBrush(brush_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEPENINDIRECT: {
                    var pen_1 = new Pen(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createPen(pen_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEFONTINDIRECT: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var font_1 = new Font(reader, datalength);
                    this_1._records.push(function (gdi) {
                        gdi.createFont(font_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SELECTOBJECT: {
                    var idx_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_1, null);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SELECTPALETTE: {
                    var idx_2 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_2, "palette");
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SELECTCLIPREGION: {
                    var idx_3 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.selectObject(idx_3, "region");
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_DELETEOBJECT: {
                    var idx_4 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.deleteObject(idx_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_RECTANGLE: {
                    var rect_1 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_1, 0, 0);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_ROUNDRECT: {
                    var rh_1 = reader.readInt16();
                    var rw_1 = reader.readInt16();
                    var rect_2 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.rectangle(rect_2, rw_1, rh_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_LINETO: {
                    var y_5 = reader.readInt16();
                    var x_5 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.lineTo(x_5, y_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_MOVETO: {
                    var y_6 = reader.readInt16();
                    var x_6 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.moveTo(x_6, y_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_TEXTOUT: {
                    var len = reader.readInt16();
                    if (len > 0) {
                        var text_1 = reader.readString(len);
                        reader.skip(len % 2);
                        var y_7 = reader.readInt16();
                        var x_7 = reader.readInt16();
                        this_1._records.push(function (gdi) {
                            gdi.textOut(x_7, y_7, text_1);
                        });
                    }
                    break;
                }
                case Helper.GDI.RecordType.META_EXTTEXTOUT: {
                    var y_8 = reader.readInt16();
                    var x_8 = reader.readInt16();
                    var len = reader.readInt16();
                    var fwOpts_1 = reader.readUint16();
                    var hasRect = null;
                    var hasDx = null;
                    if (size * 2 === 14 + len + len % 2) {
                        hasRect = false;
                        hasDx = false;
                    }
                    if (size * 2 === 14 + 8 + len + len % 2) {
                        hasRect = true;
                        hasDx = false;
                    }
                    if (size * 2 === 14 + len + len % 2 + len * 2) {
                        hasRect = false;
                        hasDx = true;
                    }
                    if (size * 2 === 14 + 8 + len + len % 2 + len * 2) {
                        hasRect = true;
                        hasDx = true;
                    }
                    var rect_3 = hasRect ? new Rect(reader) : null;
                    if (len > 0) {
                        var text_2 = reader.readString(len);
                        reader.skip(len % 2);
                        var dx_1 = [];
                        if (hasDx) {
                            for (var i = 0; i < text_2.length; i++) {
                                dx_1.push(reader.readInt16());
                            }
                        }
                        this_1._records.push(function (gdi) {
                            gdi.extTextOut(x_8, y_8, text_2, fwOpts_1, rect_3, dx_1);
                        });
                    }
                    break;
                }
                case Helper.GDI.RecordType.META_EXCLUDECLIPRECT: {
                    var rect_4 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.excludeClipRect(rect_4);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_INTERSECTCLIPRECT: {
                    var rect_5 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.intersectClipRect(rect_5);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_POLYGON: {
                    var cnt = reader.readInt16();
                    var points_1 = [];
                    while (cnt > 0) {
                        points_1.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polygon(points_1, true);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_SETPOLYFILLMODE: {
                    var polyfillmode_1 = reader.readUint16();
                    this_1._records.push(function (gdi) {
                        gdi.setPolyFillMode(polyfillmode_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_POLYPOLYGON: {
                    var cnt = reader.readUint16();
                    var polygonsPtCnts = [];
                    for (var i = 0; i < cnt; i++) {
                        polygonsPtCnts.push(reader.readUint16());
                    }
                    var polygons_1 = [];
                    for (var i = 0; i < cnt; i++) {
                        var ptCnt = polygonsPtCnts[i];
                        var p = [];
                        for (var ip = 0; ip < ptCnt; ip++) {
                            p.push(new PointS(reader));
                        }
                        polygons_1.push(p);
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyPolygon(polygons_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_POLYLINE: {
                    var cnt = reader.readInt16();
                    var points_2 = [];
                    while (cnt > 0) {
                        points_2.push(new PointS(reader));
                        cnt--;
                    }
                    this_1._records.push(function (gdi) {
                        gdi.polyline(points_2);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_ELLIPSE: {
                    var rect_6 = new Rect(reader);
                    this_1._records.push(function (gdi) {
                        gdi.ellipse(rect_6);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEPALETTE: {
                    var palette_1 = new Palette(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createPalette(palette_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEREGION: {
                    var region_1 = new Region(reader);
                    this_1._records.push(function (gdi) {
                        gdi.createRegion(region_1);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_CREATEPATTERNBRUSH: {
                    var datalength = size * 2 - (reader.pos - curpos);
                    var patternBitmap = new PatternBitmap16(reader, datalength);
                    var brush_3 = new Brush(reader, datalength, patternBitmap);
                    this_1._records.push(function (gdi) {
                        gdi.createPatternBrush(brush_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_OFFSETCLIPRGN: {
                    var offY_3 = reader.readInt16();
                    var offX_3 = reader.readInt16();
                    this_1._records.push(function (gdi) {
                        gdi.offsetClipRgn(offX_3, offY_3);
                    });
                    break;
                }
                case Helper.GDI.RecordType.META_REALIZEPALETTE:
                case Helper.GDI.RecordType.META_SETPALENTRIES:
                case Helper.GDI.RecordType.META_SETROP2:
                case Helper.GDI.RecordType.META_SETRELABS:
                case Helper.GDI.RecordType.META_SETTEXTCHAREXTRA:
                case Helper.GDI.RecordType.META_RESIZEPALETTE:
                case Helper.GDI.RecordType.META_SETLAYOUT:
                case Helper.GDI.RecordType.META_FILLREGION:
                case Helper.GDI.RecordType.META_SETMAPPERFLAGS:
                case Helper.GDI.RecordType.META_SETTEXTJUSTIFICATION:
                case Helper.GDI.RecordType.META_SCALEWINDOWEXT:
                case Helper.GDI.RecordType.META_SCALEVIEWPORTEXT:
                case Helper.GDI.RecordType.META_FLOODFILL:
                case Helper.GDI.RecordType.META_FRAMEREGION:
                case Helper.GDI.RecordType.META_ANIMATEPALETTE:
                case Helper.GDI.RecordType.META_EXTFLOODFILL:
                case Helper.GDI.RecordType.META_SETPIXEL:
                case Helper.GDI.RecordType.META_PATBLT:
                case Helper.GDI.RecordType.META_PIE:
                case Helper.GDI.RecordType.META_STRETCHBLT:
                case Helper.GDI.RecordType.META_INVERTREGION:
                case Helper.GDI.RecordType.META_PAINTREGION:
                case Helper.GDI.RecordType.META_ARC:
                case Helper.GDI.RecordType.META_CHORD:
                case Helper.GDI.RecordType.META_BITBLT:
                case Helper.GDI.RecordType.META_SETDIBTODEV:
                case Helper.GDI.RecordType.META_DIBBITBLT:
                default: {
                    var recordName = "UNKNOWN";
                    for (var name_1 in Helper.GDI.RecordType) {
                        var recordTypes = Helper.GDI.RecordType;
                        if (recordTypes[name_1] == type) {
                            recordName = name_1;
                            break;
                        }
                    }
                    Helper.log("[WMF] " + recordName + " record (0x" + type.toString(16) + ") at offset 0x" + curpos.toString(16) + " with " + (size * 2) + " bytes");
                    break;
                }
            }
            curpos += size * 2;
        };
        var this_1 = this;
        main_loop: while (!all) {
            var state_1 = _loop_1();
            switch (state_1) {
                case "break-main_loop": break main_loop;
            }
        }
        if (!all) {
            throw new WMFJSError("Could not read all records");
        }
    }
    WMFRecords.prototype.play = function (gdi) {
        var len = this._records.length;
        for (var i = 0; i < len; i++) {
            this._records[i].call(this, gdi);
        }
    };
    return WMFRecords;
}());

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
var RendererSettings = /** @class */ (function () {
    function RendererSettings() {
    }
    return RendererSettings;
}());
var Renderer = /** @class */ (function () {
    function Renderer(blob) {
        this.parse(blob);
        Helper.log("WMFJS.Renderer instantiated");
    }
    Renderer.prototype.parse = function (blob) {
        this._img = null;
        var reader = new Blob(blob);
        var type;
        var size;
        var placable;
        var headerstart;
        var key = reader.readUint32();
        if (key == 0x9ac6cdd7) {
            placable = new WMFPlacable(reader);
            headerstart = reader.pos;
            type = reader.readUint16();
            size = reader.readUint16();
        }
        else {
            headerstart = 0;
            type = key & 0xffff;
            size = (key >>> 16) & 0xffff;
        }
        switch (type) {
            case Helper.GDI.MetafileType.MEMORYMETAFILE:
            case Helper.GDI.MetafileType.DISKMETAFILE:
                if (size == Helper.GDI.METAHEADER_SIZE / 2) {
                    var version = reader.readUint16();
                    switch (version) {
                        case Helper.GDI.MetafileVersion.METAVERSION100:
                        case Helper.GDI.MetafileVersion.METAVERSION300:
                            this._img = new WMF(reader, placable, version, headerstart + (size * 2));
                            break;
                    }
                }
                break;
        }
        if (this._img == null) {
            throw new WMFJSError("Format not recognized");
        }
    };
    Renderer.prototype._render = function (svg, mapMode, xExt, yExt) {
        // See https://www-user.tu-chemnitz.de/~ygu/petzold/ch18b.htm
        var gdi = new GDIContext(svg);
        gdi.setViewportExt(xExt, yExt);
        gdi.setMapMode(mapMode);
        Helper.log("[WMF] BEGIN RENDERING --->");
        this._img.render(gdi);
        Helper.log("[WMF] <--- DONE RENDERING");
    };
    Renderer.prototype.render = function (info) {
        var inst = this;
        var img = (function (mapMode, xExt, yExt) {
            return $("<div>").svg({
                onLoad: function (svg) {
                    return inst._render.call(inst, svg, mapMode, xExt, yExt);
                },
                settings: {
                    viewBox: [0, 0, xExt, yExt].join(" "),
                    preserveAspectRatio: "none",
                },
            });
        })(info.mapMode, info.xExt, info.yExt);
        var svgContainer = $(img[0]).svg("get");
        return $(svgContainer.root()).attr("width", info.width).attr("height", info.height);
    };
    return Renderer;
}());
var WMFRect16 = /** @class */ (function () {
    function WMFRect16(reader) {
        this.left = reader.readInt16();
        this.top = reader.readInt16();
        this.right = reader.readInt16();
        this.bottom = reader.readInt16();
    }
    WMFRect16.prototype.toString = function () {
        return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
    };
    return WMFRect16;
}());
var WMFPlacable = /** @class */ (function () {
    function WMFPlacable(reader) {
        reader.skip(2);
        this.boundingBox = new WMFRect16(reader);
        this.unitsPerInch = reader.readInt16();
        reader.skip(4);
        reader.skip(2); // TODO: checksum
        Helper.log("Got bounding box " + this.boundingBox + " and " + this.unitsPerInch + " units/inch");
    }
    return WMFPlacable;
}());
var WMF = /** @class */ (function () {
    function WMF(reader, placable, version, hdrsize) {
        this._reader = reader;
        this._version = version;
        this._hdrsize = hdrsize;
        this._placable = placable;
        this._records = new WMFRecords(reader, this._hdrsize);
    }
    WMF.prototype.render = function (gdi) {
        this._records.play(gdi);
    };
    return WMF;
}());

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

exports.Error = WMFJSError;
exports.loggingEnabled = loggingEnabled;
exports.RendererSettings = RendererSettings;
exports.Renderer = Renderer;
exports.WMFRect16 = WMFRect16;
exports.WMFPlacable = WMFPlacable;
exports.WMF = WMF;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=wmf.bundle.js.map
