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

import { Helper } from '../Helper';
import { Renderer } from '../Renderer';
import { Destination } from './Destinations';

export class Chp {
    bold: boolean;
    underline: string;
    italic: boolean;
    strikethrough: boolean;
    dblstrikethrough: boolean;
    colorindex: number;
    fontsize: number;
    fontfamily: number;

    constructor(parent: Chp) {
        if (parent != null) {
            this.bold = parent.bold;
            this.underline = parent.underline;
            this.italic = parent.italic;
            this.strikethrough = parent.strikethrough;
            this.dblstrikethrough = parent.dblstrikethrough;
            this.colorindex = parent.colorindex;
            this.fontsize = parent.fontsize;
            this.fontfamily = parent.fontfamily;
        } else {
            this.bold = false;
            this.underline = Helper.UNDERLINE.NONE;
            this.italic = false;
            this.strikethrough = false;
            this.dblstrikethrough = false;
            this.colorindex = 0;
            this.fontsize = 24;
        }
    }
};

export class Pap {
    indent: {left: number, right: number, firstline: number};
    justification: string;
    spacebefore: number;
    spaceafter: number;
    charactertype: string;

    constructor(parent: Pap) {
        if (parent != null) {
            this.indent = {
                left: parent.indent.left,
                right: parent.indent.right,
                firstline: parent.indent.firstline
            };
            this.justification = parent.justification;
            this.spacebefore = parent.spacebefore;
            this.spaceafter = parent.spaceafter;
            this.charactertype = parent.charactertype;
        } else {
            this.indent = {
                left: 0,
                right: 0,
                firstline: 0
            };
            this.justification = Helper.JUSTIFICATION.LEFT;
            this.spacebefore = 0;
            this.spaceafter = 0;
        }
    }
};

export class Sep {
    columns: number;
    breaktype: string;
    pagenumber: {x: number, y: number};
    pagenumberformat: string;

    constructor(parent: Sep) {
        if (parent != null) {
            this.columns = parent.columns;
            this.breaktype = parent.breaktype;
            this.pagenumber = {
                x: parent.pagenumber.x,
                y: parent.pagenumber.y
            };
            this.pagenumberformat = parent.pagenumberformat;
        } else {
            this.columns = 0;
            this.breaktype = Helper.BREAKTYPE.NONE;
            this.pagenumber = {
                x: 0,
                y: 0,
            };
            this.pagenumberformat = Helper.PAGENUMBER.DECIMAL;
        }
    }
};

export class Dop {
    width: number;
    height: number;
    margin: {left: number, top: number, right: number, bottom: number};
    pagenumberstart: number;
    facingpages: boolean;
    landscape: boolean;

    constructor(parent: Dop) {
        if (parent != null) {
            this.width = parent.width;
            this.height = parent.height;
            this.margin = {
                left: parent.margin.left,
                top: parent.margin.top,
                right: parent.margin.right,
                bottom: parent.margin.bottom
            };
            this.pagenumberstart = parent.pagenumberstart;
            this.facingpages = parent.facingpages;
            this.landscape = parent.landscape;
        } else {
            this.width = 0;
            this.height = 0;
            this.margin = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
            this.pagenumberstart = 0;
            this.facingpages = false;
            this.landscape = false;
        }
    }
};

export class State {
    parent: State;
    first: boolean;
    skipchars: number;
    bindata: number;
    chp: Chp;
    pap: Pap;
    sep: Sep;
    dop: Dop;
    destination: Destination;
    skipunknowndestination: boolean;
    skipdestination: boolean;
    ucn: number;

    constructor(parent: State) {
        this.parent = parent;
        this.first = true;
        this.skipchars = 0;
        this.bindata = 0;
        if (parent != null) {
            this.chp = new Chp(parent.chp);
            this.pap = new Pap(parent.pap);
            this.sep = new Sep(parent.sep);
            this.dop = new Dop(parent.dop);
            this.destination = parent.destination;
            this.skipunknowndestination = parent.skipunknowndestination;
            this.skipdestination = parent.skipdestination;
            this.ucn = parent.ucn;
        } else {
            this.chp = new Chp(null);
            this.pap = new Pap(null);
            this.sep = new Sep(null);
            this.dop = new Dop(null);
            this.destination = null;
            this.skipunknowndestination = false;
            this.skipdestination = false;
            this.ucn = 1;
        }
    }
};

export class GlobalState {
    data: Uint8Array;
    pos: number;
    line: number;
    column: number;
    state: State;
    version: number;
    text: string;
    codepage: number;
    _asyncTasks: Promise<any>[];
    renderer: Renderer;

    constructor(blob: ArrayBuffer, renderer: Renderer) {
        this.data = new Uint8Array(blob);
        this.pos = 0;
        this.line = 1;
        this.column = 0;
        this.state = null;
        this.version = null;
        this.text = "";
        this. codepage = 1252;
        this._asyncTasks = [];
        this.renderer = renderer;
    }
};
