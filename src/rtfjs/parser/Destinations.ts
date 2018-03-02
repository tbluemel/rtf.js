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

import { Helper, RTFJSError } from '../Helper';
import { RenderChp } from './RenderChp';
import { RenderPap } from './RenderPap';
import { Pap, Chp, Sep, GlobalState } from './Containers';
import { Document } from '../Document';

declare const WMFJS: any;
declare const EMFJS: any;

var findParentDestination = function (parser: GlobalState, dest: string) {
    var state = parser.state;
    while (state != null) {
        if (state.destination == null)
            break;
        if (state.destination._name == dest)
            return state.destination;
        state = state.parent;
    }
    Helper.log("findParentDestination() did not find destination " + dest);
};

class DestinationBase {
    _name: string;

    constructor(name: string) {
        this._name = name;
    }
};

class DestinationTextBase {
    _name: string;
    text: string;

    constructor(name: string) {
        this._name = name;
        this.text = "";
    }

    appendText(text: string) {
        this.text += text;
    }
};

abstract class DestinationFormattedTextBase {
    parser: GlobalState;
    _name: string;
    _records: ((rtf: rtfDestination) => void)[];

    constructor(parser: GlobalState, name: string) {
        this.parser = parser;
        this._name = name;
        this._records = [];
    }

    appendText(text: string) {
        this._records.push(function (rtf: rtfDestination) {
            rtf.appendText(text);
        });
    };

    handleKeyword(keyword: string, param: number) {
        this._records.push(function (rtf: rtfDestination) {
            return rtf.handleKeyword(keyword, param);
        });
    };

    apply() {
        var rtf = findParentDestination(this.parser, "rtf");
        if (rtf == null)
            throw new RTFJSError("Destination " + this._name + " is not child of rtf destination");

        var len = this._records.length;
        var doRender = true;
        if (this.renderBegin != null)
            doRender = this.renderBegin(rtf, len);

        if (doRender) {
            for (var i = 0; i < len; i++) {
                this._records[i](rtf);
            }
            if (this.renderEnd != null)
                this.renderEnd(rtf, len);
        }
        delete this._records;
    };

    abstract renderBegin(rtf: rtfDestination, records: number);

    abstract renderEnd(rtf: rtfDestination, records: number);
};

class rtfDestination extends DestinationBase {
    _metadata;
    parser: GlobalState;
    inst: Document;

    constructor(parser: GlobalState, inst: Document, name: string, param: number){
        super(name);
        if (parser.version != null)
            throw new RTFJSError("Unexpected rtf destination");

        // This parameter should be one, but older versions of the spec allow for omission of the version number
        if (param && param != 1)
            throw new RTFJSError("Unsupported rtf version");
        parser.version = 1;

        this._metadata = {};
        this.parser = parser;
        this.inst = inst;
    }

    addIns(func) {
        this.inst.addIns(func);
    };

    appendText(text: string) {
        Helper.log("[rtf] output: " + text);
        this.inst.addIns(text);
    }

    sub() {
        Helper.log("[rtf].sub()");
    }

    _addInsHandler(func) {
        return function (param) {
            this.inst.addIns(func);
        };
    };

    _addFormatIns(ptype: string, props: Chp | Pap) {
        switch (ptype) {
            case "chp":
                var rchp = new RenderChp(new Chp(<Chp>props));
                this.inst.addIns(function () {
                    this.setChp(rchp);
                });
                break;
            case "pap":
                var rpap = new RenderPap(new Pap(<Pap>props));
                this.inst.addIns(function () {
                    this.setPap(rpap);
                });
                break;
        }
    };

    _genericFormatSetNoParam(ptype: string, prop, val) {
        return function (param) {
            var props = this.parser.state[ptype];
            props[prop] = val;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    };

    _genericFormatOnOff(ptype: string, prop, onval?, offval?) {
        return function (param) {
            var props = this.parser.state[ptype];
            props[prop] = (param == null || param != 0) ? (onval != null ? onval : true) : (offval != null ? offval : false);
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    };
    _genericFormatSetVal(ptype: string, prop, defaultval) {
        return function (param) {
            var props = this.parser.state[ptype];
            props[prop] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    };
    _genericFormatSetValRequired(ptype: string, prop) {
        return function (param) {
            if (param == null)
                throw new RTFJSError("Keyword without required param");
            var props = this.parser.state[ptype];
            props[prop] = param;
            Helper.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
            this._addFormatIns(ptype, props);
        };
    };
    _genericFormatSetMemberVal(ptype: string, prop, member, defaultval) {
        return function (param) {
            var props = this.parser.state[ptype];
            var members = props[prop];
            members[member] = (param == null) ? defaultval : param;
            Helper.log("[rtf] state." + ptype + "." + prop + "." + member + " = " + members[member].toString());
            this._addFormatIns(ptype, props);
        };
    };
    _charFormatHandlers = {
        ansicpg: function (param: number) {
            //if the value is 0, use the default charset as 0 is not valid
            if (param > 0) {
                Helper.log("[rtf] using charset: " + param);
                this.parser.codepage = param;
            }
        },
        sectd: function () {
            Helper.log("[rtf] reset to section defaults");
            this.parser.state.sep = new Sep(null);
        },
        plain: function () {
            Helper.log("[rtf] reset to character defaults");
            this.parser.state.chp = new Chp(null);
        },
        pard: function () {
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
        par: this._addInsHandler(function () {
            this.startPar();
        }),
        line: this._addInsHandler(function () {
            this.lineBreak();
        }),
    };

    handleKeyword(keyword: string, param: number) {
        var handler = this._charFormatHandlers[keyword];
        if (handler != null) {
            handler.call(this, param);
            return true;
        }
        //Helper.log("[rtf] unhandled keyword: " + keyword + " param: " + param);
        return false;
    }

    apply() {
        Helper.log("[rtf] apply()");
        for (var prop in this._metadata)
            this.inst._meta[prop] = this._metadata[prop];
        delete this._metadata;
    }
    setMetadata(prop, val) {
        this._metadata[prop] = val;
    }
};

var genericPropertyDestinationFactory = function (parentdest, metaprop) {
    return class genericPropertyDestination extends DestinationTextBase {
        parser: GlobalState;

        constructor(parser: GlobalState, inst: Document, name: string) {
            super(name);
            this.parser = parser;
        }

        apply() {
            var dest = findParentDestination(this.parser, parentdest);
            if (dest == null)
                throw new RTFJSError("Destination " + this._name + " must be within " + parentdest + " destination");
            if (dest.setMetadata == null)
                throw new RTFJSError("Destination " + parentdest + " does not accept meta data");
            dest.setMetadata(metaprop, this.text);
        }
    };
};

class infoDestination extends DestinationBase {
    _metadata;
    inst: Document;

    constructor(parser: GlobalState, inst: Document, name: string){
        super(name);
        this._metadata = {};
        this.inst = inst;
    }

    apply() {
        for (var prop in this._metadata)
            this.inst._meta[prop] = this._metadata[prop];
        delete this._metadata;
    }

    setMetadata(prop, val) {
        this._metadata[prop] = val;
    }
};

var metaPropertyDestinationFactory = function (metaprop) {
    return class metaPropertyDestination extends DestinationTextBase {
        parser: GlobalState;

        constructor(parser: GlobalState, inst: Document, name: string) {
            super(name);
            this.parser = parser;
        }

        apply = function () {
            var info = findParentDestination(this.parser, "info");
            if (info == null)
                throw new RTFJSError("Destination " + this._name + " must be within info destination");
            info.setMetadata(metaprop, this.text);
        };
    };
};

var metaPropertyTimeDestinationFactory = function (metaprop) {
    return class metaPropertyTimeDestination extends DestinationBase {
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

            if (param == null)
                throw new RTFJSError("No param found for keyword " + keyword);
            return true;
        };

        apply() {
            var info = findParentDestination(this.parser, "info");
            if (info == null)
                throw new RTFJSError("Destination " + this._name + " must be within info destination");
            var date = new Date(Date.UTC(
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
};

class fonttblDestinationSub extends DestinationBase {
    _fonttbl: fonttblDestination;
    index: number;
    fontname: string;
    altfontname: string;
    family: string;
    pitch: number;
    bias: number;
    charset: number;

    constructor(fonttbl: fonttblDestination){
        super("fonttbl:sub");
        this._fonttbl = fonttbl;
        this.index = null;
        this.fontname = null;
        this.altfontname = null;
        this.family = null;
        this.pitch = Helper.FONTPITCH.DEFAULT;
        this.bias = 0;
        this.charset = null;
    };

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
                if (param != null)
                    this.bias = param;
                return true;
            case "fcharset":
                if (param != null) {
                    this.charset = Helper._mapCharset(param);
                    if (this.charset == null)
                        Helper.log("Unknown font charset: " + param);
                }
                return true;
            case "cpg":
                if (param != null) {
                    this.charset = param;
                }
                return true;
        }
        return false;
    };

    appendText(text: string) {
        if (this.fontname == null)
            this.fontname = text;
        else
            this.fontname += text;
    };

    apply() {
        if (this.index == null)
            throw new RTFJSError("No font index provided");
        if (this.fontname == null)
            throw new RTFJSError("No font name provided");
        this._fonttbl.addSub(this);
        delete this._fonttbl;
    };

    setAltFontName(name: string) {
        this.altfontname = name;
    };
};

class fonttblDestination extends DestinationBase {
    _fonts: fonttblDestinationSub[];
    _sub: fonttblDestinationSub;
    inst: Document;

    constructor(parser: GlobalState, inst: Document){
        super("fonttbl");
        this._fonts = [];
        this._sub = null;
        this.inst = inst;
    };

    sub() {
        return new fonttblDestinationSub(this);
    };

    apply() {
        Helper.log("[fonttbl] apply()");
        for (var idx in this._fonts) {
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

    addSub(sub: fonttblDestinationSub) {
        this._fonts[sub.index] = sub;
    };
};

var genericSubTextPropertyDestinationFactory = function (name: string, parentDest, propOrFunc) {
    return class genericSubTextPropertyDestination extends DestinationTextBase {
        parser: GlobalState;

        constructor(parser: GlobalState) {
            super(name);
            this.parser = parser;
        }

        apply = function () {
            var dest = findParentDestination(this.parser, parentDest);
            if (dest == null)
                throw new RTFJSError(this._name + " destination must be child of " + parentDest + " destination");
            if (dest[propOrFunc] == null)
                throw new RTFJSError(this._name + " destination cannot find member + " + propOrFunc + " in " + parentDest + " destination");
            if (dest[propOrFunc] instanceof Function)
                dest[propOrFunc](this.text);
            else
                dest[propOrFunc] = this.text;
        }
    };
};

class colortblDestination extends DestinationBase {
    _colors;
    _current;
    _autoIndex: number;
    inst: Document;

    constructor(parser: GlobalState, inst: Document){
        super("colortbl");
        this._colors = [];
        this._current = null;
        this._autoIndex = null;
        this.inst = inst;
    };

    _startNewColor() {
        this._current = {
            r: 0,
            g: 0,
            b: 0,
            tint: 255,
            shade: 255,
            theme: null
        };
        return this._current;
    };

    appendText(text: string) {
        var len = text.length;
        for (var i = 0; i < len; i++) {
            if (text[i] != ";")
                throw new RTFJSError("Error parsing colortbl destination");
            if (this._current == null) {
                if (this._autoIndex != null)
                    throw new RTFJSError("colortbl cannot define more than one auto color");
                this._autoIndex = this._colors.length;
                this._startNewColor();
            } else {
                if (this._current.tint < 255 && this._current.shade < 255)
                    throw new RTFJSError("colortbl cannot define shade and tint at the same time");
            }
            this._colors.push(this._current);
            this._current = null;
        }
    };

    _validateColorValueRange(keyword: string, param: number) {
        if (param == null)
            throw new RTFJSError(keyword + " has no param");
        if (param < 0 || param > 255)
            throw new RTFJSError(keyword + " has invalid param value");
        return param;
    };

    handleKeyword(keyword: string, param: number) {
        if (this._current == null)
            this._startNewColor();

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
                if (keyword[0] == "c") {
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
        if (this._autoIndex == null)
            this._autoIndex = 0;
        if (this._autoIndex >= this._colors.length)
            throw new RTFJSError("colortbl doesn't define auto color")
        for (var idx in this._colors)
            Helper.log("[colortbl] [" + idx + "] = " + this._colors[idx].r + "," + this._colors[idx].g + "," + this._colors[idx].b + " theme: " + this._colors[idx].theme);
        this.inst._colors = this._colors;
        this.inst._autoColor = this._autoIndex;
        delete this._colors;
    }
};

class stylesheetDestinationSub extends DestinationBase{
    _stylesheet: stylesheetDestination;
    index: number;
    name: string;
    handler;
    paragraph?;

    constructor(stylesheet: stylesheetDestination){
        super("stylesheet:sub");
        this._stylesheet = stylesheet;
        this.index = 0;
        this.name = null;
        this.handler = this._handleKeywordCommon("paragraph");
    };

    _handleKeywordCommon = function (member) {
        return function (keyword: string, param: number) {
            Helper.log("[stylesheet:sub]." + member + ": unhandled keyword: " + keyword + " param: " + param);
            return false;
        };
    };

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
    };

    appendText(text: string) {
        if (this.name == null)
            this.name = text;
        else
            this.name += text;
    };

    apply() {
        this._stylesheet.addSub({
            index: this.index,
            name: this.name
        });
        delete this._stylesheet;
    };
};

class stylesheetDestination extends DestinationBase {
    _stylesheets: {index: number, name: string}[];
    inst: Document;

    constructor(parser: GlobalState, inst: Document){
        super("stylesheet");
        this._stylesheets = [];
        this.inst = inst;
    };

    sub() {
        return new stylesheetDestinationSub(this);
    };

    apply() {
        Helper.log("[stylesheet] apply()");
        for (var idx in this._stylesheets)
            Helper.log("[stylesheet] [" + idx + "] name: " + this._stylesheets[idx].name);
        this.inst._stylesheets = this._stylesheets;
        delete this._stylesheets;
    };

    addSub(sub: {index: number, name: string}) {
        //Some documents will redefine stylesheets
        // if (this._stylesheets[sub.index] != null)
        //     throw new RTFJSError("Cannot redefine stylesheet with index " + sub.index);
        this._stylesheets[sub.index] = sub;
    };
};

class fieldDestination extends DestinationBase {
    _haveInst: boolean;
    _parsedInst;
    _result;

    constructor(){
        super("field");
        this._haveInst = false;
        this._parsedInst = null; // FieldBase
        this._result = null;
    };

    apply() {
        if (!this._haveInst)
            throw new RTFJSError("Field has no fldinst destination");
        //A fldrslt destination should be included but is not required
        // if (this._result == null)
        //     throw new RTFJSError("Field has no fldrslt destination");
    };

    setInst(inst: Document) {
        this._haveInst = true;
        if (this._parsedInst != null)
            throw new RTFJSError("Field cannot have multiple fldinst destinations");
        Promise.resolve(inst)
            .then(_parsedInst => {
                this._parsedInst = _parsedInst;
            })
            .catch(error => {
                this._parsedInst = null;
                throw new RTFJSError(error.message);
            })
    };

    getInst() {
        return this._parsedInst;
    };

    setResult(inst: Document) {
        if (this._result != null)
            throw new RTFJSError("Field cannot have multiple fldrslt destinations");
        this._result = inst;
    };
};

class FieldBase {
    _fldinst: fldinstDestination;

    constructor(fldinst: fldinstDestination) {
        this._fldinst = fldinst;
    }

    renderFieldEnd(field: fieldDestination, rtf: rtfDestination, records: number) {
        if (records > 0) {
            rtf.addIns(function () {
                this.popContainer();
            });
        }
    };
};

class FieldHyperlink extends FieldBase {
    _url;
    inst: Document;

    constructor(inst: Document, fldinst: fldinstDestination, data) {
        super(fldinst);
        this._url = data;
        this.inst = inst;
    }

    url() {
        return this._url;
    }

    renderFieldBegin(field: fieldDestination, rtf: rtfDestination, records: number) {
        var self = this;
        if (records > 0) {
            rtf.addIns(function () {
                var inst = this._doc;
                var renderer = this;
                var create = function () {
                    return renderer.buildHyperlinkElement(self._url);
                };
                var container;
                if (inst._settings.onHyperlink != null) {
                    container = inst._settings.onHyperlink.call(this.inst, create, self);
                } else {
                    var elem = create();
                    container = {
                        element: elem,
                        content: elem
                    };
                }
                this.pushContainer(container);
            });
            return true;
        }
        return false;
    };
};

class fldinstDestination extends DestinationTextBase {
    parser: GlobalState;
    inst: Document;

    constructor(parser: GlobalState, inst: Document){
        super("fldinst");
        this.parser = parser;
        this.inst = inst;
    };

    apply() {
        var field = findParentDestination(this.parser, "field");
        if (field == null)
            throw new RTFJSError("fldinst destination must be child of field destination");
        field.setInst(this.parseType());
    };

    parseType() {
        var sep = this.text.indexOf(" ");
        if (sep > 0) {
            var data = this.text.substr(sep + 1);
            if (data.length >= 2 && data[0] == "\"") {
                var end = data.indexOf("\"", 1);
                if (end >= 1)
                    data = data.substring(1, end);
            }
            var fieldType = this.text.substr(0, sep).toUpperCase();
            switch (fieldType) {
                case "HYPERLINK":
                    return new FieldHyperlink(this.inst, this, data);
                case "IMPORT":
                    if (typeof this.inst._settings.onImport === 'function') {
                        let pict: pictDestination;

                        this.inst.addIns(function() {
                            let inst = this._doc;
                            // backup
                            const hook = inst._settings.onPicture
                            inst._settings.onPicture = null

                            let {isLegacy, element} = pict.apply(true)

                            // restore
                            inst._settings.onPicture = hook

                            if (typeof hook === 'function') {
                                element = hook(isLegacy, () => element)
                            }

                            if (element != null)
                                this.appendElement(element)
                        })

                        const promise = new Promise((resolve, reject) => {
                            try {
                                let self = this;
                                let cb = function({error, keyword, blob, width, height}) {
                                    if (!error && typeof keyword === 'string' && keyword && blob) {
                                        const dims = {
                                            w: Helper._pxToTwips(width  || window.document.body.clientWidth || window.innerWidth),
                                            h: Helper._pxToTwips(height || 300)
                                        }
                                        pict = new pictDestination(self.parser, self.inst);

                                        pict.handleBlob(blob);
                                        pict.handleKeyword(keyword, 8);  // mapMode: 8 => preserve aspect ratio
                                        pict._displaysize.width  = dims.w
                                        pict._displaysize.height = dims.h
                                        pict._size.width  = dims.w
                                        pict._size.height = dims.h

                                        const _parsedInst = {
                                            renderFieldBegin: () => true,
                                            renderFieldEnd: () => true
                                        }
                                        resolve(_parsedInst);
                                    }
                                    else {
                                        Helper.log("[fldinst]: failed to IMPORT image file: " + data);
                                        if (error) {
                                            error = (error instanceof Error) ? error : new Error(error);
                                            reject(error);
                                        }
                                        else {
                                            resolve(undefined);
                                        }
                                    }
                                }
                                this.inst._settings.onImport.call(this.inst, data, cb)
                            }
                            catch(error) {
                                reject(error)
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
    };
};

class fldrsltDestination extends DestinationFormattedTextBase {
    constructor(parser: GlobalState, inst: Document){
        super(parser, "fldrslt");
    };

    apply() {
        var field = findParentDestination(this.parser, "field");
        if (field != null) {
            field.setResult(this);
        }

        super.apply();
    };

    renderBegin(rtf: rtfDestination, records: number) {
        var field = findParentDestination(this.parser, "field");
        if (field != null) {
            var inst = field.getInst();
            if (inst != null)
                return inst.renderFieldBegin(field, rtf, records);
        }
        return false;
    };

    renderEnd(rtf: rtfDestination, records: number) {
        var field = findParentDestination(this.parser, "field");
        if (field != null) {
            var inst = field.getInst();
            if (inst != null)
                inst.renderFieldEnd(field, rtf, records);
        }
    };
};

var pictGroupDestinationFactory = function (legacy: boolean) {
    return class pictGroupDestinationFactory extends DestinationTextBase {
        _legacy: boolean;

        constructor() {
            super("pict-group");
            this._legacy = legacy;
        }

        isLegacy() {
            return this._legacy;
        }
    };
};

class pictDestination extends DestinationTextBase {
    _type;
    _blob;
    _displaysize: {width: number, height: number};
    _size: {width: number, height: number};
    parser: GlobalState;
    inst: Document;

    constructor(parser: GlobalState, inst: Document){
        super("pict");
        this._type = null;
        this._blob = null;
        this._displaysize = {
            width: null,
            height: null
        };
        this._size = {
            width: null,
            height: null
        };
        this.parser = parser;
        this.inst = inst;
    };

    _setPropValueRequired(member: string, prop) {
        return function (param: number) {
            if (param == null)
                throw new RTFJSError("Picture property has no value");
            Helper.log("[pict] set " + member + "." + prop + " = " + param);
            var obj = (member != null ? this[member] : this);
            obj[prop] = param;
        };
    };

    _pictHandlers = {
        picw: this._setPropValueRequired("_size", "width"),
        pich: this._setPropValueRequired("_size", "height"),
        picwgoal: this._setPropValueRequired("_displaysize", "width"),
        pichgoal: this._setPropValueRequired("_displaysize", "height")
    };

    _pictTypeHandler = {
        emfblip: (function () {
            if (typeof EMFJS !== "undefined") {
                return function () {
                    return {
                        load: function () {
                            try {
                                return new EMFJS.Renderer(this._blob);
                            } catch (e) {
                                if (e instanceof EMFJS.Error)
                                    return e.message;
                                else
                                    throw e;
                            }
                        },
                        render: function (img) {
                            return img.render({
                                width: Helper._twipsToPt(this._displaysize.width) + "pt",
                                height: Helper._twipsToPt(this._displaysize.height) + "pt",
                                wExt: this._size.width,
                                hExt: this._size.width,
                                xExt: this._size.width,
                                yExt: this._size.height,
                                mapMode: 8
                            });
                        }
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
        wmetafile: (function () {
            if (typeof WMFJS !== "undefined") {
                return function (param) {
                    if (param == null || param < 0 || param > 8)
                        throw new RTFJSError("Insufficient metafile information");
                    return {
                        load: function () {
                            try {
                                return new WMFJS.Renderer(this._blob);
                            } catch (e) {
                                if (e instanceof WMFJS.Error)
                                    return e.message;
                                else
                                    throw e;
                            }
                        },
                        render: function (img) {
                            return img.render({
                                width: Helper._twipsToPt(this._displaysize.width) + "pt",
                                height: Helper._twipsToPt(this._displaysize.height) + "pt",
                                xExt: this._size.width,
                                yExt: this._size.height,
                                mapMode: param
                            });
                        }
                    };
                };
            } else {
                return "";
            }
        })(),
        dibitmap: "", // TODO
        wbitmap: "" // TODO
    };

    handleKeyword(keyword: string, param: number) {
        var handler = this._pictHandlers[keyword];
        if (handler != null) {
            handler.call(this, param);
            return true;
        }
        var inst = this;
        var type = this._pictTypeHandler[keyword];
        if (type != null) {
            if (this._type == null) {
                if (typeof type === "function") {
                    var info = type.call(this, param);
                    if (info != null) {
                        if (typeof info === "string") {
                            this._type = info;
                        } else {
                            this._type = function () {
                                var renderer = info.load.call(inst);
                                if (renderer != null) {
                                    if (typeof renderer === "string")
                                        return renderer;
                                    return function () {
                                        return info.render.call(inst, renderer);
                                    };
                                }
                            };
                        }
                    }
                } else {
                    this._type = type;
                }
            }
            return true;
        }
        return false;
    };

    handleBlob(blob: ArrayBuffer) {
        this._blob = blob;
    };

    apply(rendering=false) {
        if (this._type == null)
            throw new RTFJSError("Picture type unknown or not specified");
        //if (this._size.width == null || this._size.height == null)
        //    throw new RTFJSError("Picture dimensions not specified");
        //if (this._displaysize.width == null || this._displaysize.height == null)
        //    throw new RTFJSError("Picture display dimensions not specified");

        var pictGroup = findParentDestination(this.parser, "pict-group");
        var isLegacy = (pictGroup != null ? pictGroup.isLegacy() : null);

        var type = this._type;
        if (typeof type === "function") {
            // type is the trampoline function that executes the .load function
            // and returns a renderer trampoline that ends up calling the .render function
            if (this._blob == null) {
                this._blob = Helper._hexToBlob(this.text);
                if (this._blob == null)
                    throw new RTFJSError("Could not parse picture data");
                delete this.text;
            }

            var info = this;
            var doRender = function (rendering) {
                let inst = this._doc;
                var pictrender = type.call(info);
                if (pictrender != null) {
                    if (typeof pictrender === "string") {
                        Helper.log("[pict] Could not load image: " + pictrender);
                        if (rendering) {
                            return this.buildPicture(pictrender, null);
                        } else {
                            inst.addIns(function () {
                                this.picture(pictrender, null);
                            });
                        }
                    } else {
                        if (typeof pictrender !== "function")
                            throw new RTFJSError("Expected a picture render function");
                        if (rendering) {
                            return this.buildRenderedPicture(pictrender());
                        } else {
                            inst.addIns(function () {
                                this.renderedPicture(pictrender());
                            });
                        }
                    }
                }
            };

            if (this.inst._settings.onPicture != null) {
                this.inst.addIns((function (isLegacy) {
                    return function () {
                        var inst = this._doc;
                        var renderer = this;
                        var elem = inst._settings.onPicture.call(inst, isLegacy, function () {
                            return doRender.call(renderer, true);
                        });
                        if (elem != null)
                            this.appendElement(elem);
                    };
                })(isLegacy));
            } else {
                return {
                    isLegacy,
                    element: doRender.call(this.parser.renderer, rendering)
                };
            }
        } else if (typeof type === "string") {
            var text = this.text;
            var blob = this._blob;

            var doRender = function (rendering) {
                var bin = blob != null ? Helper._blobToBinary(blob) : Helper._hexToBinary(text);
                if (type !== "") {
                    if (rendering) {
                        return this.buildPicture(type, bin);
                    } else {
                        this._doc.addIns(function () {
                            this.picture(type, bin);
                        });
                    }
                } else {
                    if (rendering) {
                        return this.buildPicture("Unsupported image format", null);
                    } else {
                        this._doc.addIns(function () {
                            this.picture("Unsupported image format", null);
                        });
                    }
                }
            };

            if (this.inst._settings.onPicture != null) {
                this.inst.addIns((function (isLegacy) {
                    return function () {
                        var inst = this._doc;
                        var renderer = this;
                        var elem = inst._settings.onPicture.call(inst, isLegacy, function () {
                            return doRender.call(renderer, true);
                        });
                        if (elem != null)
                            this.appendElement(elem);
                    };
                })(isLegacy));
            } else {
                return {
                    isLegacy,
                    element: doRender.call(this.parser.renderer, rendering)
                };
            }
        }

        delete this.text;
    }
};

var requiredDestinationFactory = function (name) {
    return class requiredDestination extends DestinationBase {
        constructor(){
            super(name);
        }
    };
};

export const destinations = {
    rtf: rtfDestination,
    info: infoDestination,
    title: metaPropertyDestinationFactory("title"),
    subject: metaPropertyDestinationFactory("subject"),
    author: metaPropertyDestinationFactory("author"),
    manager: metaPropertyDestinationFactory("manager"),
    company: metaPropertyDestinationFactory("company"),
    operator: metaPropertyDestinationFactory("operator"),
    category: metaPropertyDestinationFactory("category"),
    keywords: metaPropertyDestinationFactory("keywords"),
    doccomm: metaPropertyDestinationFactory("doccomm"),
    hlinkbase: metaPropertyDestinationFactory("hlinkbase"),
    generator: genericPropertyDestinationFactory("rtf", "generator"),
    creatim: metaPropertyTimeDestinationFactory("creatim"),
    revtim: metaPropertyTimeDestinationFactory("revtim"),
    printim: metaPropertyTimeDestinationFactory("printim"),
    buptim: metaPropertyTimeDestinationFactory("buptim"),
    fonttbl: fonttblDestination,
    falt: genericSubTextPropertyDestinationFactory("falt", "fonttbl:sub", "setAltFontName"),
    colortbl: colortblDestination,
    stylesheet: stylesheetDestination,
    footer: requiredDestinationFactory("footer"),
    footerf: requiredDestinationFactory("footerf"),
    footerl: requiredDestinationFactory("footerl"),
    footerr: requiredDestinationFactory("footerr"),
    footnote: requiredDestinationFactory("footnote"),
    ftncn: requiredDestinationFactory("ftncn"),
    ftnsep: requiredDestinationFactory("ftnsep"),
    ftnsepc: requiredDestinationFactory("ftnsepc"),
    header: requiredDestinationFactory("header"),
    headerf: requiredDestinationFactory("headerf"),
    headerl: requiredDestinationFactory("headerl"),
    headerr: requiredDestinationFactory("headerr"),
    pict: pictDestination,
    shppict: pictGroupDestinationFactory(false),
    nonshppict: pictGroupDestinationFactory(true),
    private1: requiredDestinationFactory("private1"),
    rxe: requiredDestinationFactory("rxe"),
    tc: requiredDestinationFactory("tc"),
    txe: requiredDestinationFactory("txe"),
    xe: requiredDestinationFactory("xe"),
    field: fieldDestination,
    fldinst: fldinstDestination,
    fldrslt: fldrsltDestination,
};
