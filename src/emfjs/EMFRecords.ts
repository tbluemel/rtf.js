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

import { Helper, EMFJSError } from './Helper';
import { Brush, ColorRef, Pen } from './Style';
import { PointS, PointL, RectL, SizeL } from './Primitives';
import { Region } from './Region';

export class EmfHeader {
    size;
    bounds;
    frame;
    nPalEntries;
    refDevCx;
    refDevCy;
    refDevCxMm;
    refDevCyMm;
    description;
    displayDevCxUm;
    displayDevCyUm;

    constructor(reader, headerSize) {
        var recordStart = reader.pos - 8;

        this.size = headerSize;
        this.bounds = new RectL(reader);
        this.frame = new RectL(reader);
        if (reader.readUint32() != Helper.GDI.FormatSignature.ENHMETA_SIGNATURE)
            throw new EMFJSError("Invalid header signature");
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
            if (descriptionOff < 88)
                throw new EMFJSError("Invalid header description offset");

            hdrSize = descriptionOff + (descriptionLen * 2);
            if (hdrSize > headerSize)
                throw new EMFJSError("Invalid header description length");

            var prevPos = reader.pos;
            reader.seek(recordStart + descriptionOff);
            this.description = reader.readFixedSizeUnicodeString(descriptionLen);
            reader.seek(prevPos);
        } else {
            this.description = "";
        }

        if (hdrSize >= 100) {
            // We have a EmfMetafileHeaderExtension1 record
            var pixelFormatSize = reader.readUint32();
            var pixelFormatOff = reader.readUint32();
            var haveOpenGl = reader.readUint32();
            if (haveOpenGl != 0)
                throw new EMFJSError("OpenGL records are not yet supported");

            if (pixelFormatOff != 0) {
                if (pixelFormatOff < 100 || pixelFormatOff < hdrSize)
                    throw new EMFJSError("Invalid pixel format offset");

                hdrSize = pixelFormatOff + pixelFormatSize;
                if (hdrSize > headerSize)
                    throw new EMFJSError("Invalid pixel format size");

                // TODO: read pixel format blob
            }

            if (hdrSize >= 108) {
                // We have a EmfMetafileHeaderExtension2 record
                this.displayDevCxUm = reader.readUint32(); // in micrometers
                this.displayDevCyUm = reader.readUint32(); // in micrometers
            }
        }
    }

    toString() {
        return "{bounds: " + this.bounds.toString() + ", frame: " + this.frame.toString() + ", description: " + this.description + "}";
    }
}

export class EMFRecords {
    _records;
    _header;

    constructor(reader, first) {
        this._records = [];

        this._header = new EmfHeader(reader, first);

        var all = false;
        var curpos = first;
        main_loop: while (!all) {
            reader.seek(curpos);
            var type = reader.readUint32();
            var size = reader.readUint32();
            if (size < 8)
                throw new EMFJSError("Invalid record size");
            switch (type) {
                case Helper.GDI.RecordType.EMR_EOF:
                    all = true;
                    break main_loop;
                case Helper.GDI.RecordType.EMR_SETMAPMODE:
                    var mapMode = reader.readInt32();
                    this._records.push(
                        (function (mapMode) {
                            return function (gdi) {
                                gdi.setMapMode(mapMode);
                            }
                        })(mapMode)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETWINDOWORGEX:
                    var x = reader.readInt32();
                    var y = reader.readInt32();
                    this._records.push(
                        (function (y, x) {
                            return function (gdi) {
                                gdi.setWindowOrgEx(x, y);
                            }
                        })(y, x)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETWINDOWEXTEX:
                    var x = reader.readUint32();
                    var y = reader.readUint32();
                    this._records.push(
                        (function (y, x) {
                            return function (gdi) {
                                gdi.setWindowExtEx(x, y);
                            }
                        })(y, x)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETVIEWPORTORGEX:
                    var x = reader.readInt32();
                    var y = reader.readInt32();
                    this._records.push(
                        (function (y, x) {
                            return function (gdi) {
                                gdi.setViewportOrgEx(x, y);
                            }
                        })(y, x)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETVIEWPORTEXTEX:
                    var x = reader.readUint32();
                    var y = reader.readUint32();
                    this._records.push(
                        (function (y, x) {
                            return function (gdi) {
                                gdi.setViewportExtEx(x, y);
                            }
                        })(y, x)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SAVEDC:
                    this._records.push(function (gdi) {
                        gdi.saveDC();
                    });
                    break;
                case Helper.GDI.RecordType.EMR_RESTOREDC:
                    var saved = reader.readInt32();
                    this._records.push(
                        (function (saved) {
                            return function (gdi) {
                                gdi.restoreDC(saved);
                            }
                        })(saved)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETBKMODE:
                    var bkMode = reader.readUint32();
                    this._records.push(
                        (function (bkMode) {
                            return function (gdi) {
                                gdi.setBkMode(bkMode);
                            }
                        })(bkMode)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETBKCOLOR:
                    var bkColor = new ColorRef(reader);
                    this._records.push(
                        (function (bkColor) {
                            return function (gdi) {
                                gdi.setBkColor(bkColor);
                            }
                        })(bkColor)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_CREATEBRUSHINDIRECT:
                    var index = reader.readUint32();
                    var datalength = size - (reader.pos - curpos);
                    var brush = new Brush(reader, datalength);
                    this._records.push(
                        (function (index, brush) {
                            return function (gdi) {
                                gdi.createBrush(index, brush);
                            }
                        })(index, brush)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_CREATEPEN:
                    var index = reader.readUint32();
                    var pen = new Pen(reader, null);
                    this._records.push(
                        (function (index, pen) {
                            return function (gdi) {
                                gdi.createPen(index, pen);
                            }
                        })(index, pen)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_EXTCREATEPEN:
                    var index = reader.readUint32();
                    var offBmi = reader.readUint32();
                    var cbBmi = reader.readUint32();
                    var offBits = reader.readUint32();
                    var cbBits = reader.readUint32();
                    var pen = new Pen(reader, {
                        header: {
                            off: offBmi,
                            size: cbBmi
                        },
                        data: {
                            off: offBits,
                            size: cbBits
                        }
                    });
                    this._records.push(
                        (function (index, pen) {
                            return function (gdi) {
                                gdi.createPen(index, pen);
                            }
                        })(index, pen)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SELECTOBJECT:
                    var idx = reader.readUint32();
                    this._records.push(
                        (function (idx) {
                            return function (gdi) {
                                gdi.selectObject(idx, null);
                            }
                        })(idx)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_DELETEOBJECT:
                    var idx = reader.readUint32();
                    this._records.push(
                        (function (idx) {
                            return function (gdi) {
                                gdi.deleteObject(idx);
                            }
                        })(idx)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_RECTANGLE:
                    var rect = new RectL(reader);
                    this._records.push(
                        (function (rect) {
                            return function (gdi) {
                                gdi.rectangle(rect, 0, 0);
                            }
                        })(rect)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_ROUNDRECT:
                    var rect = new RectL(reader);
                    var corner = new SizeL(reader);
                    this._records.push(
                        (function (rect, corner) {
                            return function (gdi) {
                                gdi.rectangle(rect, corner.cx, corner.cy);
                            }
                        })(rect, corner)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_LINETO:
                    var x = reader.readInt32();
                    var y = reader.readInt32();
                    this._records.push(
                        (function (y, x) {
                            return function (gdi) {
                                gdi.lineTo(x, y);
                            }
                        })(y, x)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_MOVETOEX:
                    var x = reader.readInt32();
                    var y = reader.readInt32();
                    this._records.push(
                        (function (y, x) {
                            return function (gdi) {
                                gdi.moveToEx(x, y);
                            }
                        })(y, x)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_POLYGON:
                case Helper.GDI.RecordType.EMR_POLYGON16:
                    var isSmall = (type == Helper.GDI.RecordType.EMR_POLYGON16);
                    var bounds = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points = [];
                    while (cnt > 0) {
                        points.push(isSmall ? new PointS(reader) : new PointL(reader));
                        cnt--;
                    }
                    this._records.push(
                        (function (points) {
                            return function (gdi) {
                                gdi.polygon(points, bounds, true);
                            }
                        })(points)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_POLYPOLYGON:
                case Helper.GDI.RecordType.EMR_POLYPOLYGON16:
                    var isSmall = (type == Helper.GDI.RecordType.EMR_POLYPOLYGON16);
                    var bounds = new RectL(reader);
                    var polyCnt = reader.readUint32();
                    reader.skip(4); // count
                    var polygonsPtCnts = [];
                    for (var i = 0; i < cnt; i++)
                        polygonsPtCnts.push(reader.readUint32());

                    var polygons = [];
                    for (var i = 0; i < cnt; i++) {
                        var ptCnt = polygonsPtCnts[i];

                        var p = [];
                        for (var ip = 0; ip < ptCnt; ip++)
                            p.push(isSmall ? new PointS(reader) : new PointL(reader));
                        polygons.push(p);
                    }
                    this._records.push(
                        (function (points, bounds) {
                            return function (gdi) {
                                gdi.polyPolygon(points, bounds);
                            }
                        })(points, bounds)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETPOLYFILLMODE:
                    var polyfillmode = reader.readUint32();
                    this._records.push(
                        (function (polyfillmode) {
                            return function (gdi) {
                                gdi.setPolyFillMode(polyfillmode);
                            }
                        })(polyfillmode)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_POLYLINE16:
                case Helper.GDI.RecordType.EMR_POLYLINETO16:
                    var isLineTo = (type == Helper.GDI.RecordType.EMR_POLYLINETO16);
                    var bounds = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points = [];
                    while (cnt > 0) {
                        points.push(new PointS(reader));
                        cnt--;
                    }
                    this._records.push(
                        (function (isLineTo, points, bounds) {
                            return function (gdi) {
                                gdi.polyline(isLineTo, points, bounds);
                            }
                        })(isLineTo, points, bounds)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_POLYBEZIER:
                case Helper.GDI.RecordType.EMR_POLYBEZIERTO:
                    var isPolyBezierTo = (type == Helper.GDI.RecordType.EMR_POLYBEZIERTO);
                    var bounds = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points = [];
                    while (cnt > 0) {
                        points.push(new PointL(reader));
                        cnt--;
                    }
                    this._records.push(
                        (function (isPolyBezierTo, points, bounds) {
                            return function (gdi) {
                                gdi.polybezier(isPolyBezierTo, points, bounds);
                            }
                        })(isPolyBezierTo, points, bounds)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_POLYBEZIER16:
                    var bounds = new RectL(reader);
                    var start = new PointL(reader);
                    var cnt = reader.readUint32();
                    var points: any[] = [start];
                    while (cnt > 0) {
                        points.push(new PointS(reader));
                        cnt--;
                    }
                    this._records.push(
                        (function (points, bounds) {
                            return function (gdi) {
                                gdi.polybezier(false, points, bounds);
                            }
                        })(points, bounds)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_POLYBEZIERTO16:
                    var bounds = new RectL(reader);
                    var cnt = reader.readUint32();
                    var points = [];
                    while (cnt > 0) {
                        points.push(new PointS(reader));
                        cnt--;
                    }
                    this._records.push(
                        (function (points, bounds) {
                            return function (gdi) {
                                gdi.polybezier(true, points, bounds);
                            }
                        })(points, bounds)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETTEXTALIGN:
                    var textAlign = reader.readUint32();
                    this._records.push(
                        (function (textAlign) {
                            return function (gdi) {
                                gdi.setTextAlign(textAlign);
                            }
                        })(textAlign)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETSTRETCHBLTMODE:
                    var stretchMode = reader.readUint32();
                    this._records.push(
                        (function (stretchMode) {
                            return function (gdi) {
                                gdi.setStretchBltMode(stretchMode);
                            }
                        })(stretchMode)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETBRUSHORGEX:
                    var origin = new PointL(reader);
                    this._records.push(
                        (function (origin) {
                            return function (gdi) {
                                gdi.setBrushOrgEx(origin);
                            }
                        })(origin)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_BEGINPATH:
                    this._records.push(
                        (function () {
                            return function (gdi) {
                                gdi.beginPath();
                            }
                        })()
                    );
                    break;
                case Helper.GDI.RecordType.EMR_ENDPATH:
                    this._records.push(
                        (function () {
                            return function (gdi) {
                                gdi.endPath();
                            }
                        })()
                    );
                    break;
                case Helper.GDI.RecordType.EMR_ABORTPATH:
                    this._records.push(
                        (function () {
                            return function (gdi) {
                                gdi.abortPath();
                            }
                        })()
                    );
                    break;
                case Helper.GDI.RecordType.EMR_CLOSEFIGURE:
                    this._records.push(
                        (function () {
                            return function (gdi) {
                                gdi.closeFigure();
                            }
                        })()
                    );
                    break;
                case Helper.GDI.RecordType.EMR_FILLPATH:
                    var bounds = new RectL(reader);
                    this._records.push(
                        (function (bounds) {
                            return function (gdi) {
                                gdi.fillPath(bounds);
                            }
                        })(bounds)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_STROKEPATH:
                    var bounds = new RectL(reader);
                    this._records.push(
                        (function (bounds) {
                            return function (gdi) {
                                gdi.strokePath(bounds);
                            }
                        })(bounds)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SELECTCLIPPATH:
                    var rgnMode = reader.readUint32();
                    this._records.push(
                        (function (rgnMode) {
                            return function (gdi) {
                                gdi.selectClipPath(rgnMode);
                            }
                        })(rgnMode)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_EXTSELECTCLIPRGN:
                    reader.skip(4);
                    var rgnMode = reader.readUint32();
                    var region = rgnMode != Helper.GDI.RegionMode.RGN_COPY ? new Region(reader) : null;
                    this._records.push(
                        (function (rgnMode, region) {
                            return function (gdi) {
                                gdi.selectClipRgn(rgnMode, region);
                            }
                        })(rgnMode, region)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_OFFSETCLIPRGN:
                    var offset = new PointL(reader);
                    this._records.push(
                        (function (offset) {
                            return function (gdi) {
                                gdi.offsetClipRgn(offset);
                            }
                        })(offset)
                    );
                    break;
                case Helper.GDI.RecordType.EMR_SETMITERLIMIT:
                    var miterLimit = reader.readUint32();
                    this._records.push(
                        (function (miterLimit) {
                            return function (gdi) {
                                gdi.setMiterLimit(miterLimit);
                            }
                        })(miterLimit)
                    );
                    break;
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
                default:
                    var recordName = "UNKNOWN";
                    for (var name in Helper.GDI.RecordType) {
                        if (Helper.GDI.RecordType[name] == type) {
                            recordName = name;
                            break;
                        }
                    }
                    Helper.log("[EMF] " + recordName + " record (0x" + type.toString(16) + ") at offset 0x" + curpos.toString(16) + " with " + size + " bytes");
                    //throw new EMFJSError("Record type not recognized: 0x" + type.toString(16));
                    break;
            }

            curpos += size;
        }

        if (!all)
            throw new EMFJSError("Could not read all records");
    }

    play(gdi) {
        var len = this._records.length;
        for (var i = 0; i < len; i++) {
            this._records[i].call(this, gdi);
        }
    };
};
