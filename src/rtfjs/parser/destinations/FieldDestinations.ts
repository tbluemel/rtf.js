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

import { Document } from "../../Document";
import { Helper, RTFJSError } from "../../Helper";
import { RenderContainer } from "../../renderer/RenderElements";
import { GlobalState } from "../Containers";
import {
    DestinationBase,
    DestinationFormattedTextBase,
    DestinationTextBase,
    findParentDestination,
} from "./DestinationBase";
import { PictDestination } from "./PictDestinations";
import { RtfDestination } from "./RtfDestination";

export interface IField {
    renderFieldBegin(field: FieldDestination, rtf: RtfDestination, records: number): boolean;

    renderFieldEnd(field: FieldDestination, rtf: RtfDestination, records: number): void;
}

export class FieldDestination extends DestinationBase {
    private _haveInst: boolean;
    private _parsedInst: IField;
    private _result: FldrsltDestination;

    constructor() {
        super("field");
        this._haveInst = false;
        this._parsedInst = null; // FieldBase
        this._result = null;
    }

    public apply() {
        if (!this._haveInst) {
            throw new RTFJSError("IField has no fldinst destination");
        }
        // A fldrslt destination should be included but is not required
        // if (this._result == null)
        //     throw new RTFJSError("IField has no fldrslt destination");
    }

    public setInst(inst: IField | Promise<IField | null>) {
        this._haveInst = true;
        if (this._parsedInst != null) {
            throw new RTFJSError("IField cannot have multiple fldinst destinations");
        }
        if (inst instanceof Promise) {
            inst.then((parsedInst) => {
                this._parsedInst = parsedInst;
            }).catch((error) => {
                this._parsedInst = null;
                throw new RTFJSError(error.message);
            });
        } else {
            this._parsedInst = inst;
        }
    }

    public getInst() {
        return this._parsedInst;
    }

    public setResult(inst: FldrsltDestination) {
        if (this._result != null) {
            throw new RTFJSError("IField cannot have multiple fldrslt destinations");
        }
        this._result = inst;
    }
}

export class FieldBase {
    private _fldinst: FldinstDestination;

    constructor(fldinst: FldinstDestination) {
        this._fldinst = fldinst;
    }

    public renderFieldEnd(field: FieldDestination, rtf: RtfDestination, records: number) {
        if (records > 0) {
            rtf.addIns((renderer) => {
                Helper.log("[rtf] Popping container");
                renderer.popContainer();
            });
        }
    }
}

export class FieldHyperlink extends FieldBase {
    private _url: string;

    constructor(fldinst: FldinstDestination, data: string) {
        super(fldinst);
        this._url = data;
    }

    public url() {
        return this._url;
    }

    public renderFieldBegin(field: FieldDestination, rtf: RtfDestination, records: number) {
        const self = this;
        if (records > 0) {
            rtf.addIns((renderer) => {
                const inst = renderer._doc;
                const create = () => {
                    return renderer.buildHyperlinkElement(self._url);
                };
                let container;
                if (inst._settings.onHyperlink != null) {
                    container = inst._settings.onHyperlink(create,
                        {
                            url() {
                                return self.url();
                            },
                        });
                } else {
                    const elem = create();
                    container = {
                        element: elem,
                        content: elem,
                    };
                }
                Helper.log("[rtf] Pushing hyperlink container for url " + self._url);
                renderer.pushContainer(new RenderContainer(renderer._doc, "hyperlink", container.element,
                    container.content));
            });
            return true;
        }
        return false;
    }
}

export class FldinstDestination extends DestinationTextBase {
    private parser: GlobalState;
    private inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("fldinst");
        this.parser = parser;
        this.inst = inst;
    }

    public apply() {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field == null) {
            throw new RTFJSError("fldinst destination must be child of field destination");
        }
        field.setInst(this.parseType());
    }

    private parseType() {
        const sep = this.text.indexOf(" ");
        if (sep > 0) {
            let data = this.text.substr(sep + 1);
            if (data.length >= 2 && data[0] === "\"") {
                const end = data.indexOf("\"", 1);
                if (end >= 1) {
                    data = data.substring(1, end);
                }
            }
            const fieldType = this.text.substr(0, sep).toUpperCase();
            switch (fieldType) {
                case "HYPERLINK":
                    return new FieldHyperlink(this, data);
                case "IMPORT":
                    if (typeof this.inst._settings.onImport === "function") {
                        let pict: PictDestination;

                        this.inst.addIns((renderer) => {
                            const inst = renderer._doc;
                            // backup
                            const hook = inst._settings.onPicture;
                            inst._settings.onPicture = null;

                            // tslint:disable-next-line:prefer-const
                            let {isLegacy, element} = pict.apply(true);

                            // restore
                            inst._settings.onPicture = hook;

                            if (typeof hook === "function") {
                                element = hook(isLegacy, () => element);
                            }

                            if (element != null) {
                                renderer.appendElement(element);
                            }
                        });

                        const promise: Promise<IField | null> = new Promise((resolve, reject) => {
                            try {
                                const cb = ({error, keyword, blob, width, height}: {
                                    error?: Error, keyword?: string, blob?: ArrayBuffer,
                                    width?: number, height?: number,
                                }) => {
                                    if (!error && typeof keyword === "string" && keyword && blob) {
                                        const dims = {
                                            w: Helper._pxToTwips(width || window.document.body.clientWidth
                                                || window.innerWidth),
                                            h: Helper._pxToTwips(height || 300),
                                        };
                                        pict = new PictDestination(this.parser, this.inst);

                                        pict.handleBlob(blob);
                                        pict.handleKeyword(keyword, 8);  // mapMode: 8 => preserve aspect ratio
                                        pict._displaysize.width = dims.w;
                                        pict._displaysize.height = dims.h;
                                        pict._size.width = dims.w;
                                        pict._size.height = dims.h;

                                        const _parsedInst: IField = {
                                            renderFieldBegin: () => true,
                                            renderFieldEnd: () => null,
                                        };
                                        resolve(_parsedInst);
                                    } else {
                                        Helper.log("[fldinst]: failed to IMPORT image file: " + data);
                                        if (error) {
                                            error = (error instanceof Error) ? error : new Error(error);
                                            reject(error);
                                        } else {
                                            resolve(null);
                                        }
                                    }
                                };
                                this.inst._settings.onImport(data, cb);
                            } catch (error) {
                                reject(error);
                            }
                        });
                        this.parser._asyncTasks.push(promise);
                        return promise;
                    }
                default:
                    Helper.log("[fldinst]: unknown field type: " + fieldType);
                    break;
            }
        }
    }
}

export class FldrsltDestination extends DestinationFormattedTextBase {
    constructor(parser: GlobalState, inst: Document) {
        super(parser, "fldrslt");
    }

    public apply() {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field != null) {
            field.setResult(this);
        }

        super.apply();
    }

    public renderBegin(rtf: RtfDestination, records: number) {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field != null) {
            const inst = field.getInst();
            if (inst != null) {
                return inst.renderFieldBegin(field, rtf, records);
            }
        }
        return false;
    }

    public renderEnd(rtf: RtfDestination, records: number) {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field != null) {
            const inst = field.getInst();
            if (inst != null) {
                inst.renderFieldEnd(field, rtf, records);
            }
        }
    }
}
