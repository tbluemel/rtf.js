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
import { Obj, Rect } from './Primitives';
import { Blob } from './Blob';

export class Region extends Obj{
    bounds: Rect;
    scans: Scan[];
    complexity: number;

    constructor(reader: Blob, copy?: Region) {
        super("region");
        if (reader != null) {
            reader.skip(2);
            if (reader.readInt16() != 6)
                throw new WMFJSError("Invalid region identifier");
            reader.skip(2);
            var rgnSize = reader.readInt16();
            var scanCnt = reader.readInt16();
            reader.skip(2);
            // note, Rect in reverse, can't use Rect(reader) directly
            var left = reader.readInt16();
            var top = reader.readInt16();
            var right = reader.readInt16();
            var bottom = reader.readInt16();
            this.bounds = new Rect(null, left, top, right, bottom);
            this.scans = [];
            for (var i = 0; i < scanCnt; i++)
                this.scans.push(new Scan(reader));
            this._updateComplexity();
        } else if (copy != null) {
            this.bounds = copy.bounds != null ? copy.bounds.clone() : null;
            if (copy.scans != null) {
                this.scans = [];
                for (var i = 0; i < copy.scans.length; i++)
                    this.scans.push(copy.scans[i].clone());
            } else {
                this.scans = null;
            }
            this.complexity = copy.complexity;
        } else {
            this.bounds = null;
            this.scans = null;
            this.complexity = 0;
        }
    }

    clone() {
        return new Region(null, this);
    };

    toString() {
        var _complexity = ["null", "simple", "complex"];
        return "{complexity: " + _complexity[this.complexity] + " bounds: " + (this.bounds != null ? this.bounds.toString() : "[none]") + " #scans: " + (this.scans != null ? this.scans.length : "[none]") + "}";
    };

    _updateComplexity() {
        if (this.bounds == null) {
            this.complexity = 0;
            this.scans = null;
        } else if (this.bounds.empty()) {
            this.complexity = 0;
            this.scans = null;
            this.bounds = null;
        } else if (this.scans == null) {
            this.complexity = 1;
        } else {
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

    subtract(rect: Rect) {
        Helper.log("[wmf] Region " + this.toString() + " subtract " + rect.toString());

        if (this.bounds != null) {
            var isect = this.bounds.intersect(rect);
            if (isect != null) { // Only need to do anything if there is any chance of an overlap
                if (this.scans == null) {
                    // We currently have a simple region and there is some kind of an overlap.
                    // We need to create scanlines now.  Simplest method is to fake one scan line
                    // that equals the simple region and re-use the same logic as for complex regions
                    this.scans = [];
                    this.scans.push( new Scan(null, null, this.bounds.top, this.bounds.bottom,
                        [{left: this.bounds.left, right: this.bounds.right}]));
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
                        } else {
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
                    if (scan.top > rect.bottom)
                        break;
                    if (scan.bottom > rect.bottom) {
                        // We need to clone this scan into two so that we can subtract from the first one
                        var cloned = scan.clone();
                        scan.bottom = rect.bottom;
                        cloned.top = rect.bottom + 1;
                        if (scan.top >= scan.bottom) {
                            this.scans[si] = cloned;
                        } else {
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
                    var left, top, right, bottom;
                    var len = this.scans.length;
                    for (var i = 0; i < len; i++) {
                        var scan = this.scans[i];
                        if (i == 0)
                            top = scan.top;
                        if (i == len - 1)
                            bottom = scan.bottom;

                        var slen = scan.scanlines.length;
                        if (slen > 0) {
                            var scanline = scan.scanlines[0];
                            if (left == null || scanline.left < left)
                                left = scanline.left;
                            scanline = scan.scanlines[slen - 1];
                            if (right == null || scanline.right > right)
                                right = scanline.right;
                        }
                    }

                    if (left != null && top != null && right != null && bottom != null) {
                        this.bounds = new Rect(null, left, top, right, bottom);
                        this._updateComplexity();
                    } else {
                        // This has to be a null region now
                        this.bounds = null;
                        this.scans = null;
                        this.complexity = 0;
                    }
                } else {
                    this._updateComplexity();
                }
            }
        }

        Helper.log("[wmf] Region subtraction -> " + this.toString());
    };

    intersect(rect: Rect) {
        Helper.log("[wmf] Region " + this.toString() + " intersect with " + rect.toString());
        if (this.bounds != null) {
            this.bounds = this.bounds.intersect(rect);
            if (this.bounds != null) {
                if (this.scans != null) {
                    var si = 0;
                    // Remove any scans that are entirely above the new bounds.top
                    while (si < this.scans.length) {
                        var scan = this.scans[si];
                        if (scan.bottom < this.bounds.top)
                            si++;
                        else
                            break;
                    }
                    if (si > 0) {
                        Helper.log("[wmf] Region remove " + si + " scans from top");
                        this.scans.splice(0, si);

                        // Adjust the first scan's top to match the new bounds.top
                        if (this.scans.length > 0)
                            this.scans[0].top = this.bounds.top;
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
                    if (this.scans.length > 0)
                        this.scans[this.scans.length - 1].bottom = this.bounds.bottom;

                    this._updateComplexity();
                }
            } else {
                this.scans = null;
                this.complexity = 0;
            }
        }
        Helper.log("[wmf] Region intersection -> " + this.toString());
    };

    offset(offX: number, offY: number) {
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
};

export function CreateSimpleRegion (left: number, top: number, right: number, bottom: number) {
    var rgn = new Region(null, null);
    rgn.bounds = new Rect(null, left, top, right, bottom);
    rgn._updateComplexity();
    return rgn;
};


export class Scan {
    top: number;
    bottom: number;
    scanlines: {left: number, right: number}[];

    constructor(reader: Blob, copy?: Scan, top?: number, bottom?: number, scanlines?: {left: number, right: number}[]) {
        if (reader != null) {
            var cnt = reader.readUint16();
            this.top = reader.readUint16();
            this.bottom = reader.readUint16();
            this.scanlines = [];
            for (var i = 0; i < cnt; i++) {
                var left = reader.readUint16();
                var right = reader.readUint16();
                this.scanlines.push({left: left, right: right});
            }
            reader.skip(2);
        } else if (copy != null) {
            this.top = copy.top;
            this.bottom = copy.bottom;
            this.scanlines = [];
            for (var i = 0; i < copy.scanlines.length; i++) {
                var scanline = copy.scanlines[i];
                this.scanlines.push({left: scanline.left, right: scanline.right});
            }
        } else {
            this.top = top;
            this.bottom = bottom;
            this.scanlines = scanlines;
        }
    }

    clone() {
        return new Scan(null, this);
    };

    subtract(left: number, right: number) {
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
            } else {
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
                if (scanline.left >= scanline.right)
                    cnt++;
                break;
            }
            i++;
        }

        // Delete everything we're subtracting
        if (cnt > 0 && first < this.scanlines.length)
            this.scanlines.splice(first, cnt);

        return this.scanlines.length > 0;
    };

    intersect(left: number, right: number) {
        // Get rid of anything that falls entirely outside to the left
        for (var i = 0; i < this.scanlines.length; i++) {
            var scanline = this.scanlines[i];
            if (scanline.left >= left || scanline.right >= left) {
                if (i > 0)
                    this.scanlines.splice(0, i);
                break;
            }
        }

        if (this.scanlines.length > 0) {
            // Adjust the first to match the left, if needed
            var scanline = this.scanlines[0];
            if (scanline.left < left)
                scanline.left = left;

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
                if (scanline.right > right)
                    scanline.right = right;
            }
        }
        return this.scanlines.length > 0;
    };

    toString() {
        return "{ #scanlines: " + this.scanlines.length + "}";
    };
};
