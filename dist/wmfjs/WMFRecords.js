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
import { Helper, WMFJSError } from './Helper';
import { Blob } from './Blob';
import { PointS, Rect } from './Primitives';
import { Region } from './Region';
import { DIBitmap, PatternBitmap16 } from './Bitmap';
import { Brush, ColorRef, Font, Palette, Pen } from './Style';
var WMFRecords = /** @class */ (function () {
    function WMFRecords(reader, first) {
        this._records = [];
        var all = false;
        var curpos = first;
        main_loop: while (!all) {
            reader.seek(curpos);
            var size = reader.readUint32();
            if (size < 3)
                throw new WMFJSError("Invalid record size");
            var type = reader.readUint16();
            switch (type) {
                case Helper.GDI.RecordType.META_EOF:
                    all = true;
                    break main_loop;
                case Helper.GDI.RecordType.META_SETMAPMODE:
                    var mapMode = reader.readUint16();
                    this._records.push((function (mapMode) {
                        return function (gdi) {
                            gdi.setMapMode(mapMode);
                        };
                    })(mapMode));
                    break;
                case Helper.GDI.RecordType.META_SETWINDOWORG:
                    var y = reader.readInt16();
                    var x = reader.readInt16();
                    this._records.push((function (y, x) {
                        return function (gdi) {
                            gdi.setWindowOrg(x, y);
                        };
                    })(y, x));
                    break;
                case Helper.GDI.RecordType.META_SETWINDOWEXT:
                    var y = reader.readInt16();
                    var x = reader.readInt16();
                    this._records.push((function (y, x) {
                        return function (gdi) {
                            gdi.setWindowExt(x, y);
                        };
                    })(y, x));
                    break;
                case Helper.GDI.RecordType.META_OFFSETWINDOWORG:
                    var offY = reader.readInt16();
                    var offX = reader.readInt16();
                    this._records.push((function (offY, offX) {
                        return function (gdi) {
                            gdi.offsetWindowOrg(offX, offY);
                        };
                    })(offY, offX));
                    break;
                case Helper.GDI.RecordType.META_SETVIEWPORTORG:
                    var y = reader.readInt16();
                    var x = reader.readInt16();
                    this._records.push((function (y, x) {
                        return function (gdi) {
                            gdi.setViewportOrg(x, y);
                        };
                    })(y, x));
                    break;
                case Helper.GDI.RecordType.META_SETVIEWPORTEXT:
                    var y = reader.readInt16();
                    var x = reader.readInt16();
                    this._records.push((function (y, x) {
                        return function (gdi) {
                            gdi.setViewportExt(x, y);
                        };
                    })(y, x));
                    break;
                case Helper.GDI.RecordType.META_OFFSETVIEWPORTORG:
                    var offY = reader.readInt16();
                    var offX = reader.readInt16();
                    this._records.push((function (offY, offX) {
                        return function (gdi) {
                            gdi.offsetViewportOrg(offX, offY);
                        };
                    })(offY, offX));
                    break;
                case Helper.GDI.RecordType.META_SAVEDC:
                    this._records.push(function (gdi) {
                        gdi.saveDC();
                    });
                    break;
                case Helper.GDI.RecordType.META_RESTOREDC:
                    var saved = reader.readInt16();
                    this._records.push((function (saved) {
                        return function (gdi) {
                            gdi.restoreDC(saved);
                        };
                    })(saved));
                    break;
                case Helper.GDI.RecordType.META_SETSTRETCHBLTMODE:
                    var stretchMode = reader.readUint16();
                    this._records.push((function (stretchMode) {
                        return function (gdi) {
                            gdi.setStretchBltMode(stretchMode);
                        };
                    })(stretchMode));
                    break;
                case Helper.GDI.RecordType.META_DIBSTRETCHBLT:
                    var haveSrcDib = ((type >> 8) + 3 != size);
                    var rasterOp = reader.readUint16() | (reader.readUint16() << 16);
                    var srcH = reader.readInt16();
                    var srcW = reader.readInt16();
                    var srcY = reader.readInt16();
                    var srcX = reader.readInt16();
                    var destH = reader.readInt16();
                    var destW = reader.readInt16();
                    var destY = reader.readInt16();
                    var destX = reader.readInt16();
                    var datalength = size * 2 - (reader.pos - curpos);
                    var dib = new DIBitmap(reader, datalength);
                    this._records.push((function (rasterOp, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib) {
                        return function (gdi) {
                            gdi.stretchDibBits(srcX, srcY, srcW, srcH, destX, destY, destW, destH, rasterOp, dib);
                        };
                    })(rasterOp, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib));
                    break;
                case Helper.GDI.RecordType.META_STRETCHDIB:
                    var rasterOp = reader.readUint16() | (reader.readUint16() << 16);
                    var colorUsage = reader.readInt16();
                    var srcH = reader.readInt16();
                    var srcW = reader.readInt16();
                    var srcY = reader.readInt16();
                    var srcX = reader.readInt16();
                    var destH = reader.readInt16();
                    var destW = reader.readInt16();
                    var destY = reader.readInt16();
                    var destX = reader.readInt16();
                    var datalength = size * 2 - (reader.pos - curpos);
                    var dib = new DIBitmap(reader, datalength);
                    this._records.push((function (rasterOp, colorUsage, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib) {
                        return function (gdi) {
                            gdi.stretchDib(srcX, srcY, srcW, srcH, destX, destY, destW, destH, rasterOp, colorUsage, dib);
                        };
                    })(rasterOp, colorUsage, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib));
                    break;
                case Helper.GDI.RecordType.META_ESCAPE:
                    var func = reader.readUint16();
                    var count = reader.readUint16();
                    var offset = reader.pos;
                    var blob = new Blob(reader, offset);
                    this._records.push((function (func, count, offset, blob) {
                        return function (gdi) {
                            gdi.escape(func, blob, offset, count);
                        };
                    })(func, count, offset, blob));
                    break;
                case Helper.GDI.RecordType.META_SETTEXTALIGN:
                    var textAlign = reader.readUint16();
                    this._records.push((function (textAlign) {
                        return function (gdi) {
                            gdi.setTextAlign(textAlign);
                        };
                    })(textAlign));
                    break;
                case Helper.GDI.RecordType.META_SETBKMODE:
                    var bkMode = reader.readUint16();
                    this._records.push((function (bkMode) {
                        return function (gdi) {
                            gdi.setBkMode(bkMode);
                        };
                    })(bkMode));
                    break;
                case Helper.GDI.RecordType.META_SETTEXTCOLOR:
                    var textColor = new ColorRef(reader);
                    this._records.push((function (textColor) {
                        return function (gdi) {
                            gdi.setTextColor(textColor);
                        };
                    })(textColor));
                    break;
                case Helper.GDI.RecordType.META_SETBKCOLOR:
                    var bkColor = new ColorRef(reader);
                    this._records.push((function (bkColor) {
                        return function (gdi) {
                            gdi.setBkColor(bkColor);
                        };
                    })(bkColor));
                    break;
                case Helper.GDI.RecordType.META_CREATEBRUSHINDIRECT:
                    var datalength = size * 2 - (reader.pos - curpos);
                    var brush = new Brush(reader, datalength, false);
                    this._records.push((function (brush, datalength) {
                        return function (gdi) {
                            gdi.createBrush(brush);
                        };
                    })(brush, datalength));
                    break;
                case Helper.GDI.RecordType.META_DIBCREATEPATTERNBRUSH:
                    var datalength = size * 2 - (reader.pos - curpos);
                    var brush = new Brush(reader, datalength, true);
                    this._records.push((function (brush, datalength) {
                        return function (gdi) {
                            gdi.createBrush(brush);
                        };
                    })(brush, datalength));
                    break;
                case Helper.GDI.RecordType.META_CREATEPENINDIRECT:
                    var pen = new Pen(reader);
                    this._records.push((function (pen) {
                        return function (gdi) {
                            gdi.createPen(pen);
                        };
                    })(pen));
                    break;
                case Helper.GDI.RecordType.META_CREATEFONTINDIRECT:
                    var datalength = size * 2 - (reader.pos - curpos);
                    var font = new Font(reader, datalength);
                    this._records.push((function (font, datalength) {
                        return function (gdi) {
                            gdi.createFont(font);
                        };
                    })(font, datalength));
                    break;
                case Helper.GDI.RecordType.META_SELECTOBJECT:
                    var idx = reader.readUint16();
                    this._records.push((function (idx) {
                        return function (gdi) {
                            gdi.selectObject(idx, null);
                        };
                    })(idx));
                    break;
                case Helper.GDI.RecordType.META_SELECTPALETTE:
                    var idx = reader.readUint16();
                    this._records.push((function (idx) {
                        return function (gdi) {
                            gdi.selectObject(idx, "palette");
                        };
                    })(idx));
                    break;
                case Helper.GDI.RecordType.META_SELECTCLIPREGION:
                    var idx = reader.readUint16();
                    this._records.push((function (idx) {
                        return function (gdi) {
                            gdi.selectObject(idx, "region");
                        };
                    })(idx));
                    break;
                case Helper.GDI.RecordType.META_DELETEOBJECT:
                    var idx = reader.readUint16();
                    this._records.push((function (idx) {
                        return function (gdi) {
                            gdi.deleteObject(idx);
                        };
                    })(idx));
                    break;
                case Helper.GDI.RecordType.META_RECTANGLE:
                    var rect = new Rect(reader);
                    this._records.push((function (rect) {
                        return function (gdi) {
                            gdi.rectangle(rect, 0, 0);
                        };
                    })(rect));
                    break;
                case Helper.GDI.RecordType.META_ROUNDRECT:
                    var rh = reader.readInt16();
                    var rw = reader.readInt16();
                    var rect = new Rect(reader);
                    this._records.push((function (rh, rw, rect) {
                        return function (gdi) {
                            gdi.rectangle(rect, rw, rh);
                        };
                    })(rh, rw, rect));
                    break;
                case Helper.GDI.RecordType.META_LINETO:
                    var y = reader.readInt16();
                    var x = reader.readInt16();
                    this._records.push((function (y, x) {
                        return function (gdi) {
                            gdi.lineTo(x, y);
                        };
                    })(y, x));
                    break;
                case Helper.GDI.RecordType.META_MOVETO:
                    var y = reader.readInt16();
                    var x = reader.readInt16();
                    this._records.push((function (y, x) {
                        return function (gdi) {
                            gdi.moveTo(x, y);
                        };
                    })(y, x));
                    break;
                case Helper.GDI.RecordType.META_TEXTOUT:
                    var len = reader.readInt16();
                    if (len > 0) {
                        var text = reader.readString(len);
                        reader.skip(len % 2);
                        var y = reader.readInt16();
                        var x = reader.readInt16();
                        this._records.push((function (text, y, x) {
                            return function (gdi) {
                                gdi.textOut(x, y, text);
                            };
                        })(text, y, x));
                    }
                    break;
                case Helper.GDI.RecordType.META_EXTTEXTOUT:
                    var y = reader.readInt16();
                    var x = reader.readInt16();
                    var len = reader.readInt16();
                    var fwOpts = reader.readUint16();
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
                    var rect = hasRect ? new Rect(reader) : null;
                    if (len > 0) {
                        var text = reader.readString(len);
                        reader.skip(len % 2);
                        var dx = [];
                        if (hasDx) {
                            for (var i = 0; i < text.length; i++) {
                                dx.push(reader.readInt16());
                            }
                        }
                        this._records.push((function (x, y, text, fwOpts, rect, dx) {
                            return function (gdi) {
                                gdi.extTextOut(x, y, text, fwOpts, rect, dx);
                            };
                        })(x, y, text, fwOpts, rect, dx));
                    }
                    break;
                case Helper.GDI.RecordType.META_EXCLUDECLIPRECT:
                    var rect = new Rect(reader);
                    this._records.push((function (rect) {
                        return function (gdi) {
                            gdi.excludeClipRect(rect);
                        };
                    })(rect));
                    break;
                case Helper.GDI.RecordType.META_INTERSECTCLIPRECT:
                    var rect = new Rect(reader);
                    this._records.push((function (rect) {
                        return function (gdi) {
                            gdi.intersectClipRect(rect);
                        };
                    })(rect));
                    break;
                case Helper.GDI.RecordType.META_POLYGON:
                    var cnt = reader.readInt16();
                    var points = [];
                    while (cnt > 0) {
                        points.push(new PointS(reader));
                        cnt--;
                    }
                    this._records.push((function (points) {
                        return function (gdi) {
                            gdi.polygon(points, true);
                        };
                    })(points));
                    break;
                case Helper.GDI.RecordType.META_SETPOLYFILLMODE:
                    var polyfillmode = reader.readUint16();
                    this._records.push((function (polyfillmode) {
                        return function (gdi) {
                            gdi.setPolyFillMode(polyfillmode);
                        };
                    })(polyfillmode));
                    break;
                case Helper.GDI.RecordType.META_POLYPOLYGON:
                    var cnt = reader.readUint16();
                    var polygonsPtCnts = [];
                    for (var i = 0; i < cnt; i++)
                        polygonsPtCnts.push(reader.readUint16());
                    var polygons = [];
                    for (var i = 0; i < cnt; i++) {
                        var ptCnt = polygonsPtCnts[i];
                        var p = [];
                        for (var ip = 0; ip < ptCnt; ip++)
                            p.push(new PointS(reader));
                        polygons.push(p);
                    }
                    this._records.push((function (polygons) {
                        return function (gdi) {
                            gdi.polyPolygon(polygons);
                        };
                    })(polygons));
                    break;
                case Helper.GDI.RecordType.META_POLYLINE:
                    var cnt = reader.readInt16();
                    var points = [];
                    while (cnt > 0) {
                        points.push(new PointS(reader));
                        cnt--;
                    }
                    this._records.push((function (points) {
                        return function (gdi) {
                            gdi.polyline(points);
                        };
                    })(points));
                    break;
                case Helper.GDI.RecordType.META_ELLIPSE:
                    var rect = new Rect(reader);
                    this._records.push((function (rect) {
                        return function (gdi) {
                            gdi.ellipse(rect);
                        };
                    })(rect));
                    break;
                case Helper.GDI.RecordType.META_CREATEPALETTE:
                    var palette = new Palette(reader);
                    this._records.push((function (palette) {
                        return function (gdi) {
                            gdi.createPalette(palette);
                        };
                    })(palette));
                    break;
                case Helper.GDI.RecordType.META_CREATEREGION:
                    var region = new Region(reader);
                    this._records.push((function (region) {
                        return function (gdi) {
                            gdi.createRegion(region);
                        };
                    })(region));
                    break;
                case Helper.GDI.RecordType.META_CREATEPATTERNBRUSH:
                    var datalength = size * 2 - (reader.pos - curpos);
                    var patternBitmap = new PatternBitmap16(reader, datalength);
                    var brush = new Brush(reader, datalength, patternBitmap);
                    this._records.push((function (brush) {
                        return function (gdi) {
                            gdi.createPatternBrush(brush);
                        };
                    })(brush));
                    break;
                case Helper.GDI.RecordType.META_OFFSETCLIPRGN:
                    var offY = reader.readInt16();
                    var offX = reader.readInt16();
                    this._records.push((function (offY, offX) {
                        return function (gdi) {
                            gdi.offsetClipRgn(offX, offY);
                        };
                    })(offY, offX));
                    break;
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
                default:
                    var recordName = "UNKNOWN";
                    for (var name in Helper.GDI.RecordType) {
                        if (Helper.GDI.RecordType[name] == type) {
                            recordName = name;
                            break;
                        }
                    }
                    Helper.log("[WMF] " + recordName + " record (0x" + type.toString(16) + ") at offset 0x" + curpos.toString(16) + " with " + (size * 2) + " bytes");
                    //throw new WMFJSError("Record type not recognized: 0x" + type.toString(16));
                    break;
            }
            curpos += size * 2;
        }
        if (!all)
            throw new WMFJSError("Could not read all records");
    }
    WMFRecords.prototype.play = function (gdi) {
        var len = this._records.length;
        for (var i = 0; i < len; i++) {
            this._records[i].call(this, gdi);
        }
    };
    ;
    return WMFRecords;
}());
export { WMFRecords };
;
