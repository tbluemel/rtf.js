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

import { EMFJSError } from "./Helper";

export class Blob {
    blob;
    data;
    pos;

    constructor(blob, offset?) {
        if (blob instanceof Blob) {
            this.blob = blob.blob;
            this.data = blob.data;
            this.pos = offset || blob.pos;
        } else {
            this.blob = blob;
            this.data = new Uint8Array(blob);
            this.pos = offset || 0;
        }
    }

    eof() {
        return this.pos >= this.data.length;
    };

    seek(newpos) {
        if (newpos < 0 || newpos > this.data.length)
            throw new EMFJSError("Invalid seek position");
        this.pos = newpos;
    };

    skip(cnt) {
        var newPos = this.pos + cnt;
        if (newPos > this.data.length)
            throw new EMFJSError("Unexpected end of file");
        this.pos = newPos;
    };

    readBinary(cnt) {
        var end = this.pos + cnt;
        if (end > this.data.length)
            throw new EMFJSError("Unexpected end of file");
        var ret = "";
        while (cnt-- > 0)
            ret += String.fromCharCode(this.data[this.pos++]);
        return ret;
    };

    readInt8() {
        if (this.pos + 1 > this.data.length)
            throw new EMFJSError("Unexpected end of file");
        return this.data[this.pos++];
    };

    readUint8() {
        return this.readInt8() >>> 0;
    };

    readInt32() {
        if (this.pos + 4 > this.data.length)
            throw new EMFJSError("Unexpected end of file");
        var val = this.data[this.pos++];
        val |= this.data[this.pos++] << 8;
        val |= this.data[this.pos++] << 16;
        val |= this.data[this.pos++] << 24;
        return val;
    };

    readUint32() {
        return this.readInt32() >>> 0;
    };

    readUint16() {
        if (this.pos + 2 > this.data.length)
            throw new EMFJSError("Unexpected end of file");
        var val = this.data[this.pos++];
        val |= this.data[this.pos++] << 8;
        return val;
    };

    readInt16() {
        var val = this.readUint16();
        if (val > 32767)
            val -= 65536;
        return val;
    };

    readString(length) {
        if (this.pos + length > this.data.length)
            throw new EMFJSError("Unexpected end of file");
        var ret = "";
        for (var i = 0; i < length; i++)
            ret += String.fromCharCode(this.data[this.pos++] >>> 0);
        return ret;
    };

    readNullTermString(maxSize) {
        var ret = "";
        if (maxSize > 0) {
            maxSize--;
            for (var i = 0; i < maxSize; i++) {
                if (this.pos + i + 1 > this.data.length)
                    throw new EMFJSError("Unexpected end of file");
                var byte = this.data[this.pos + i] >>> 0;
                if (byte == 0)
                    break;
                ret += String.fromCharCode(byte);
            }
        }
        return ret;
    };

    readFixedSizeUnicodeString(fixedSizeChars) {
        var ret = "";
        for (var i = 0; i < fixedSizeChars; i++) {
            var charCode = this.readUint16();
            if (charCode == 0) {
                if (++i < fixedSizeChars)
                    this.skip((fixedSizeChars - i) * 2);
                break;
            }
            ret += String.fromCharCode(charCode);
        }
        return ret;
    };
};
