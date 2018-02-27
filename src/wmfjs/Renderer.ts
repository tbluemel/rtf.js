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
import { GDIContext } from './GDIContext';
import { Blob } from './Blob';
import { WMFRecords } from './WMFRecords';

export class RendererSettings {
    width: string;
    height: string;
    xExt: number;
    yExt: number;
    mapMode: number;
}

export class Renderer {
    _img: WMF;

    constructor(blob: ArrayBuffer) {
        this.parse(blob);
        Helper.log("WMFJS.Renderer instantiated");
    }

    parse(blob: ArrayBuffer) {
        this._img = null;

        var reader = new Blob(blob);

        var type, size, placable, headerstart;
        var key = reader.readUint32();
        if (key == 0x9ac6cdd7) {
            placable = new WMFPlacable(reader);
            headerstart = reader.pos;
            type = reader.readUint16();
            size = reader.readUint16();
        } else {
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

        if (this._img == null)
            throw new WMFJSError("Format not recognized");
    };

    _render(svg: any, mapMode: number, xExt: number, yExt: number) {
        // See https://www-user.tu-chemnitz.de/~ygu/petzold/ch18b.htm
        var gdi = new GDIContext(svg);
        gdi.setViewportExt(xExt, yExt);
        gdi.setMapMode(mapMode);
        Helper.log("[WMF] BEGIN RENDERING --->");
        this._img.render(gdi);
        Helper.log("[WMF] <--- DONE RENDERING");
    };

    render(info: RendererSettings) {
        var inst = this;
        var img = (function(mapMode, xExt, yExt) {
            return (<any>$("<div>")).svg({
                onLoad: function(svg: any) {
                    return inst._render.call(inst, svg, mapMode, xExt, yExt);
                },
                settings: {
                    viewBox: [0, 0, xExt, yExt].join(" "),
                    preserveAspectRatio: "none" // TODO: MM_ISOTROPIC vs MM_ANISOTROPIC
                }
            });
        })(info.mapMode, info.xExt, info.yExt);
        var svg = (<any>$(img[0])).svg("get");
        return $(svg.root()).attr("width", info.width).attr("height", info.height);
    };
};

export class WMFRect16 {
    left: number;
    top: number;
    right: number;
    bottom: number;

    constructor(reader: Blob) {
        this.left = reader.readInt16();
        this.top = reader.readInt16();
        this.right = reader.readInt16();
        this.bottom = reader.readInt16();
    }

    toString() {
        return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
    };
};

export class WMFPlacable {
    boundingBox: WMFRect16;
    unitsPerInch: number;

    constructor(reader: Blob) {
        reader.skip(2);
        this.boundingBox = new WMFRect16(reader);
        this.unitsPerInch = reader.readInt16();
        reader.skip(4);
        reader.skip(2); // TODO: checksum
        Helper.log("Got bounding box " + this.boundingBox + " and " + this.unitsPerInch + " units/inch");
    }
};

export class WMF {
    _reader: Blob;
    _version: number;
    _hdrsize: number;
    _placable: WMFPlacable;
    _records: WMFRecords;

    constructor(reader: Blob, placable: WMFPlacable, version: number, hdrsize: number) {
        this._reader = reader;
        this._version = version;
        this._hdrsize = hdrsize;
        this._placable = placable;
        this._records = new WMFRecords(reader, this._hdrsize);
    }


    render(gdi: GDIContext) {
        this._records.play(gdi);
    };
};
