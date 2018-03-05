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

import { Blob } from "./Blob";
import { EMFRecords } from "./EMFRecords";
import { GDIContext } from "./GDIContext";
import { EMFJSError, Helper } from "./Helper";

export class RendererSettings {
    width: string;
    height: string;
    wExt: number;
    hExt: number;
    xExt: number;
    yExt: number;
    mapMode: number;
}

export class Renderer {
    _img: EMF;

    constructor(blob: ArrayBuffer) {
        this.parse(blob);
        Helper.log("EMFJS.Renderer instantiated");
    }

    parse(blob: ArrayBuffer) {
        this._img = null;

        const reader = new Blob(blob);

        const type = reader.readUint32();
        if (type !== 0x00000001) {
            throw new EMFJSError("Not an EMF file");
        }
        const size = reader.readUint32();
        if (size % 4 != 0) {
            throw new EMFJSError("Not an EMF file");
        }

        this._img = new EMF(reader, size);

        if (this._img == null) {
            throw new EMFJSError("Format not recognized");
        }
    }

    _render(svg: any, mapMode: number, w: number, h: number, xExt: number, yExt: number) {
        const gdi = new GDIContext(svg);
        gdi.setWindowExtEx(w, h);
        gdi.setViewportExtEx(xExt, yExt);
        gdi.setMapMode(mapMode);
        Helper.log("[EMF] BEGIN RENDERING --->");
        this._img.render(gdi);
        Helper.log("[EMF] <--- DONE RENDERING");
    }

    render(info: RendererSettings) {
        const inst = this;
        const img = (function(mapMode, w, h, xExt, yExt) {
            return ($("<div>") as any).svg({
                onLoad(svg: any) {
                    return inst._render.call(inst, svg, mapMode, w, h, xExt, yExt);
                },
                settings: {
                    viewBox: [0, 0, xExt, yExt].join(" "),
                    preserveAspectRatio: "none", // TODO: MM_ISOTROPIC vs MM_ANISOTROPIC
                },
            });
        })(info.mapMode, info.wExt, info.hExt, info.xExt, info.yExt);
        const svg = ($(img[0]) as any).svg("get");
        return $(svg.root()).attr("width", info.width).attr("height", info.height);
    }
}

export class EMF {
    _reader: Blob;
    _hdrsize: number;
    _records: EMFRecords;

    constructor(reader: Blob, hdrsize: number) {
        this._reader = reader;
        this._hdrsize = hdrsize;
        this._records = new EMFRecords(reader, this._hdrsize);
    }

    render(gdi: GDIContext) {
        this._records.play(gdi);
    }
}
