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
import { Document } from "../Document";
import { Helper, RTFJSError } from "../Helper";
import { Renderer } from "../Renderer";
import { Chp, GlobalState, Pap, Sep } from "./Containers";
import { RenderChp } from "./RenderChp";
import { RenderPap } from "./RenderPap";

export abstract class DestinationFactory<T extends IDestination> {
    class: { new (parser: GlobalState, inst: Document, name: string, param: number): T; };

    newDestination(parser: GlobalState, inst: Document, name: string, param: number): T {
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

const findParentDestination = (parser: GlobalState, dest: string) => {
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
    _name: string;

    constructor(name: string) {
        this._name = name;
    }
}

export class DestinationTextBase implements IDestination {
    _name: string;
    text: string;

    constructor(name: string) {
        this._name = name;
        this.text = "";
    }

    appendText(text: string) {
        this.text += text;
    }
}

export abstract class DestinationFormattedTextBase implements IDestination {
    parser: GlobalState;
    _name: string;
    _records: Array<(rtf: RtfDestination) => void>;

    constructor(parser: GlobalState, name: string) {
        this.parser = parser;
        this._name = name;
        this._records = [];
    }

    appendText(text: string) {
        this._records.push((rtf: RtfDestination) => {
            rtf.appendText(text);
        });
    }

    handleKeyword(keyword: string, param: number) {
        this._records.push((rtf: RtfDestination) => {
            return rtf.handleKeyword(keyword, param);
        });
    }

    apply() {
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

    abstract renderBegin(rtf: RtfDestination, records: number): boolean;

    abstract renderEnd(rtf: RtfDestination, records: number): void;
}

export class RtfDestination extends DestinationBase {
    _metadata: {[key: string]: any};
    parser: GlobalState;
    inst: Document;
    _charFormatHandlers: {[key: string]: (param: number) => void} = {
        ansicpg: (param: number) => {
            // if the value is 0, use the default charset as 0 is not valid
            if (param > 0) {
                Helper.log("[rtf] using charset: " + param);
                this.parser.codepage = param;
            }
        },
        sectd: () => {
            Helper.log("[rtf] reset to section defaults");
            this.parser.state.sep = new Sep(null);
        },
        plain: () => {
            Helper.log("[rtf] reset to character defaults");
            this.parser.state.chp = new Chp(null);
        },
        pard: () => {
            Helper.log("[rtf] reset to paragraph defaults");
            this.parser.state.pap = new Pap(null);
        },
        b: this._genericFormatOnOff("chp", "bold"),
        i: this._genericFormatOnOff("chp", "italic"),
        cf: this._genericFormatSetValRequired("chp", "colorindex"),
        fs: this._genericFormatSetValRequired("chp", "fontsize"),
        f: this._genericFormatSetValRequired("chp", "fontfamily"),
        loch: this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.LOWANSI),
        hich: this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.HIGHANSI),
        dbch: this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.DOUBLE),
        strike: this._genericFormatOnOff("chp", "strikethrough"),
        striked: this._genericFormatOnOff("chp", "dblstrikethrough"), // TODO: reject param == null in this particular case?
        ul: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.CONTINUOUS, Helper.UNDERLINE.NONE),
        uld: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DOTTED, Helper.UNDERLINE.NONE),
        uldash: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DASHED, Helper.UNDERLINE.NONE),
        uldashd: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DASHDOTTED, Helper.UNDERLINE.NONE),
        uldashdd: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DASHDOTDOTTED, Helper.UNDERLINE.NONE),
        uldb: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DOUBLE, Helper.UNDERLINE.NONE),
        ulhwave: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.HEAVYWAVE, Helper.UNDERLINE.NONE),
        ulldash: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.LONGDASHED, Helper.UNDERLINE.NONE),
        ulnone: this._genericFormatSetNoParam("chp", "underline", Helper.UNDERLINE.NONE),
        ulth: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICK, Helper.UNDERLINE.NONE),
        ulthd: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDOTTED, Helper.UNDERLINE.NONE),
        ulthdash: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHED, Helper.UNDERLINE.NONE),
        ulthdashd: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHDOTTED, Helper.UNDERLINE.NONE),
        ulthdashdd: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHDOTDOTTED, Helper.UNDERLINE.NONE),
        ululdbwave: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.DOUBLEWAVE, Helper.UNDERLINE.NONE),
        ulw: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.WORD, Helper.UNDERLINE.NONE),
        ulwave: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.WAVE, Helper.UNDERLINE.NONE),
        li: this._genericFormatSetMemberVal("pap", "indent", "left", 0),
        ri: this._genericFormatSetMemberVal("pap", "indent", "right", 0),
        fi: this._genericFormatSetMemberVal("pap", "indent", "firstline", 0),
        sa: this._genericFormatSetValRequired("pap", "spaceafter"),
        sb: this._genericFormatSetValRequired("pap", "spacebefore"),
        cols: this._genericFormatSetVal("sep", "columns", 0),
        sbknone: this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.NONE),
        sbkcol: this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.COL),
        sbkeven: this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.EVEN),
        sbkodd: this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.ODD),
        sbkpage: this._genericFormatSetNoParam("sep", "breaktype", Helper.BREAKTYPE.PAGE),
        pgnx: this._genericFormatSetMemberVal("sep", "pagenumber", "x", 0),
        pgny: this._genericFormatSetMemberVal("sep", "pagenumber", "y", 0),
        pgndec: this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.DECIMAL),
        pgnucrm: this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.UROM),
        pgnlcrm: this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.LROM),
        pgnucltr: this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.ULTR),
        pgnlcltr: this._genericFormatSetNoParam("sep", "pagenumberformat", Helper.PAGENUMBER.LLTR),
        qc: this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.CENTER),
        ql: this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.LEFT),
        qr: this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.RIGHT),
        qj: this._genericFormatSetNoParam("pap", "justification", Helper.JUSTIFICATION.JUSTIFY),
        paperw: this._genericFormatSetVal("dop", "width", 12240),
        paperh: this._genericFormatSetVal("dop", "height", 15480),
        margl: this._genericFormatSetMemberVal("dop", "margin", "left", 1800),
        margr: this._genericFormatSetMemberVal("dop", "margin", "right", 1800),
        margt: this._genericFormatSetMemberVal("dop", "margin", "top", 1440),
        margb: this._genericFormatSetMemberVal("dop", "margin", "bottom", 1440),
        pgnstart: this._genericFormatSetVal("dop", "pagenumberstart", 1),
        facingp: this._genericFormatSetNoParam("dop", "facingpages", true),
        landscape: this._genericFormatSetNoParam("dop", "landscape", true),
        par: this._addInsHandler(function() {
            this.startPar();
        }),
        line: this._addInsHandler(function() {
            this.lineBreak();
        }),
    };

    constructor(parser: GlobalState, inst: Document, name: string, param: number) {
        super(name);
        if (parser.version != null) {
            throw new RTFJSError("Unexpected rtf destination");
        }

        // This parameter should be one, but older versions of the spec allow for omission of the version number
        if (param && param !== 1) {
            throw new RTFJSError("Unsupported rtf version");
        }
        parser.version = 1;

        this._metadata = {};
        this.parser = parser;
        this.inst = inst;
    }

    addIns(func: (this: Renderer) => void) {
        this.inst.addIns(func);
    }

    appendText(text: string) {
        Helper.log("[rtf] output: " + text);
        this.inst.addIns(text);
    }

    sub() {
        Helper.log("[rtf].sub()");
    }

    _addInsHandler(func: (this: Renderer) => void) {
        return (param: number) => {
            this.inst.addIns(func);
        };
    }

    _addFormatIns(ptype: string, props: Chp | Pap) {
        switch (ptype) {
            case "chp":
                const rchp = new RenderChp(new Chp(props as Chp));
                this.inst.addIns(function() {
                    this.setChp(rchp);
                });
                break;
            case "pap":
                const rpap = new RenderPap(new Pap(props as Pap));
                this.inst.addIns(function() {
                    this.setPap(rpap);
                });
                break;
        }
    }

    _genericFormatSetNoParam(ptype: string, prop: string, val: any) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            props[prop] = val;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    }

    _genericFormatOnOff(ptype: string, prop: string, onval?: string, offval?: string) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            props[prop] = (param == null || param !== 0) ? (onval != null ? onval : true) : (offval != null ? offval : false);
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    }
    _genericFormatSetVal(ptype: string, prop: string, defaultval: number) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            props[prop] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    }
    _genericFormatSetValRequired(ptype: string, prop: string) {
        return (param: number) => {
            if (param == null) {
                throw new RTFJSError("Keyword without required param");
            }
            const props = this.parser.state[ptype];
            props[prop] = param;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    }
    _genericFormatSetMemberVal(ptype: string, prop: string, member: string, defaultval: number) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            const members = props[prop];
            members[member] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + "." + member + " = " + members[member].toString());
            this._addFormatIns(ptype, props);
        };
    }

    handleKeyword(keyword: string, param: number) {
        const handler = this._charFormatHandlers[keyword];
        if (handler != null) {
            handler(param);
            return true;
        }
        return false;
    }

    apply() {
        Helper.log("[rtf] apply()");
        for (const prop in this._metadata) {
            this.inst._meta[prop] = this._metadata[prop];
        }
        delete this._metadata;
    }
    setMetadata(prop: string, val: any) {
        this._metadata[prop] = val;
    }
}

export interface IGenericPropertyDestination extends IDestination {
    apply(): void;
}
export class GenericPropertyDestinationFactory extends DestinationFactory<IGenericPropertyDestination> {
    parentdest: string;
    metaprop: string;

    constructor(parentdest: string, metaprop: string) {
        super();
        this.parentdest = parentdest;
        this.metaprop = metaprop;
        this.class = class extends DestinationTextBase implements IGenericPropertyDestination {
            parser: GlobalState;

            constructor(parser: GlobalState, inst: Document, name: string) {
                super(name);
                this.parser = parser;
            }

            apply() {
                const dest = findParentDestination(this.parser, parentdest);
                if (dest == null) {
                    throw new RTFJSError("IDestination " + this._name + " must be within " + parentdest + " destination");
                }
                if (dest.setMetadata == null) {
                    throw new RTFJSError("IDestination " + parentdest + " does not accept meta data");
                }
                dest.setMetadata(metaprop, this.text);
            }
        };
    }
}

export class InfoDestination extends DestinationBase {
    _metadata: {[key: string]: any};
    inst: Document;

    constructor(parser: GlobalState, inst: Document, name: string) {
        super(name);
        this._metadata = {};
        this.inst = inst;
    }

    apply() {
        for (const prop in this._metadata) {
            this.inst._meta[prop] = this._metadata[prop];
        }
        delete this._metadata;
    }

    setMetadata(prop: string, val: any) {
        this._metadata[prop] = val;
    }
}

export interface IMetaPropertyDestination extends IDestination {
    apply(): void;
}
export class MetaPropertyDestinationFactory extends DestinationFactory<IMetaPropertyDestination> {
    metaprop: string;

    constructor(metaprop: string) {
        super();
        this.metaprop = metaprop;
        this.class = class extends DestinationTextBase implements IMetaPropertyDestination {
            parser: GlobalState;

            constructor(parser: GlobalState, inst: Document, name: string) {
                super(name);
                this.parser = parser;
            }

            apply() {
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
    metaprop: string;

    constructor(metaprop: string) {
        super();
        this.metaprop = metaprop;
        this.class = class extends DestinationBase implements IMetaPropertyTimeDestination {
            _yr: number;
            _mo: number;
            _dy: number;
            _hr: number;
            _min: number;
            _sec: number;
            parser: GlobalState;

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

            handleKeyword(keyword: string, param: number) {
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

            apply() {
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

export class FonttblDestinationSub extends DestinationBase {
    _fonttbl: FonttblDestination;
    index: number;
    fontname: string;
    altfontname: string;
    family: string;
    pitch: number;
    bias: number;
    charset: number;

    constructor(fonttbl: FonttblDestination) {
        super("fonttbl:sub");
        this._fonttbl = fonttbl;
        this.index = null;
        this.fontname = null;
        this.altfontname = null;
        this.family = null;
        this.pitch = Helper.FONTPITCH.DEFAULT;
        this.bias = 0;
        this.charset = null;
    }

    handleKeyword(keyword: string, param: number) {
        switch (keyword) {
            case "f":
                this.index = param;
                return true;
            case "fnil":
                return true;
            case "froman":
            case "fswiss":
            case "fmodern":
            case "fscript":
            case "fdecor":
            case "ftech":
            case "fbidi":
            case "flomajor":
            case "fhimajor":
            case "fdbmajor":
            case "fbimajor":
            case "flominor":
            case "fhiminor":
            case "fdbminor":
            case "fbiminor":
                this.family = keyword.slice(1);
                return true;
            case "fprq":
                switch (param) {
                    case 0:
                        this.pitch = Helper.FONTPITCH.DEFAULT;
                        break;
                    case 1:
                        this.pitch = Helper.FONTPITCH.FIXED;
                        break;
                    case 2:
                        this.pitch = Helper.FONTPITCH.VARIABLE;
                        break;
                }
                return true;
            case "fbias":
                if (param != null) {
                    this.bias = param;
                }
                return true;
            case "fcharset":
                if (param != null) {
                    this.charset = Helper._mapCharset(param);
                    if (this.charset == null) {
                        Helper.log("Unknown font charset: " + param);
                    }
                }
                return true;
            case "cpg":
                if (param != null) {
                    this.charset = param;
                }
                return true;
        }
        return false;
    }

    appendText(text: string) {
        if (this.fontname == null) {
            this.fontname = text;
        } else {
            this.fontname += text;
        }
    }

    apply() {
        if (this.index == null) {
            throw new RTFJSError("No font index provided");
        }
        if (this.fontname == null) {
            throw new RTFJSError("No font name provided");
        }
        this._fonttbl.addSub(this);
        delete this._fonttbl;
    }

    setAltFontName(name: string) {
        this.altfontname = name;
    }
}

export class FonttblDestination extends DestinationBase {
    _fonts: FonttblDestinationSub[];
    _sub: FonttblDestinationSub;
    inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("fonttbl");
        this._fonts = [];
        this._sub = null;
        this.inst = inst;
    }

    sub() {
        return new FonttblDestinationSub(this);
    }

    apply() {
        Helper.log("[fonttbl] apply()");
        for (const idx in this._fonts) {
            Helper.log("[fonttbl][" + idx + "] index = " + this._fonts[idx].fontname + " alternative: " + this._fonts[idx].altfontname);
        }
        this.inst._fonts = this._fonts;
        delete this._fonts;
    }

    appendText(text: string) {
        this._sub.appendText(text);
        this._sub.apply();
    }

    handleKeyword(keyword: string, param: number) {
        if (keyword === "f") {
            this._sub = this.sub();
        }
        this._sub.handleKeyword(keyword, param);
    }

    addSub(sub: FonttblDestinationSub) {
        this._fonts[sub.index] = sub;
    }
}

export interface IGenericSubTextPropertyDestination extends IDestination {
    apply(): void;
}
export class GenericSubTextPropertyDestinationFactory extends DestinationFactory<IGenericSubTextPropertyDestination> {
    name: string;
    parentDest: string;
    propOrFunc: string;

    constructor(name: string, parentDest: string, propOrFunc: string) {
        super();
        this.name = name;
        this.parentDest = parentDest;
        this.propOrFunc = propOrFunc;
        this.class = class extends DestinationTextBase implements IGenericSubTextPropertyDestination {
            parser: GlobalState;

            constructor(parser: GlobalState) {
                super(name);
                this.parser = parser;
            }

            apply() {
                const dest = findParentDestination(this.parser, parentDest);
                if (dest == null) {
                    throw new RTFJSError(this._name + " destination must be child of " + parentDest + " destination");
                }
                if (dest[propOrFunc] == null) {
                    throw new RTFJSError(this._name + " destination cannot find member + " + propOrFunc + " in " + parentDest + " destination");
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

export interface IColor {
    r: number;
    g: number;
    b: number;
    tint: number;
    shade: number;
    theme: null;
}

export class ColortblDestination extends DestinationBase {
    _colors: IColor[];
    _current: IColor;
    _autoIndex: number;
    inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("colortbl");
        this._colors = [];
        this._current = null;
        this._autoIndex = null;
        this.inst = inst;
    }

    _startNewColor() {
        this._current = {
            r: 0,
            g: 0,
            b: 0,
            tint: 255,
            shade: 255,
            theme: null,
        };
        return this._current;
    }

    appendText(text: string) {
        const len = text.length;
        for (let i = 0; i < len; i++) {
            if (text[i] !== ";") {
                throw new RTFJSError("Error parsing colortbl destination");
            }
            if (this._current == null) {
                if (this._autoIndex != null) {
                    throw new RTFJSError("colortbl cannot define more than one auto color");
                }
                this._autoIndex = this._colors.length;
                this._startNewColor();
            } else {
                if (this._current.tint < 255 && this._current.shade < 255) {
                    throw new RTFJSError("colortbl cannot define shade and tint at the same time");
                }
            }
            this._colors.push(this._current);
            this._current = null;
        }
    }

    _validateColorValueRange(keyword: string, param: number) {
        if (param == null) {
            throw new RTFJSError(keyword + " has no param");
        }
        if (param < 0 || param > 255) {
            throw new RTFJSError(keyword + " has invalid param value");
        }
        return param;
    }

    handleKeyword(keyword: string, param: number) {
        if (this._current == null) {
            this._startNewColor();
        }

        switch (keyword) {
            case "red":
                this._current.r = this._validateColorValueRange(keyword, param);
                return true;
            case "green":
                this._current.g = this._validateColorValueRange(keyword, param);
                return true;
            case "blue":
                this._current.b = this._validateColorValueRange(keyword, param);
                return true;
            case "ctint":
                this._current.tint = this._validateColorValueRange(keyword, param);
                return true;
            case "cshade":
                this._current.shade = this._validateColorValueRange(keyword, param);
                return true;
            default:
                if (keyword[0] === "c") {
                    this._current.theme = Helper._mapColorTheme(keyword.slice(1));
                    return true;
                }
                break;
        }

        Helper.log("[colortbl] handleKeyword(): unhandled keyword: " + keyword);
        return false;
    }

    apply() {
        Helper.log("[colortbl] apply()");
        if (this._autoIndex == null) {
            this._autoIndex = 0;
        }
        if (this._autoIndex >= this._colors.length) {
            throw new RTFJSError("colortbl doesn't define auto color");
        }
        for (const idx in this._colors) {
            Helper.log("[colortbl] [" + idx + "] = " + this._colors[idx].r + "," + this._colors[idx].g + "," + this._colors[idx].b + " theme: " + this._colors[idx].theme);
        }
        this.inst._colors = this._colors;
        this.inst._autoColor = this._autoIndex;
        delete this._colors;
    }
}

export class StylesheetDestinationSub extends DestinationBase {
    _stylesheet: StylesheetDestination;
    index: number;
    name: string;
    handler: (keyword: string, param: number) => boolean;
    paragraph?: null;

    constructor(stylesheet: StylesheetDestination) {
        super("stylesheet:sub");
        this._stylesheet = stylesheet;
        this.index = 0;
        this.name = null;
        this.handler = this._handleKeywordCommon("paragraph");
    }

    _handleKeywordCommon(member: string) {
        return (keyword: string, param: number) => {
            Helper.log("[stylesheet:sub]." + member + ": unhandled keyword: " + keyword + " param: " + param);
            return false;
        };
    }

    handleKeyword(keyword: string, param: number) {
        switch (keyword) {
            case "s":
                this.index = param;
                return true;
            case "cs":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("character");
                this.index = param;
                return true;
            case "ds":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("section");
                this.index = param;
                return true;
            case "ts":
                delete this.paragraph;
                this.handler = this._handleKeywordCommon("table");
                this.index = param;
                return true;
        }

        return this.handler(keyword, param);
    }

    appendText(text: string) {
        if (this.name == null) {
            this.name = text;
        } else {
            this.name += text;
        }
    }

    apply() {
        this._stylesheet.addSub({
            index: this.index,
            name: this.name,
        });
        delete this._stylesheet;
    }
}

export class StylesheetDestination extends DestinationBase {
    _stylesheets: Array<{index: number, name: string}>;
    inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("stylesheet");
        this._stylesheets = [];
        this.inst = inst;
    }

    sub() {
        return new StylesheetDestinationSub(this);
    }

    apply() {
        Helper.log("[stylesheet] apply()");
        for (const idx in this._stylesheets) {
            Helper.log("[stylesheet] [" + idx + "] name: " + this._stylesheets[idx].name);
        }
        this.inst._stylesheets = this._stylesheets;
        delete this._stylesheets;
    }

    addSub(sub: {index: number, name: string}) {
        // Some documents will redefine stylesheets
        // if (this._stylesheets[sub.index] != null)
        //     throw new RTFJSError("Cannot redefine stylesheet with index " + sub.index);
        this._stylesheets[sub.index] = sub;
    }
}

export interface IField {
    renderFieldBegin(field: FieldDestination, rtf: RtfDestination, records: number): boolean;
    renderFieldEnd(field: FieldDestination, rtf: RtfDestination, records: number): void;
}

export class FieldDestination extends DestinationBase {
    _haveInst: boolean;
    _parsedInst: IField;
    _result: FldrsltDestination;

    constructor() {
        super("field");
        this._haveInst = false;
        this._parsedInst = null; // FieldBase
        this._result = null;
    }

    apply() {
        if (!this._haveInst) {
            throw new RTFJSError("IField has no fldinst destination");
        }
        // A fldrslt destination should be included but is not required
        // if (this._result == null)
        //     throw new RTFJSError("IField has no fldrslt destination");
    }

    setInst(inst: IField | Promise<IField | null>) {
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

    getInst() {
        return this._parsedInst;
    }

    setResult(inst: FldrsltDestination) {
        if (this._result != null) {
            throw new RTFJSError("IField cannot have multiple fldrslt destinations");
        }
        this._result = inst;
    }
}

export class FieldBase {
    _fldinst: FldinstDestination;

    constructor(fldinst: FldinstDestination) {
        this._fldinst = fldinst;
    }

    renderFieldEnd(field: FieldDestination, rtf: RtfDestination, records: number) {
        if (records > 0) {
            rtf.addIns(function() {
                this.popContainer();
            });
        }
    }
}

export class FieldHyperlink extends FieldBase {
    _url: string;
    inst: Document;

    constructor(inst: Document, fldinst: FldinstDestination, data: string) {
        super(fldinst);
        this._url = data;
        this.inst = inst;
    }

    url() {
        return this._url;
    }

    renderFieldBegin(field: FieldDestination, rtf: RtfDestination, records: number) {
        const self = this;
        if (records > 0) {
            rtf.addIns(function() {
                const inst = this._doc;
                const renderer = this;
                const create = () => {
                    return renderer.buildHyperlinkElement(self._url);
                };
                let container;
                if (inst._settings.onHyperlink != null) {
                    container = inst._settings.onHyperlink.call(inst, create,
                        {url() {return self.url(); }});
                } else {
                    const elem = create();
                    container = {
                        element: elem,
                        content: elem,
                    };
                }
                this.pushContainer(container);
            });
            return true;
        }
        return false;
    }
}

export class FldinstDestination extends DestinationTextBase {
    parser: GlobalState;
    inst: Document;

    constructor(parser: GlobalState, inst: Document) {
        super("fldinst");
        this.parser = parser;
        this.inst = inst;
    }

    apply() {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field == null) {
            throw new RTFJSError("fldinst destination must be child of field destination");
        }
        field.setInst(this.parseType());
    }

    parseType() {
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
                    return new FieldHyperlink(this.inst, this, data);
                case "IMPORT":
                    if (typeof this.inst._settings.onImport === "function") {
                        let pict: PictDestination;

                        this.inst.addIns(function() {
                            const inst = this._doc;
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
                                this.appendElement(element);
                            }
                        });

                        const promise: Promise<IField | null> = new Promise((resolve, reject) => {
                            try {
                                const cb = ({error, keyword, blob, width, height}
                                        : {error?: Error, keyword?: string, blob?: ArrayBuffer, width?: number, height?: number}) => {
                                    if (!error && typeof keyword === "string" && keyword && blob) {
                                        const dims = {
                                            w: Helper._pxToTwips(width  || window.document.body.clientWidth || window.innerWidth),
                                            h: Helper._pxToTwips(height || 300),
                                        };
                                        pict = new PictDestination(this.parser, this.inst);

                                        pict.handleBlob(blob);
                                        pict.handleKeyword(keyword, 8);  // mapMode: 8 => preserve aspect ratio
                                        pict._displaysize.width  = dims.w;
                                        pict._displaysize.height = dims.h;
                                        pict._size.width  = dims.w;
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
                                this.inst._settings.onImport.call(this.inst, data, cb);
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

    apply() {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field != null) {
            field.setResult(this);
        }

        super.apply();
    }

    renderBegin(rtf: RtfDestination, records: number) {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field != null) {
            const inst = field.getInst();
            if (inst != null) {
                return inst.renderFieldBegin(field, rtf, records);
            }
        }
        return false;
    }

    renderEnd(rtf: RtfDestination, records: number) {
        const field = findParentDestination(this.parser, "field") as FieldDestination;
        if (field != null) {
            const inst = field.getInst();
            if (inst != null) {
                inst.renderFieldEnd(field, rtf, records);
            }
        }
    }
}

export interface IPictGroupDestination extends IDestination {
    isLegacy(): boolean;
}
export class PictGroupDestinationFactory extends DestinationFactory<IPictGroupDestination> {
    legacy: boolean;

    constructor(legacy: boolean) {
        super();
        this.legacy = legacy;
        this.class = class extends DestinationTextBase implements IPictGroupDestination {
            _legacy: boolean;

            constructor() {
                super("pict-group");
                this._legacy = legacy;
            }

            isLegacy() {
                return this._legacy;
            }
        };
    }
}

export class PictDestination extends DestinationTextBase {
    _type: string | (() => any);
    _blob: ArrayBuffer;
    _displaysize: {width: number, height: number};
    _size: {width: number, height: number};
    parser: GlobalState;
    inst: Document;
    [key: string]: any;

    _pictHandlers: {[key: string]: (param: number) => void} = {
        picw: this._setPropValueRequired("_size", "width"),
        pich: this._setPropValueRequired("_size", "height"),
        picwgoal: this._setPropValueRequired("_displaysize", "width"),
        pichgoal: this._setPropValueRequired("_displaysize", "height"),
    };

    _pictTypeHandler: {[key: string]: string | ((param?: number) => {load: () => any, render: (img: any) => JQuery})} = {
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
                                hExt: this._size.width,
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

    _setPropValueRequired(member: string, prop: string) {
        return (param: number) => {
            if (param == null) {
                throw new RTFJSError("Picture property has no value");
            }
            Helper.log("[pict] set " + member + "." + prop + " = " + param);
            const obj = (member != null ? this[member] : this);
            obj[prop] = param;
        };
    }

    handleKeyword(keyword: string, param: number) {
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

    handleBlob(blob: ArrayBuffer) {
        this._blob = blob;
    }

    apply(rendering= false) {
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

            const doRender = function(this: Renderer, render: boolean) {
                const inst = this._doc;
                const pictrender = (type as (() => any))();
                if (pictrender != null) {
                    if (typeof pictrender === "string") {
                        Helper.log("[pict] Could not load image: " + pictrender);
                        if (render) {
                            return this.buildPicture(pictrender, null);
                        } else {
                            inst.addIns(function() {
                                this.picture(pictrender, null);
                            });
                        }
                    } else {
                        if (typeof pictrender !== "function") {
                            throw new RTFJSError("Expected a picture render function");
                        }
                        if (render) {
                            return this.buildRenderedPicture(pictrender());
                        } else {
                            inst.addIns(function() {
                                this.renderedPicture(pictrender());
                            });
                        }
                    }
                }
            };

            if (this.inst._settings.onPicture != null) {
                this.inst.addIns(((legacy) => {
                    return function(this: Renderer) {
                        const inst = this._doc;
                        const renderer = this;
                        const elem = inst._settings.onPicture.call(inst, legacy, () => {
                            return doRender.call(renderer, true);
                        });
                        if (elem != null) {
                            this.appendElement(elem);
                        }
                    };
                })(isLegacy));
            } else {
                return {
                    isLegacy,
                    element: doRender.call(this.parser.renderer, rendering),
                };
            }
        } else if (typeof type === "string") {
            const text = this.text;
            const blob = this._blob;

            const doRender = function(this: Renderer, render: boolean) {
                const bin = blob != null ? Helper._blobToBinary(blob) : Helper._hexToBinary(text);
                if (type !== "") {
                    if (render) {
                        return this.buildPicture(type as string, bin);
                    } else {
                        this._doc.addIns(function() {
                            this.picture(type as string, bin);
                        });
                    }
                } else {
                    if (render) {
                        return this.buildPicture("Unsupported image format", null);
                    } else {
                        this._doc.addIns(function() {
                            this.picture("Unsupported image format", null);
                        });
                    }
                }
            };

            if (this.inst._settings.onPicture != null) {
                this.inst.addIns(((legacy) => {
                    return function(this: Renderer) {
                        const inst = this._doc;
                        const renderer = this;
                        const elem = inst._settings.onPicture.call(inst, legacy, () => {
                            return doRender.call(renderer, true);
                        });
                        if (elem != null) {
                            this.appendElement(elem);
                        }
                    };
                })(isLegacy));
            } else {
                return {
                    isLegacy,
                    element: doRender.call(this.parser.renderer, rendering),
                };
            }
        }

        delete this.text;
    }
}

// tslint:disable-next-line:no-empty-interface
export interface IRequiredDestination extends IDestination {
}
export class RequiredDestinationFactory extends DestinationFactory<IRequiredDestination> {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
        this.class = class extends DestinationBase implements IRequiredDestination {
            constructor() {
                super(name);
            }
        };
    }
}

export const destinations: {[key: string]: ({ new (parser: GlobalState, inst: Document, name: string, param: number): any } | DestinationFactory<any>)} = {
    rtf: RtfDestination,
    info: InfoDestination,
    title: new MetaPropertyDestinationFactory("title"),
    subject: new MetaPropertyDestinationFactory("subject"),
    author: new MetaPropertyDestinationFactory("author"),
    manager: new MetaPropertyDestinationFactory("manager"),
    company: new MetaPropertyDestinationFactory("company"),
    operator: new MetaPropertyDestinationFactory("operator"),
    category: new MetaPropertyDestinationFactory("category"),
    keywords: new MetaPropertyDestinationFactory("keywords"),
    doccomm: new MetaPropertyDestinationFactory("doccomm"),
    hlinkbase: new MetaPropertyDestinationFactory("hlinkbase"),
    generator: new GenericPropertyDestinationFactory("rtf", "generator"),
    creatim: new MetaPropertyTimeDestinationFactory("creatim"),
    revtim: new MetaPropertyTimeDestinationFactory("revtim"),
    printim: new MetaPropertyTimeDestinationFactory("printim"),
    buptim: new MetaPropertyTimeDestinationFactory("buptim"),
    fonttbl: FonttblDestination,
    falt: new GenericSubTextPropertyDestinationFactory("falt", "fonttbl:sub", "setAltFontName"),
    colortbl: ColortblDestination,
    stylesheet: StylesheetDestination,
    footer: new RequiredDestinationFactory("footer"),
    footerf: new RequiredDestinationFactory("footerf"),
    footerl: new RequiredDestinationFactory("footerl"),
    footerr: new RequiredDestinationFactory("footerr"),
    footnote: new RequiredDestinationFactory("footnote"),
    ftncn: new RequiredDestinationFactory("ftncn"),
    ftnsep: new RequiredDestinationFactory("ftnsep"),
    ftnsepc: new RequiredDestinationFactory("ftnsepc"),
    header: new RequiredDestinationFactory("header"),
    headerf: new RequiredDestinationFactory("headerf"),
    headerl: new RequiredDestinationFactory("headerl"),
    headerr: new RequiredDestinationFactory("headerr"),
    pict: PictDestination,
    shppict: new PictGroupDestinationFactory(false),
    nonshppict: new PictGroupDestinationFactory(true),
    private1: new RequiredDestinationFactory("private1"),
    rxe: new RequiredDestinationFactory("rxe"),
    tc: new RequiredDestinationFactory("tc"),
    txe: new RequiredDestinationFactory("txe"),
    xe: new RequiredDestinationFactory("xe"),
    field: FieldDestination,
    fldinst: FldinstDestination,
    fldrslt: FldrsltDestination,
};
