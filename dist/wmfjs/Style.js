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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Helper } from './Helper';
import { Obj, PointS } from './Primitives';
import { Bitmap16, DIBitmap, PatternBitmap16 } from './Bitmap';
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
    ;
    ColorRef.prototype.toHex = function () {
        var rgb = (this.r << 16) | (this.g << 8) | this.b;
        return (0x1000000 + rgb).toString(16).slice(1);
    };
    ;
    ColorRef.prototype.toString = function () {
        return "{r: " + this.r + ", g: " + this.g + ", b: " + this.b + "}";
    };
    ;
    return ColorRef;
}());
export { ColorRef };
;
var Font = /** @class */ (function (_super) {
    __extends(Font, _super);
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
    ;
    Font.prototype.toString = function () {
        //return "{facename: " + this.facename + ", height: " + this.height + ", width: " + this.width + "}";
        return JSON.stringify(this);
    };
    ;
    return Font;
}(Obj));
export { Font };
;
var Brush = /** @class */ (function (_super) {
    __extends(Brush, _super);
    function Brush(reader, copy, forceDibPattern) {
        var _this = _super.call(this, "brush") || this;
        if (reader != null) {
            var dataLength = copy;
            var start = reader.pos;
            if (forceDibPattern === true || forceDibPattern === false) {
                _this.style = reader.readUint16();
                if (forceDibPattern && _this.style != Helper.GDI.BrushStyle.BS_PATTERN)
                    _this.style = Helper.GDI.BrushStyle.BS_DIBPATTERNPT;
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
                        if (!forceDibPattern)
                            reader.skip(2);
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
        else {
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
    ;
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
    ;
    return Brush;
}(Obj));
export { Brush };
;
var Pen = /** @class */ (function (_super) {
    __extends(Pen, _super);
    function Pen(reader, style, width, color, linecap, join) {
        var _this = _super.call(this, "pen") || this;
        if (reader != null) {
            var style = reader.readUint16();
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
    ;
    Pen.prototype.toString = function () {
        return "{style: " + this.style + ", width: " + this.width.toString() + ", color: " + this.color.toString() + ", linecap: " + this.linecap + ", join: " + this.join + "}";
    };
    ;
    return Pen;
}(Obj));
export { Pen };
;
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
    ;
    return PaletteEntry;
}());
export { PaletteEntry };
;
var Palette = /** @class */ (function (_super) {
    __extends(Palette, _super);
    function Palette(reader, copy) {
        var _this = _super.call(this, "palette") || this;
        if (reader != null) {
            _this.start = reader.readUint16();
            var cnt = reader.readUint16();
            _this.entries = [];
            while (cnt > 0)
                _this.entries.push(new PaletteEntry(reader));
        }
        else {
            _this.start = copy.start;
            _this.entries = [];
            var len = copy.entries.length;
            for (var i = 0; i < len; i++)
                _this.entries.push(copy.entries[i]);
        }
        return _this;
    }
    Palette.prototype.clone = function () {
        return new Palette(null, this);
    };
    ;
    Palette.prototype.toString = function () {
        return "{ #entries: " + this.entries.length + "}"; // TODO
    };
    ;
    return Palette;
}(Obj));
export { Palette };
;
