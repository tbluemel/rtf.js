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

import { SymbolTable } from '../Symboltable';
import { RenderPap } from './RenderPap';
import cptable from 'codepage';
import { Helper, RTFJSError } from '../Helper';
import { RenderChp } from './RenderChp';
import { Document } from '../Document';
import { State } from './Containers';
import { destinations } from './Destinations';
import { Renderer } from '../Renderer';

export class Parser {
    inst: Document;

    constructor(document: Document) {
        this.inst = document;
    }

    parse(blob: ArrayBuffer, renderer: Renderer): Promise<void> {
        var inst = this.inst;
        var parseKeyword, processKeyword, appendText, parseLoop;

        var parser = {
            data: new Uint8Array(blob),
            pos: 0,
            line: 1,
            column: 0,
            state: null,
            version: null,
            text: "",
            codepage: 1252,
            _asyncTasks: [],
            renderer: renderer,
            eof: function () {
                return this.pos >= this.data.length;
            },
            readChar: function () {
                if (this.pos < this.data.length) {
                    parser.column++;
                    return String.fromCharCode(this.data[this.pos++]);
                }

                throw new RTFJSError("Unexpected end of file");
            },
            unreadChar: function () {
                if (this.pos > 0) {
                    parser.column--;
                    this.pos--;
                } else {
                    throw new RTFJSError("Already at beginning of file");
                }
            },
            readBlob: function (cnt) {
                if (this.pos + cnt > this.data.length)
                    throw new RTFJSError("Cannot read binary data: too long");
                var buf = new ArrayBuffer(cnt);
                var view = new Uint8Array(buf);
                for (var i = 0; i < cnt; i++)
                    view[i] = this.data[this.pos + i];
                return buf;
            }
        };

        var applyDestination = function (always) {
            var dest = parser.state.destination;
            if (dest != null) {
                if (always || parser.state.parent == null || parser.state.parent.destination != parser.state.destination) {
                    if (dest.apply != null)
                        dest.apply();
                    parser.state.destination = null;
                }
            }
        };

        var applyText = function () {
            if (parser.text.length > 0) {
                var dest = parser.state.destination;
                if (dest == null)
                    throw new RTFJSError("Cannot route text to destination");
                if (dest != null && dest.appendText != null && !parser.state.skipdestination)
                    dest.appendText(parser.text);
                parser.text = "";
            }
        }

        var pushState = function (forceSkip) {
            parser.state = new State(parser.state);
            if (forceSkip)
                parser.state.skipdestination = true;

            var dest = parser.state.destination;
            if (dest != null && !parser.state.skipdestination) {
                if (dest.sub != null) {
                    var sub = dest.sub();
                    if (sub != null)
                        parser.state.destination = sub;
                }
            }
        };

        var popState = function () {
            var state = parser.state;
            if (state == null)
                throw new RTFJSError("Unexpected end of state");

            applyText();
            if (state.parent == null || state.destination != state.parent.destination)
                applyDestination(true);
            parser.state = state.parent;

            if (parser.state !== null) {
                inst._ins.push(
                    (function (state) {
                        return function () {
                            this.setChp(new RenderChp(state.chp));
                        }
                    })(parser.state)
                );
                inst._ins.push(
                    (function (state) {
                        return function () {
                            this.setPap(new RenderPap(state.pap));
                        }
                    })(parser.state)
                );
            }
            return parser.state;
        };

        var changeDestination = function (name, param) {
            applyText();
            var handler = destinations[name];
            if (handler != null) {
                applyDestination(false);
                parser.state.destination = new handler(parser, inst, name, param);
                return true;
            }
            return false;
        };

        processKeyword = function (keyword, param) {
            var first = parser.state.first;
            if (first) {
                if (keyword == "*") {
                    parser.state.skipunknowndestination = true;
                    return;
                }

                parser.state.first = false;
            }

            //if (param != null)
            //    Helper.log("keyword " + keyword + " with param " + param);
            //else
            //    Helper.log("keyword " + keyword);

            if (parser.state.bindata > 0)
                throw new RTFJSError("Keyword encountered within binary data");

            // Reset if we unexpectedly encounter a keyword
            parser.state.skipchars = 0;
            switch (keyword) {
                case "\n":
                    return "\n";
                case "\r":
                    return "\r";
                case "tab":
                    return "\t";
                case "ldblquote":
                    return "“";
                case "rdblquote":
                    return "”";
                case "{":
                case "}":
                case "\\":
                    return keyword;

                case "uc":
                    if (param != null && param >= 0)
                        parser.state.ucn = param;
                    break;
                case "u":
                    if (param != null) {
                        if (param < 0)
                            param += 65536;
                        if (param < 0 || param > 65535)
                            throw new RTFJSError("Invalid unicode character encountered");

                        var symbol = SymbolTable[param.toString(16).substring(2)]
                        appendText(symbol !== undefined ? symbol : String.fromCharCode(param));
                        parser.state.skipchars = parser.state.ucn;
                    }
                    return;

                case "bin":
                    if (param == null)
                        throw new RTFJSError("Binary data is missing length");
                    if (param < 0)
                        throw new RTFJSError("Binary data with invalid length");
                    parser.state.bindata = param;
                    return;

                case "upr":
                    parseLoop(true, null); // skip the first sub destination (ansi)
                    // this will be followed by a \ud sub destination
                    return;
                case "ud":
                    return;

                default:
                    if (!parser.state.skipdestination) {
                        if (first) {
                            if (!changeDestination(keyword, param)) {
                                var handled = false;
                                var dest = parser.state.destination;
                                if (dest != null) {
                                    if (dest.handleKeyword != null)
                                        handled = dest.handleKeyword(keyword, param);
                                }
                                if (!handled && parser.state.skipunknowndestination)
                                    parser.state.skipdestination = true;
                            }
                        } else {
                            applyText();
                            var dest = parser.state.destination;
                            if (dest != null) {
                                if (dest.handleKeyword != null)
                                    dest.handleKeyword(keyword, param);
                            } else {
                                Helper.log("Unhandled keyword: " + keyword + " param: " + param);
                            }
                        }
                    }
                    return;
            }

            parser.state.skipdestination = false;
        };

        appendText = function (text) {
            // Handle characters not found in codepage
            text = text ? text : "";

            parser.state.first = false;
            if (parser.state.skipchars > 0) {
                var len = text.length;
                if (parser.state.skipchars >= len) {
                    parser.state.skipchars -= len;
                    return;
                }

                if (parser.state.destination == null || !parser.state.skipdestination)
                    parser.text += text.slice(parser.state.skipchars);
                parser.state.skipchars = 0;
            } else if (parser.state.destination == null || !parser.state.skipdestination) {
                parser.text += text;
            }
        };

        var applyBlob = function (blob) {
            parser.state.first = false;
            applyText();
            if (parser.state.skipchars > 0) {
                // \bin and all its data is considered one character for skipping purposes
                parser.state.skipchars--;
            } else {
                var dest = parser.state.destination;
                if (dest == null)
                    throw new RTFJSError("Cannot route binary to destination");
                if (dest != null && dest.handleBlob != null && !parser.state.skipdestination)
                    dest.handleBlob(blob);
            }
        };

        parseKeyword = function (process) {
            if (parser.state == null)
                throw new RTFJSError("No state");

            var param;
            var ch = parser.readChar();
            if (!Helper._isalpha(ch)) {
                if (ch == "\'") {
                    var hex = parser.readChar() + parser.readChar();
                    if (parser.state.pap.charactertype === Helper.CHARACTER_TYPE.DOUBLE) {
                        parser.readChar();
                        parser.readChar();
                        hex += parser.readChar() + parser.readChar();
                    }
                    param = Helper._parseHex(hex);
                    if (isNaN(param))
                        throw new RTFJSError("Could not parse hexadecimal number");

                    if (process != null) {
                        // Looking for current fonttbl charset
                        var codepage = parser.codepage;
                        if (parser.state.chp.hasOwnProperty("fontfamily")) {
                            var idx = parser.state.chp.fontfamily;
                            if (inst._fonts != undefined && inst._fonts[idx] != null && inst._fonts[idx].charset != undefined)
                                codepage = inst._fonts[idx].charset;
                        }

                        appendText(cptable[codepage].dec[param]);
                    }
                } else if (process != null) {
                    var text = process(ch, param);
                    if (text != null)
                        appendText(text);
                }
            } else {
                var keyword = ch;
                ch = parser.readChar();
                while (keyword.length < 30 && Helper._isalpha(ch)) {
                    keyword += ch;
                    ch = parser.readChar();
                }

                var num;
                if (ch == "-") {
                    num = "-";
                    ch = parser.readChar();
                } else {
                    num = "";
                }

                if (Helper._isdigit(ch)) {
                    do {
                        num += ch;
                        ch = parser.readChar();
                    } while (num.length < 20 && Helper._isdigit(ch));

                    if (num.length >= 20)
                        throw new RTFJSError("Param for keyword " + keyword + " too long");

                    param = parseInt(num, 10);
                    if (isNaN(param))
                        throw new RTFJSError("Invalid keyword " + keyword + " param");
                }

                if (ch != " ")
                    parser.unreadChar();

                if (process != null) {
                    var text = process(keyword, param);
                    if (text != null)
                        appendText(text);
                }
            }
        };

        parseLoop = function (skip, process) {
            try {
                var initialState = parser.state;
                main_loop: while (!parser.eof()) {
                    if (parser.state != null && parser.state.bindata > 0) {
                        var blob = parser.readBlob(parser.state.bindata);
                        parser.state.bindata = 0;
                        applyBlob(blob);
                    } else {
                        var ch = parser.readChar();
                        switch (ch) {
                            case "\r":
                                continue;
                            case "\n":
                                parser.line++;
                                parser.column = 0;
                                continue;
                            case "{":
                                pushState(skip);
                                break;
                            case "}":
                                if (initialState == parser.state) {
                                    parser.unreadChar();
                                    break main_loop;
                                }
                                else if (popState() == initialState)
                                    break main_loop;
                                break;
                            case "\\":
                                parseKeyword(!skip ? process : null);
                                break;
                            default:
                                if (!skip)
                                    appendText(ch);
                                break;
                        }
                    }
                }
            } catch (error) {
                if (error instanceof RTFJSError) {
                    error.message += " (line: " + parser.line + "; column: " + parser.column + ")";
                }
                throw error;
            }
        };

        if (parser.data.length > 1 && String.fromCharCode(parser.data[0]) == "{") {
            parseLoop(false, processKeyword);
            return Promise.all(parser._asyncTasks).then(()=>{});
        }
        if (parser.version == null)
            throw new RTFJSError("Not a valid rtf document");
        if (parser.state != null)
            throw new RTFJSError("File truncated");
    }
}
