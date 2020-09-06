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
import { GlobalState } from "../Containers";
import { RtfDestination } from "./RtfDestination";

export abstract class DestinationFactory<T extends IDestination> {
    public class: new (parser: GlobalState, inst: Document, name: string, param: number) => T;

    public newDestination(parser: GlobalState, inst: Document, name: string, param: number): T {
        return new this.class(parser, inst, name, param);
    }
}

export interface IDestination {
    _name: string;

    setMetadata?(metaprop: string, metavalue: any): void;

    apply?(): void;

    appendText?(text: string): void;

    sub?(): IDestination;

    handleKeyword?(keyword: string, param: number): void | boolean;

    handleBlob?(blob: ArrayBuffer): void;

    [key: string]: any;
}

export const findParentDestination = (parser: GlobalState, dest: string) => {
    let state = parser.state;
    while (state != null) {
        if (state.destination == null) {
            break;
        }
        if (state.destination._name === dest) {
            return state.destination;
        }
        state = state.parent;
    }
    Helper.log("findParentDestination() did not find destination " + dest);
};

export class DestinationBase implements IDestination {
    public _name: string;

    constructor(name: string) {
        this._name = name;
    }
}

export class DestinationTextBase implements IDestination {
    public _name: string;
    public text: string;

    constructor(name: string) {
        this._name = name;
        this.text = "";
    }

    public appendText(text: string): void {
        this.text += text;
    }
}

export abstract class DestinationFormattedTextBase implements IDestination {
    public _name: string;
    protected parser: GlobalState;
    private _records: ((rtf: RtfDestination) => void)[];

    constructor(parser: GlobalState, name: string) {
        this.parser = parser;
        this._name = name;
        this._records = [];
    }

    public appendText(text: string): void {
        this._records.push((rtf: RtfDestination) => {
            rtf.appendText(text);
        });
    }

    public handleKeyword(keyword: string, param: number): void {
        this._records.push((rtf: RtfDestination) => {
            return rtf.handleKeyword(keyword, param);
        });
    }

    public apply(): void {
        const rtf = findParentDestination(this.parser, "rtf") as any as RtfDestination;
        if (rtf == null) {
            throw new RTFJSError("IDestination " + this._name + " is not child of rtf destination");
        }

        const len = this._records.length;
        let doRender = true;
        if (this.renderBegin != null) {
            doRender = this.renderBegin(rtf, len);
        }

        if (doRender) {
            for (let i = 0; i < len; i++) {
                this._records[i](rtf);
            }
            if (this.renderEnd != null) {
                this.renderEnd(rtf, len);
            }
        }
        delete this._records;
    }

    public abstract renderBegin(rtf: RtfDestination, records: number): boolean;

    public abstract renderEnd(rtf: RtfDestination, records: number): void;
}

export interface IGenericPropertyDestination extends IDestination {
    apply(): void;
}

export class GenericPropertyDestinationFactory extends DestinationFactory<IGenericPropertyDestination> {
    constructor(parentdest: string, metaprop: string) {
        super();
        this.class = class extends DestinationTextBase implements IGenericPropertyDestination {
            private parser: GlobalState;

            constructor(parser: GlobalState, inst: Document, name: string) {
                super(name);
                this.parser = parser;
            }

            public apply() {
                const dest = findParentDestination(this.parser, parentdest);
                if (dest == null) {
                    throw new RTFJSError("IDestination " + this._name + " must be within "
                        + parentdest + " destination");
                }
                if (dest.setMetadata == null) {
                    throw new RTFJSError("IDestination " + parentdest + " does not accept meta data");
                }
                dest.setMetadata(metaprop, this.text);
            }
        };
    }
}

export interface IGenericSubTextPropertyDestination extends IDestination {
    apply(): void;
}

export class GenericSubTextPropertyDestinationFactory extends DestinationFactory<IGenericSubTextPropertyDestination> {
    constructor(name: string, parentDest: string, propOrFunc: string) {
        super();
        this.class = class extends DestinationTextBase implements IGenericSubTextPropertyDestination {
            private parser: GlobalState;

            constructor(parser: GlobalState) {
                super(name);
                this.parser = parser;
            }

            public apply() {
                const dest = findParentDestination(this.parser, parentDest);
                if (dest == null) {
                    throw new RTFJSError(this._name + " destination must be child of " + parentDest + " destination");
                }
                if (dest[propOrFunc] == null) {
                    throw new RTFJSError(this._name + " destination cannot find member + " + propOrFunc
                        + " in " + parentDest + " destination");
                }
                if (dest[propOrFunc] instanceof Function) {
                    dest[propOrFunc](this.text);
                } else {
                    dest[propOrFunc] = this.text;
                }
            }
        };
    }
}

export class RequiredDestinationFactory extends DestinationFactory<IDestination> {
    constructor(name: string) {
        super();
        this.class = class extends DestinationBase implements IDestination {
            constructor() {
                super(name);
            }
        };
    }
}
