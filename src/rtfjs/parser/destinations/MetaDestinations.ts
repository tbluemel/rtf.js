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
import { RTFJSError } from "../../Helper";
import { GlobalState } from "../Containers";
import {
    DestinationBase,
    DestinationFactory,
    DestinationTextBase,
    findParentDestination,
    IDestination,
} from "./DestinationBase";

export class InfoDestination extends DestinationBase {
    private _metadata: { [key: string]: any };
    private inst: Document;

    constructor(parser: GlobalState, inst: Document, name: string) {
        super(name);
        this._metadata = {};
        this.inst = inst;
    }

    public apply(): void {
        for (const prop in this._metadata) {
            this.inst._meta[prop] = this._metadata[prop];
        }
        delete this._metadata;
    }

    public setMetadata(prop: string, val: any): void {
        this._metadata[prop] = val;
    }
}

export interface IMetaPropertyDestination extends IDestination {
    apply(): void;
}

export class MetaPropertyDestinationFactory extends DestinationFactory<IMetaPropertyDestination> {
    constructor(metaprop: string) {
        super();
        this.class = class extends DestinationTextBase implements IMetaPropertyDestination {
            private parser: GlobalState;

            constructor(parser: GlobalState, inst: Document, name: string) {
                super(name);
                this.parser = parser;
            }

            public apply() {
                const info = findParentDestination(this.parser, "info");
                if (info == null) {
                    throw new RTFJSError("IDestination " + this._name + " must be within info destination");
                }
                info.setMetadata(metaprop, this.text);
            }
        };
    }
}

export interface IMetaPropertyTimeDestination extends IDestination {
    handleKeyword(keyword: string, param: number): boolean;

    apply(): void;
}

export class MetaPropertyTimeDestinationFactory extends DestinationFactory<IMetaPropertyTimeDestination> {
    constructor(metaprop: string) {
        super();
        this.class = class extends DestinationBase implements IMetaPropertyTimeDestination {
            private _yr: number;
            private _mo: number;
            private _dy: number;
            private _hr: number;
            private _min: number;
            private _sec: number;
            private parser: GlobalState;

            constructor(parser: GlobalState, inst: Document, name: string) {
                super(name);
                this._yr = null;
                this._mo = null;
                this._dy = null;
                this._hr = null;
                this._min = null;
                this._sec = null;
                this.parser = parser;
            }

            public handleKeyword(keyword: string, param: number) {
                switch (keyword) {
                    case "yr":
                        this._yr = param;
                        break;
                    case "mo":
                        this._mo = param;
                        break;
                    case "dy":
                        this._dy = param;
                        break;
                    case "hr":
                        this._hr = param;
                        break;
                    case "min":
                        this._min = param;
                        break;
                    case "sec":
                        this._sec = param;
                        break;
                    default:
                        return false;
                }

                if (param == null) {
                    throw new RTFJSError("No param found for keyword " + keyword);
                }
                return true;
            }

            public apply() {
                const info = findParentDestination(this.parser, "info");
                if (info == null) {
                    throw new RTFJSError("IDestination " + this._name + " must be within info destination");
                }
                const date = new Date(Date.UTC(
                    this._yr != null ? this._yr : 1970,
                    this._mo != null ? this._mo : 1,
                    this._dy != null ? this._dy : 1,
                    this._hr != null ? this._hr : 0,
                    this._min != null ? this._min : 0,
                    this._sec != null ? this._sec : 0,
                    0));
                info.setMetadata(metaprop, date);
            }
        };
    }
}
