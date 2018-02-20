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
import { CreateSimpleRegion } from './Region';
import { Brush, ColorRef, Font, Pen } from './Style';
import { PointS } from './Primitives';

export class GDIContextState {
    _svggroup;
    _svgclipChanged;
    _svgtextbkfilter;
    mapmode;
    stretchmode;
    textalign;
    bkmode;
    textcolor;
    bkcolor;
    polyfillmode;
    wx;
    wy;
    ww;
    wh;
    vx;
    vy;
    vw;
    vh;
    x;
    y;
    clip;
    ownclip;
    selected;

    constructor(copy, defObjects?) {
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
            for (var type in copy.selected)
                this.selected[type] = copy.selected[type];
        } else {
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
}

export class GDIContext {
    _svg;
    _svgdefs;
    _svgPatterns;
    _svgClipPaths;
    defObjects;
    state;
    statestack;
    objects;

    constructor(svg) {
        this._svg = svg;
        this._svgdefs = null;
        this._svgPatterns = {};
        this._svgClipPaths = {};

        this.defObjects = {
            brush: new Brush(null, Helper.GDI.BrushStyle.BS_SOLID, new ColorRef(null, 0, 0, 0)),
            pen: new Pen(null, Helper.GDI.PenStyle.PS_SOLID, new PointS(null, 1, 1), new ColorRef(null, 0, 0, 0), 0, 0),
            font: new Font(null, null),
            palette: null,
            region: null
        };

        this.state = new GDIContextState(null, this.defObjects);
        this.statestack = [this.state];
        this.objects = {};
    }

    _pushGroup() {
        if (this.state._svggroup == null || this.state._svgclipChanged) {
            this.state._svgclipChanged = false;
            this.state._svgtextbkfilter = null;

            var settings = {
                viewBox: [this.state.vx, this.state.vy, this.state.vw, this.state.vh].join(" "),
                preserveAspectRatio: "none"
            };
            if (this.state.clip != null) {
                Helper.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " with clipping");
                settings["clip-path"] = "url(#" + this._getSvgClipPathForRegion(this.state.clip) + ")";
            }
            else
                Helper.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " without clipping");
            this.state._svggroup = this._svg.svg(this.state._svggroup,
                this.state.vx, this.state.vy, this.state.vw, this.state.vh, settings);
        }
    };

    _storeObject(obj) {
        var i = 0;
        while (this.objects[i.toString()] != null && i <= 65535)
            i++;
        if (i > 65535) {
            Helper.log("[gdi] Too many objects!");
            return -1;
        }

        this.objects[i.toString()] = obj;
        return i;
    };

    _getObject(objIdx) {
        var obj = this.objects[objIdx.toString()];
        if (obj == null)
            Helper.log("[gdi] No object with handle " + objIdx);
        return obj;
    };

    _getSvgDef() {
        if (this._svgdefs == null)
            this._svgdefs = this._svg.defs();
        return this._svgdefs;
    };


    _getSvgClipPathForRegion(region) {
        for (var id in this._svgClipPaths) {
            var rgn = this._svgClipPaths[id];
            if (rgn == region)
                return id;
        }

        var id = Helper._makeUniqueId("c");
        var sclip = this._svg.clipPath(this._getSvgDef(), id, "userSpaceOnUse");
        switch (region.complexity) {
            case 1:
                this._svg.rect(sclip, this._todevX(region.bounds.left), this._todevY(region.bounds.top),
                    this._todevW(region.bounds.right - region.bounds.left), this._todevH(region.bounds.bottom - region.bounds.top),
                    { fill: 'black', strokeWidth: 0 });
                break;
            case 2:
                for (var i = 0; i < region.scans.length; i++) {
                    var scan = region.scans[i];
                    for (var j = 0; j < scan.scanlines.length; j++) {
                        var scanline = scan.scanlines[j];
                        this._svg.rect(sclip, this._todevX(scanline.left), this._todevY(scan.top),
                            this._todevW(scanline.right - scanline.left), this._todevH(scan.bottom - scan.top),
                            { fill: 'black', strokeWidth: 0 });
                    }
                }
                break;
        };
        this._svgClipPaths[id] = region;
        return id;
    };

    _getSvgPatternForBrush(brush) {
        for (var id in this._svgPatterns) {
            var pat = this._svgPatterns[id];
            if (pat == brush)
                return id;
        }

        var width, height, img;
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
        var spat = this._svg.pattern(this._getSvgDef(), id, 0, 0, width, height, {patternUnits: 'userSpaceOnUse'});
        this._svg.image(spat, 0, 0, width, height, img);
        this._svgPatterns[id] = brush;
        return id;
    };

    _selectObject(obj) {
        this.state.selected[obj.type] = obj;
        if (obj.type == "region")
            this.state._svgclipChanged = true;
    };

    _deleteObject(objIdx) {
        var obj = this.objects[objIdx.toString()];
        if (obj != null) {
            for (var i = 0; i < this.statestack.length; i++) {
                var state = this.statestack[i];
                if (state.selected[obj.type] == obj)
                    state.selected[obj.type] = this.defObjects[obj.type].clone();
            }
            delete this.objects[objIdx.toString()];
            return true;
        }

        Helper.log("[gdi] Cannot delete object with invalid handle " + objIdx);
        return false;
    };

    _getClipRgn() {
        if (this.state.clip != null) {
            if (!this.state.ownclip)
                this.state.clip = this.state.clip.clone();
        } else {
            if (this.state.selected.region != null)
                this.state.clip = this.state.selected.region.clone();
            else
                this.state.clip = CreateSimpleRegion(this.state.wx, this.state.wy, this.state.wx + this.state.ww, this.state.wy + this.state.wh);
        }
        this.state.ownclip = true;
        return this.state.clip;
    };

    _todevX(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.wx) * (this.state.vw / this.state.ww)) + this.state.vx;
    };

    _todevY(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.wy) * (this.state.vh / this.state.wh)) + this.state.vy;
    };

    _todevW(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val * (this.state.vw / this.state.ww)) + this.state.vx;
    };

    _todevH(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val * (this.state.vh / this.state.wh)) + this.state.vy;
    };

    _tologicalX(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.vx) / (this.state.vw / this.state.ww)) + this.state.wx;
    };

    _tologicalY(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor((val - this.state.vy) / (this.state.vh / this.state.wh)) + this.state.wy;
    };

    _tologicalW(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val / (this.state.vw / this.state.ww)) + this.state.wx;
    };

    _tologicalH(val) {
        // http://wvware.sourceforge.net/caolan/mapmode.html
        // logical -> device
        return Math.floor(val / (this.state.vh / this.state.wh)) + this.state.wy;
    };

    setMapMode(mode) {
        Helper.log("[gdi] setMapMode: mode=" + mode);
        this.state.mapmode = mode;
        this.state._svggroup = null;
    };

    setWindowOrg(x, y) {
        Helper.log("[gdi] setWindowOrg: x=" + x + " y=" + y);
        this.state.wx = x;
        this.state.wy = y;
        this.state._svggroup = null;
    };

    setWindowExt(x, y) {
        Helper.log("[gdi] setWindowExt: x=" + x + " y=" + y);
        this.state.ww = x;
        this.state.wh = y;
        this.state._svggroup = null;
    };

    offsetWindowOrg(offX, offY) {
        Helper.log("[gdi] offsetWindowOrg: offX=" + offX + " offY=" + offY);
        this.state.wx += offX;
        this.state.wy += offY;
        this.state._svggroup = null;
    };

    setViewportOrg(x, y) {
        Helper.log("[gdi] setViewportOrg: x=" + x + " y=" + y);
        this.state.vx = x;
        this.state.vy = y;
        this.state._svggroup = null;
    };

    setViewportExt(x, y) {
        Helper.log("[gdi] setViewportExt: x=" + x + " y=" + y);
        this.state.vw = x;
        this.state.vh = y;
        this.state._svggroup = null;
    };

    offsetViewportOrg(offX, offY) {
        Helper.log("[gdi] offsetViewportOrg: offX=" + offX + " offY=" + offY);
        this.state.vx += offX;
        this.state.vy += offY;
        this.state._svggroup = null;
    };

    saveDC() {
        Helper.log("[gdi] saveDC");
        var prevstate = this.state;
        this.state = new GDIContextState(this.state);
        this.statestack.push(prevstate);
        this.state._svggroup = null;
    };

    restoreDC(saved) {
        Helper.log("[gdi] restoreDC: saved=" + saved);
        if (this.statestack.length > 1) {
            if (saved == -1) {
                this.state = this.statestack.pop();
            } else if (saved < -1) {
                throw new WMFJSError("restoreDC: relative restore not implemented");
            } else if (saved > 1) {
                throw new WMFJSError("restoreDC: absolute restore not implemented");
            }
        } else {
            throw new WMFJSError("No saved contexts");
        }

        this.state._svggroup = null;
    };

    escape(func, blob, offset, count) {
        Helper.log("[gdi] escape: func=" + func + " offset=" + offset + " count=" + count);
    };

    setStretchBltMode(stretchMode) {
        Helper.log("[gdi] setStretchBltMode: stretchMode=" + stretchMode);
    };

    stretchDib(srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, rasterOp, colorUsage, dib) {
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

    stretchDibBits(srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, rasterOp, dib) {
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

    _applyOpts(opts, usePen, useBrush, useFont) {
        if (opts == null)
            opts = {};
        if (usePen) {
            var pen = this.state.selected.pen;
            if (pen.style != Helper.GDI.PenStyle.PS_NULL) {
                opts.stroke =  "#" + pen.color.toHex(), // TODO: pen style
                    opts.strokeWidth = this._todevW(pen.width.x) // TODO: is .y ever used?

                var dotWidth;
                if ((pen.linecap & Helper.GDI.PenStyle.PS_ENDCAP_SQUARE) != 0) {
                    opts["stroke-linecap"] = "square";
                    dotWidth = 1;
                } else if ((pen.linecap & Helper.GDI.PenStyle.PS_ENDCAP_FLAT) != 0) {
                    opts["stroke-linecap"] = "butt";
                    dotWidth = opts.strokeWidth;
                } else {
                    opts["stroke-linecap"] = "round";
                    dotWidth = 1;
                }

                if ((pen.join & Helper.GDI.PenStyle.PS_JOIN_BEVEL) != 0)
                    opts["stroke-linejoin"] = "bevel";
                else if ((pen.join & Helper.GDI.PenStyle.PS_JOIN_MITER) != 0)
                    opts["stroke-linejoin"] = "miter";
                else
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
            opts["font-size"] = this._todevH(Math.abs(font.height));
            opts["fill"] = "#" + this.state.textcolor.toHex();
        }
        return opts;
    };

    rectangle(rect, rw, rh) {
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

    textOut(x, y, text) {
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

    extTextOut(x, y, text, fwOpts, rect, dx) {
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

    lineTo(x, y) {
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
    }

    moveTo(x, y) {
        Helper.log("[gdi] moveTo: x=" + x + " y=" + y);
        this.state.x = x;
        this.state.y = y;
    }

    polygon(points, first) {
        Helper.log("[gdi] polygon: points=" + points + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        Helper.log("[gdi] polygon: TRANSLATED: pts=" + pts);
        if (first)
            this._pushGroup();
        var opts = {
            "fill-rule": this.state.polyfillmode == Helper.GDI.PolyFillMode.ALTERNATE ? "evenodd" : "nonzero",
        };
        this._applyOpts(opts, true, true, false);
        this._svg.polygon(this.state._svggroup, pts, opts);
    };

    polyPolygon(polygons) {
        Helper.log("[gdi] polyPolygon: polygons.length=" + polygons.length + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());

        var cnt = polygons.length;
        for (var i = 0; i < cnt; i++)
            this.polygon(polygons[i], i == 0);
    };

    polyline(points) {
        Helper.log("[gdi] polyline: points=" + points + " with pen " + this.state.selected.pen.toString());
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            pts.push([this._todevX(point.x), this._todevY(point.y)]);
        }
        Helper.log("[gdi] polyline: TRANSLATED: pts=" + pts);
        this._pushGroup();
        var opts = this._applyOpts({fill: "none"}, true, false, false);
        this._svg.polyline(this.state._svggroup, pts, opts);
    };

    ellipse(rect) {
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

    excludeClipRect(rect) {
        Helper.log("[gdi] excludeClipRect: rect=" + rect.toString());
        this._getClipRgn().subtract(rect);
    };

    intersectClipRect(rect) {
        Helper.log("[gdi] intersectClipRect: rect=" + rect.toString());
        this._getClipRgn().intersect(rect);
    };

    offsetClipRgn(offX, offY) {
        Helper.log("[gdi] offsetClipRgn: offX=" + offX + " offY=" + offY);
        this._getClipRgn().offset(offX, offY);
    };

    setTextAlign(textAlignmentMode) {
        Helper.log("[gdi] setTextAlign: textAlignmentMode=0x" + textAlignmentMode.toString(16));
        this.state.textalign = textAlignmentMode;
    };

    setBkMode(bkMode) {
        Helper.log("[gdi] setBkMode: bkMode=0x" + bkMode.toString(16));
        this.state.bkmode = bkMode;
    };

    setTextColor(textColor) {
        Helper.log("[gdi] setTextColor: textColor=" + textColor.toString());
        this.state.textcolor = textColor;
    };

    setBkColor(bkColor) {
        Helper.log("[gdi] setBkColor: bkColor=" + bkColor.toString());
        this.state.bkcolor = bkColor;
        this.state._svgtextbkfilter = null;
    };

    setPolyFillMode(polyFillMode) {
        Helper.log("[gdi] setPolyFillMode: polyFillMode=" + polyFillMode);
        this.state.polyfillmode = polyFillMode;
    };

    createBrush(brush) {
        var idx = this._storeObject(brush);
        Helper.log("[gdi] createBrush: brush=" + brush.toString() + " with handle " + idx);
    };

    createFont(font) {
        var idx = this._storeObject(font);
        Helper.log("[gdi] createFont: font=" + font.toString() + " with handle " + idx);
    };

    createPen(pen) {
        var idx = this._storeObject(pen);
        Helper.log("[gdi] createPen: pen=" + pen.toString() + " width handle " + idx);
    };

    createPalette(palette) {
        var idx = this._storeObject(palette);
        Helper.log("[gdi] createPalette: palette=" + palette.toString() + " width handle " + idx);
    };

    createRegion(region) {
        var idx = this._storeObject(region);
        Helper.log("[gdi] createRegion: region=" + region.toString() + " width handle " + idx);
    };

    createPatternBrush(patternBrush) {
        var idx = this._storeObject(patternBrush);
        Helper.log("[gdi] createRegion: region=" + patternBrush.toString() + " width handle " + idx);
    };

    selectObject(objIdx, checkType) {
        var obj = this._getObject(objIdx);
        if (obj != null && (checkType == null || obj.type == checkType)) {
            this._selectObject(obj);
            Helper.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " selected " + obj.type + ": " + obj.toString() : "[invalid index]"));
        } else {
            Helper.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " invalid object type: " + obj.type : "[invalid index]"));
        }
    };

    deleteObject(objIdx) {
        var ret = this._deleteObject(objIdx);
        Helper.log("[gdi] deleteObject: objIdx=" + objIdx + (ret ? " deleted object" : "[invalid index]"));
    };
};
