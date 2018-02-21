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

import { Obj, PointL } from './Primitives';
import { Helper } from './Helper';
import { DIBitmap } from './Bitmap';

export  class ColorRef {
    r;
    g;
    b;

    constructor(reader, r?, g?, b?) {
        if (reader != null) {
            this.r = reader.readUint8();
            this.g = reader.readUint8();
            this.b = reader.readUint8();
            reader.skip(1);
        } else {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }

    clone() {
        return new ColorRef(null, this.r, this.g, this.b);
    };

    toHex() {
        var rgb = (this.r << 16) | (this.g << 8) | this.b;
        return (0x1000000 + rgb).toString(16).slice(1);
    };

    toString() {
        return "{r: " + this.r + ", g: " + this.g + ", b: " + this.b + "}";
    };
};

export class Font extends Obj{
    height;
    width;
    escapement;
    orientation;
    weight;
    italic;
    underline;
    strikeout;
    charset;
    outprecision;
    clipprecision;
    quality;
    pitch;
    family;
    facename;

    constructor(reader, copy) {
        super("font");
        if (reader != null) {
            this.height = reader.readInt32();
            this.width = reader.readInt32();
            this.escapement = reader.readInt32();
            this.orientation = reader.readInt32();
            this.weight = reader.readInt32();
            this.italic = reader.readUint8();
            this.underline = reader.readUint8();
            this.strikeout = reader.readUint8();
            this.charset = reader.readUint8();
            this.outprecision = reader.readUint8();
            this.clipprecision = reader.readUint8();
            this.quality = reader.readUint8();
            var pitchAndFamily = reader.readUint8();
            this.pitch = pitchAndFamily & 0xf; // TODO: double check
            this.family = (pitchAndFamily >> 6) & 0x3; // TODO: double check

            var dataLength = copy;
            var start = reader.pos;
            this.facename = reader.readFixedSizeUnicodeString(Math.min(dataLength - (reader.pos - start), 32));
        } else if (copy != null) {
            this.height = copy.height;
            this.width = copy.width;
            this.escapement = copy.escapement;
            this.orientation = copy.orientation;
            this.weight = copy.weight;
            this.italic = copy.italic;
            this.underline = copy.underline;
            this.strikeout = copy.strikeout;
            this.charset = copy.charset;
            this.outprecision = copy.outprecision;
            this.clipprecision = copy.clipprecision;
            this.quality = copy.quality;
            this.pitch = copy.pitch;
            this.family = copy.family;
            this.facename = copy.facename;
        } else {
            // TODO: Values for a default font?
            this.height = -80;
            this.width = 0;
            this.escapement = 0;
            this.orientation = 0;
            this.weight = 400;
            this.italic = 0;
            this.underline = 0;
            this.strikeout = 0;
            this.charset = 0;
            this.outprecision = 0;
            this.clipprecision = 0;
            this.quality = 0;
            this.pitch = 0;
            this.family = 0;
            this.facename = "Helvetica";
        }
    }

    clone() {
        return new Font(null, this);
    };

    toString() {
        //return "{facename: " + this.facename + ", height: " + this.height + ", width: " + this.width + "}";
        return JSON.stringify(this);
    };
};

export class Brush extends Obj{
    style;
    color;
    pattern;
    dibpatternpt;
    hatchstyle;
    colorusage;

    constructor(reader, copy?, bitmapInfo?) {
        super("brush");
        if (reader != null) {
            var start = reader.pos;

            this.style = reader.readUint32();
            switch (this.style) {
                case Helper.GDI.BrushStyle.BS_SOLID:
                    this.color = new ColorRef(reader);
                    break;
                case Helper.GDI.BrushStyle.BS_PATTERN:
                    this.pattern = new DIBitmap(reader, bitmapInfo);
                    break;
                case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                    this.dibpatternpt = new DIBitmap(reader, bitmapInfo);
                    break;
                case Helper.GDI.BrushStyle.BS_HATCHED:
                    this.color = new ColorRef(reader);
                    this.hatchstyle = reader.readUint32();
                    break;
            }

            reader.seek(start + 12);
        } else {
            this.style = copy.style;
            switch (this.style) {
                case Helper.GDI.BrushStyle.BS_SOLID:
                    this.color = copy.color.clone();
                    break;
                case Helper.GDI.BrushStyle.BS_PATTERN:
                    this.pattern = copy.pattern.clone();
                    break;
                case Helper.GDI.BrushStyle.BS_DIBPATTERNPT:
                    this.colorusage = copy.colorusage;
                    this.dibpatternpt = copy.dibpatternpt;
                    break;
                case Helper.GDI.BrushStyle.BS_HATCHED:
                    this.color = copy.color.clone();
                    this.hatchstyle = copy.hatchstyle;
                    break;
            }
        }
    }

    clone() {
        return new Brush(null, this);
    };

    toString() {
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
};

export class Pen extends Obj{
    style;
    width;
    brush;
    color;

    constructor(reader, style?, width?, color?, brush?) {
        super("pen");
        if (reader != null) {
            if (style != null) {
                // LogPenEx
                var bitmapInfo = style;

                this.style = reader.readUint32() & 0xFF;
                this.width = reader.readUint32();
                this.brush = new Brush(reader);
                this.color = this.brush.color != null ? this.brush.color.clone() : new ColorRef(null, 0, 0, 0);
                // TODO: NumStyleEntries, StyleEntry
            } else {
                // LogPen
                this.style = reader.readUint32() & 0xFF;
                this.width = (new PointL(reader)).x;
                this.color = new ColorRef(reader);
            }
        } else {
            this.style = style;
            this.width = width;
            if (color != null)
                this.color = color;
            if (brush != null)
                this.brush = brush;
        }
    }

    clone() {
        return new Pen(null, this.style, this.width, this.color != null ? this.color.clone() : null, this.brush != null ? this.brush.clone() : null);
    };

    toString() {
        return "{style: " + this.style + ", width: " + this.width + ", color: " + (this.color != null ? this.color.toString() : "none") + "}";
    };
};
