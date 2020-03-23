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

import * as EMFJS from "EMFJS";
import * as WMFJS from "WMFJS";
import { Document } from "../../Document";
import { Helper, RTFJSError } from "../../Helper";
import { Renderer } from "../../renderer/Renderer";
import { GlobalState } from "../Containers";
import { DestinationFactory, DestinationTextBase, findParentDestination, IDestination } from "./DestinationBase";

export interface IPictGroupDestination extends IDestination {
    isLegacy(): boolean;
}

export class PictGroupDestinationFactory extends DestinationFactory<IPictGroupDestination> {
    constructor(legacy: boolean) {
        super();
        this.class = class extends DestinationTextBase implements IPictGroupDestination {
            private _legacy: boolean;

            constructor() {
                super("pict-group");
                this._legacy = legacy;
            }

            public isLegacy() {
                return this._legacy;
            }
        };
    }
}

export class PictDestination extends DestinationTextBase {
    public _displaysize: { width: number, height: number };
    public _size: { width: number, height: number };
    private _type: string | (() => any);
    private _blob: ArrayBuffer;
    private parser: GlobalState;
    private inst: Document;
    [key: string]: any;

    private _pictHandlers: { [key: string]: (param: number) => void } = {
        picw: this._setPropValueRequired("_size", "width"),
        pich: this._setPropValueRequired("_size", "height"),
        picwgoal: this._setPropValueRequired("_displaysize", "width"),
        pichgoal: this._setPropValueRequired("_displaysize", "height"),
    };

    private _pictTypeHandler: { [key: string]
            : string | ((param?: number) => { load: () => any, render: (img: any) => Element }) } = {
        emfblip: (() => {
            if (typeof EMFJS !== "undefined") {
                return () => {
                    return {
                        load: () => {
                            try {
                                return new EMFJS.Renderer(this._blob);
                            } catch (e) {
                                if (e instanceof EMFJS.Error) {
                                    return e.message;
                                } else {
                                    throw e;
                                }
                            }
                        },
                        render: (img: EMFJS.Renderer) => {
                            return img.render({
                                width: Helper._twipsToPt(this._displaysize.width) + "pt",
                                height: Helper._twipsToPt(this._displaysize.height) + "pt",
                                wExt: this._size.width,
                                hExt: this._size.height,
                                xExt: this._size.width,
                                yExt: this._size.height,
                                mapMode: 8,
                            });
                        },
                    };
                };
            } else {
                return "";
            }
        })(),
        pngblip: "image/png",
        jpegblip: "image/jpeg",
        macpict: "", // TODO
        pmmetafile: "", // TODO
        wmetafile: (() => {
            if (typeof WMFJS !== "undefined") {
                return (param: number) => {
                    if (param == null || param < 0 || param > 8) {
                        throw new RTFJSError("Insufficient metafile information");
                    }
                    return {
                        load: () => {
                            try {
                                return new WMFJS.Renderer(this._blob);
                            } catch (e) {
                                if (e instanceof WMFJS.Error) {
                                    return e.message;
                                } else {
                                    throw e;
                                }
                            }
                        },
                        render: (img: WMFJS.Renderer) => {
                            return img.render({
                                width: Helper._twipsToPt(this._displaysize.width) + "pt",
                                height: Helper._twipsToPt(this._displaysize.height) + "pt",
                                xExt: this._size.width,
                                yExt: this._size.height,
                                mapMode: param,
                            });
                        },
                    };
                };
            } else {
                return "";
            }
        })(),
        dibitmap: "", // TODO
        wbitmap: "", // TODO
    };

    constructor(parser: GlobalState, inst: Document) {
        super("pict");
        this._type = null;
        this._blob = null;
        this._displaysize = {
            width: null,
            height: null,
        };
        this._size = {
            width: null,
            height: null,
        };
        this.parser = parser;
        this.inst = inst;
    }

    public handleKeyword(keyword: string, param: number) {
        const handler = this._pictHandlers[keyword];
        if (handler != null) {
            handler(param);
            return true;
        }
        const type = this._pictTypeHandler[keyword];
        if (type != null) {
            if (this._type == null) {
                if (typeof type === "function") {
                    const info = type(param);
                    if (info != null) {
                        this._type = () => {
                            const renderer = info.load();
                            if (renderer != null) {
                                if (typeof renderer === "string") {
                                    return renderer;
                                }
                                return () => {
                                    return info.render(renderer);
                                };
                            }
                        };
                    }
                } else {
                    this._type = type;
                }
            }
            return true;
        }
        return false;
    }

    public handleBlob(blob: ArrayBuffer) {
        this._blob = blob;
    }

    public apply(rendering = false) {
        if (this._type == null) {
            throw new RTFJSError("Picture type unknown or not specified");
        }

        const pictGroup = findParentDestination(this.parser, "pict-group") as any as IPictGroupDestination;
        const isLegacy = (pictGroup != null ? pictGroup.isLegacy() : null);

        const type = this._type;
        if (typeof type === "function") {
            // type is the trampoline function that executes the .load function
            // and returns a renderer trampoline that ends up calling the .render function
            if (this._blob == null) {
                this._blob = Helper._hexToBlob(this.text);
                if (this._blob == null) {
                    throw new RTFJSError("Could not parse picture data");
                }
                delete this.text;
            }

            const doRender = (renderer: Renderer, render: boolean) => {
                const inst = renderer._doc;
                const pictrender = (type as (() => any))();
                if (pictrender != null) {
                    if (typeof pictrender === "string") {
                        Helper.log("[pict] Could not load image: " + pictrender);
                        if (render) {
                            return renderer.buildPicture(pictrender, null);
                        } else {
                            inst.addIns((rendererForPicture) => {
                                rendererForPicture.picture(pictrender, null);
                            });
                        }
                    } else {
                        if (typeof pictrender !== "function") {
                            throw new RTFJSError("Expected a picture render function");
                        }
                        if (render) {
                            return renderer.buildRenderedPicture(pictrender());
                        } else {
                            inst.addIns((rendererForPicture) => {
                                rendererForPicture.renderedPicture(pictrender());
                            });
                        }
                    }
                }
            };

            if (this.inst._settings.onPicture != null) {
                this.inst.addIns((renderer) => {
                        const elem = this.inst._settings.onPicture(isLegacy, () => {
                            return doRender(renderer, true);
                        });
                        if (elem != null) {
                            renderer.appendElement(elem);
                        }
                    });
            } else {
                return {
                    isLegacy,
                    element: doRender(this.parser.renderer, rendering),
                };
            }
        } else if (typeof type === "string") {
            const text = this.text;
            const blob = this._blob;

            const doRender = (renderer: Renderer, render: boolean) => {
                const bin = blob != null ? Helper._blobToBinary(blob) : Helper._hexToBinary(text);
                if (type !== "") {
                    if (render) {
                        return renderer.buildPicture(type as string, bin);
                    } else {
                        renderer._doc.addIns((rendererForPicture) => {
                            rendererForPicture.picture(type as string, bin);
                        });
                    }
                } else {
                    if (render) {
                        return renderer.buildPicture("Unsupported image format", null);
                    } else {
                        renderer._doc.addIns((rendererForPicture) => {
                            rendererForPicture.picture("Unsupported image format", null);
                        });
                    }
                }
            };

            if (this.inst._settings.onPicture != null) {
                this.inst.addIns((renderer) => {
                        const elem = this.inst._settings.onPicture(isLegacy, () => {
                            return doRender(renderer, true);
                        });
                        if (elem != null) {
                            renderer.appendElement(elem);
                        }
                    });
            } else {
                return {
                    isLegacy,
                    element: doRender(this.parser.renderer, rendering),
                };
            }
        }

        delete this.text;
    }

    private _setPropValueRequired(member: string, prop: string) {
        return (param: number) => {
            if (param == null) {
                throw new RTFJSError("Picture property has no value");
            }
            Helper.log("[pict] set " + member + "." + prop + " = " + param);
            const obj = (member != null ? this[member] : this);
            obj[prop] = param;
        };
    }
}
