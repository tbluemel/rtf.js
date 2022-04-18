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
import { RenderChp } from "../../renderer/RenderChp";
import { Renderer } from "../../renderer/Renderer";
import { RenderPap } from "../../renderer/RenderPap";
import { Chp, GlobalState, Pap, Sep } from "../Containers";
import { DestinationBase } from "./DestinationBase";

export class RtfDestination extends DestinationBase {
    private _metadata: { [key: string]: any };
    private parser: GlobalState;
    private inst: Document;
    private _charFormatHandlers: { [key: string]: (param: number) => void } = {
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
        sub: this._genericFormatSetVal("chp", "supersubscript", Helper.SUPERSUBSCRIPT.SUBSCRIPT),
        super: this._genericFormatSetVal("chp", "supersubscript", Helper.SUPERSUBSCRIPT.SUPERSCRIPT),
        nosupersub: this._genericFormatSetVal("chp", "supersubscript", Helper.SUPERSUBSCRIPT.NONE),
        cf: this._genericFormatSetValRequired("chp", "colorindex"),
        highlight: this._genericFormatSetValRequired("chp", "highlightindex"),
        fs: this._genericFormatSetValRequired("chp", "fontsize"),
        f: this._genericFormatSetValRequired("chp", "fontfamily"),
        loch: this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.LOWANSI),
        hich: this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.HIGHANSI),
        dbch: this._genericFormatSetNoParam("pap", "charactertype", Helper.CHARACTER_TYPE.DOUBLE),
        strike: this._genericFormatOnOff("chp", "strikethrough"),
        striked: this._genericFormatOnOff("chp", "dblstrikethrough"),
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
        ulthdashd: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHDOTTED,
            Helper.UNDERLINE.NONE),
        ulthdashdd: this._genericFormatOnOff("chp", "underline", Helper.UNDERLINE.THICKDASHDOTDOTTED,
            Helper.UNDERLINE.NONE),
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
        par: this._addInsHandler((renderer) => {
            renderer.startPar();
        }),
        line: this._addInsHandler((renderer) => {
            renderer.lineBreak();
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

    public addIns(func: (renderer: Renderer) => void): void {
        this.inst.addIns(func);
    }

    public appendText(text: string): void {
        Helper.log("[rtf] output: " + text);
        this.inst.addIns(text);
    }

    public sub(): void {
        Helper.log("[rtf].sub()");
    }

    public handleKeyword(keyword: string, param: number): boolean {
        const handler = this._charFormatHandlers[keyword];
        if (handler != null) {
            handler(param);
            return true;
        }
        return false;
    }

    public apply(): void {
        Helper.log("[rtf] apply()");
        for (const prop in this._metadata) {
            this.inst._meta[prop] = this._metadata[prop];
        }
        delete this._metadata;
    }

    public setMetadata(prop: string, val: any): void {
        this._metadata[prop] = val;
    }

    private _addInsHandler(func: (renderer: Renderer) => void) {
        return (param: number) => {
            this.inst.addIns(func);
        };
    }

    private _addFormatIns(ptype: string, props: Chp | Pap) {
        Helper.log("[rtf] update " + ptype);
        switch (ptype) {
            case "chp": {
                const rchp = new RenderChp(new Chp(props as Chp));
                this.inst.addIns((renderer) => {
                    renderer.setChp(rchp);
                });
                break;
            }
            case "pap": {
                const rpap = new RenderPap(new Pap(props as Pap));
                this.inst.addIns((renderer) => {
                    renderer.setPap(rpap);
                });
                break;
            }
        }
    }

    private _genericFormatSetNoParam(ptype: string, prop: string, val: any) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            props[prop] = val;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    }

    private _genericFormatOnOff(ptype: string, prop: string, onval?: string, offval?: string) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            props[prop] = (param == null || param !== 0)
                ? (onval != null ? onval : true) : (offval != null ? offval : false);
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    }

    private _genericFormatSetVal(ptype: string, prop: string, defaultval: number) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            props[prop] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    }

    private _genericFormatSetValRequired(ptype: string, prop: string) {
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

    private _genericFormatSetMemberVal(ptype: string, prop: string, member: string, defaultval: number) {
        return (param: number) => {
            const props = this.parser.state[ptype];
            const members = props[prop];
            members[member] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + "." + member + " = " + members[member].toString());
            this._addFormatIns(ptype, props);
        };
    }
}
