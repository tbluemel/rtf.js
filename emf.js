/*

The MIT License (MIT)

Copyright (c) 2016 Tom Zoehner

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

if (typeof EMFJS === 'undefined') {
	(typeof window !== 'undefined' ? window : this).EMFJS = {
		Error: function(message) {
			this.message = message;
		},
		loggingEnabled: true,
		log: function(message){
			if(EMFJS.loggingEnabled) {
				console.log(message);
			}
		},
		GDI: {
			RecordType: {
				EMR_POLYBEZIER: 0x00000002,
				EMR_POLYGON: 0x00000003,
				EMR_POLYLINE: 0x00000004,
				EMR_POLYBEZIERTO: 0x00000005,
				EMR_POLYLINETO: 0x00000006,
				EMR_POLYPOLYLINE: 0x00000007,
				EMR_POLYPOLYGON: 0x00000008,
				EMR_SETWINDOWEXTEX: 0x00000009,
				EMR_SETWINDOWORGEX: 0x0000000A,
				EMR_SETVIEWPORTEXTEX: 0x0000000B,
				EMR_SETVIEWPORTORGEX: 0x0000000C,
				EMR_SETBRUSHORGEX: 0x0000000D,
				EMR_EOF: 0x0000000E,
				EMR_SETPIXELV: 0x0000000F,
				EMR_SETMAPPERFLAGS: 0x00000010,
				EMR_SETMAPMODE: 0x00000011,
				EMR_SETBKMODE: 0x00000012,
				EMR_SETPOLYFILLMODE: 0x00000013,
				EMR_SETROP2: 0x00000014,
				EMR_SETSTRETCHBLTMODE: 0x00000015,
				EMR_SETTEXTALIGN: 0x00000016,
				EMR_SETCOLORADJUSTMENT: 0x00000017,
				EMR_SETTEXTCOLOR: 0x00000018,
				EMR_SETBKCOLOR: 0x00000019,
				EMR_OFFSETCLIPRGN: 0x0000001A,
				EMR_MOVETOEX: 0x0000001B,
				EMR_SETMETARGN: 0x0000001C,
				EMR_EXCLUDECLIPRECT: 0x0000001D,
				EMR_INTERSECTCLIPRECT: 0x0000001E,
				EMR_SCALEVIEWPORTEXTEX: 0x0000001F,
				EMR_SCALEWINDOWEXTEX: 0x00000020,
				EMR_SAVEDC: 0x00000021,
				EMR_RESTOREDC: 0x00000022,
				EMR_SETWORLDTRANSFORM: 0x00000023,
				EMR_MODIFYWORLDTRANSFORM: 0x00000024,
				EMR_SELECTOBJECT: 0x00000025,
				EMR_CREATEPEN: 0x00000026,
				EMR_CREATEBRUSHINDIRECT: 0x00000027,
				EMR_DELETEOBJECT: 0x00000028,
				EMR_ANGLEARC: 0x00000029,
				EMR_ELLIPSE: 0x0000002A,
				EMR_RECTANGLE: 0x0000002B,
				EMR_ROUNDRECT: 0x0000002C,
				EMR_ARC: 0x0000002D,
				EMR_CHORD: 0x0000002E,
				EMR_PIE: 0x0000002F,
				EMR_SELECTPALETTE: 0x00000030,
				EMR_CREATEPALETTE: 0x00000031,
				EMR_SETPALETTEENTRIES: 0x00000032,
				EMR_RESIZEPALETTE: 0x00000033,
				EMR_REALIZEPALETTE: 0x00000034,
				EMR_EXTFLOODFILL: 0x00000035,
				EMR_LINETO: 0x00000036,
				EMR_ARCTO: 0x00000037,
				EMR_POLYDRAW: 0x00000038,
				EMR_SETARCDIRECTION: 0x00000039,
				EMR_SETMITERLIMIT: 0x0000003A,
				EMR_BEGINPATH: 0x0000003B,
				EMR_ENDPATH: 0x0000003C,
				EMR_CLOSEFIGURE: 0x0000003D,
				EMR_FILLPATH: 0x0000003E,
				EMR_STROKEANDFILLPATH: 0x0000003F,
				EMR_STROKEPATH: 0x00000040,
				EMR_FLATTENPATH: 0x00000041,
				EMR_WIDENPATH: 0x00000042,
				EMR_SELECTCLIPPATH: 0x00000043,
				EMR_ABORTPATH: 0x00000044,
				EMR_COMMENT: 0x00000046,
				EMR_FILLRGN: 0x00000047,
				EMR_FRAMERGN: 0x00000048,
				EMR_INVERTRGN: 0x00000049,
				EMR_PAINTRGN: 0x0000004A,
				EMR_EXTSELECTCLIPRGN: 0x0000004B,
				EMR_BITBLT: 0x0000004C,
				EMR_STRETCHBLT: 0x0000004D,
				EMR_MASKBLT: 0x0000004E,
				EMR_PLGBLT: 0x0000004F,
				EMR_SETDIBITSTODEVICE: 0x00000050,
				EMR_STRETCHDIBITS: 0x00000051,
				EMR_EXTCREATEFONTINDIRECTW: 0x00000052,
				EMR_EXTTEXTOUTA: 0x00000053,
				EMR_EXTTEXTOUTW: 0x00000054,
				EMR_POLYBEZIER16: 0x00000055,
				EMR_POLYGON16: 0x00000056,
				EMR_POLYLINE16: 0x00000057,
				EMR_POLYBEZIERTO16: 0x00000058,
				EMR_POLYLINETO16: 0x00000059,
				EMR_POLYPOLYLINE16: 0x0000005A,
				EMR_POLYPOLYGON16: 0x0000005B,
				EMR_POLYDRAW16: 0x0000005C,
				EMR_CREATEMONOBRUSH: 0x0000005D,
				EMR_CREATEDIBPATTERNBRUSHPT: 0x0000005E,
				EMR_EXTCREATEPEN: 0x0000005F,
				EMR_POLYTEXTOUTA: 0x00000060,
				EMR_POLYTEXTOUTW: 0x00000061,
				EMR_SETICMMODE: 0x00000062,
				EMR_CREATECOLORSPACE: 0x00000063,
				EMR_SETCOLORSPACE: 0x00000064,
				EMR_DELETECOLORSPACE: 0x00000065,
				EMR_GLSRECORD: 0x00000066,
				EMR_GLSBOUNDEDRECORD: 0x00000067,
				EMR_PIXELFORMAT: 0x00000068,
				EMR_DRAWESCAPE: 0x00000069,
				EMR_EXTESCAPE: 0x0000006A,
				EMR_SMALLTEXTOUT: 0x0000006C,
				EMR_FORCEUFIMAPPING: 0x0000006D,
				EMR_NAMEDESCAPE: 0x0000006E,
				EMR_COLORCORRECTPALETTE: 0x0000006F,
				EMR_SETICMPROFILEA: 0x00000070,
				EMR_SETICMPROFILEW: 0x00000071,
				EMR_ALPHABLEND: 0x00000072,
				EMR_SETLAYOUT: 0x00000073,
				EMR_TRANSPARENTBLT: 0x00000074,
				EMR_GRADIENTFILL: 0x00000076,
				EMR_SETLINKEDUFIS: 0x00000077,
				EMR_SETTEXTJUSTIFICATION: 0x00000078,
				EMR_COLORMATCHTOTARGETW: 0x00000079,
				EMR_CREATECOLORSPACEW: 0x0000007A
			},
			MetafileEscapes: {
				NEWFRAME: 0x0001,
				ABORTDOC: 0x0002,
				NEXTBAND: 0x0003,
				SETCOLORTABLE: 0x0004,
				GETCOLORTABLE: 0x0005,
				FLUSHOUT: 0x0006,
				DRAFTMODE: 0x0007,
				QUERYESCSUPPORT: 0x0008,
				SETABORTPROC: 0x0009,
				STARTDOC: 0x000a,
				ENDDOC: 0x000b,
				GETPHYSPAGESIZE: 0x000c,
				GETPRINTINGOFFSET: 0x000d,
				GETSCALINGFACTOR: 0x000e,
				META_ESCAPE_ENHANCED_METAFILE: 0x000f,
				SETPENWIDTH: 0x0010,
				SETCOPYCOUNT: 0x0011,
				SETPAPERSOURCE: 0x0012,
				PASSTHROUGH: 0x0013,
				GETTECHNOLOGY: 0x0014,
				SETLINECAP: 0x0015,
				SETLINEJOIN: 0x0016,
				SETMITERLIMIT: 0x0017,
				BANDINFO: 0x0018,
				DRAWPATTERNRECT: 0x0019,
				GETVECTORPENSIZE: 0x001a,
				GETVECTORBRUSHSIZE: 0x001b,
				ENABLEDUPLEX: 0x001c,
				GETSETPAPERBINS: 0x001d,
				GETSETPRINTORIENT: 0x001e,
				ENUMPAPERBINS: 0x001f,
				SETDIBSCALING: 0x0020,
				EPSPRINTING: 0x0021,
				ENUMPAPERMETRICS: 0x0022,
				GETSETPAPERMETRICS: 0x0023,
				POSTSCRIPT_DATA: 0x0025,
				POSTSCRIPT_IGNORE: 0x0026,
				GETDEVICEUNITS: 0x002a,
				GETEXTENDEDTEXTMETRICS: 0x0100,
				GETPAIRKERNTABLE: 0x0102,
				EXTTEXTOUT: 0x0200,
				GETFACENAME: 0x0201,
				DOWNLOADFACE: 0x0202,
				METAFILE_DRIVER: 0x0801,
				QUERYDIBSUPPORT: 0x0c01,
				BEGIN_PATH: 0x1000,
				CLIP_TO_PATH: 0x1001,
				END_PATH: 0x1002,
				OPEN_CHANNEL: 0x100e,
				DOWNLOADHEADER: 0x100f,
				CLOSE_CHANNEL: 0x1010,
				POSTSCRIPT_PASSTHROUGH: 0x1013,
				ENCAPSULATED_POSTSCRIPT: 0x1014,
				POSTSCRIPT_IDENTIFY: 0x1015,
				POSTSCRIPT_INJECTION: 0x1016,
				CHECKJPEGFORMAT: 0x1017,
				CHECKPNGFORMAT: 0x1018,
				GET_PS_FEATURESETTING: 0x1019,
				MXDC_ESCAPE: 0x101a,
				SPCLPASSTHROUGH2: 0x11d8
			},
			MapMode: {
				MM_TEXT: 1,
				MM_LOMETRIC: 2,
				MM_HIMETRIC: 3,
				MM_LOENGLISH: 4,
				MM_HIENGLISH: 5,
				MM_TWIPS: 6,
				MM_ISOTROPIC: 7,
				MM_ANISOTROPIC: 8
			},
			StretchMode: {
				BLACKONWHITE: 1,
				WHITEONBLACK: 2,
				COLORONCOLOR: 3,
				HALFTONE: 4
			},
			MixMode: {
				TRANSPARENT: 1,
				OPAQUE: 2
			},
			BrushStyle: {
				BS_SOLID: 0,
				BS_NULL: 1,
				BS_HATCHED: 2,
				BS_PATTERN: 3,
				BS_INDEXED: 4,
				BS_DIBPATTERN: 5,
				BS_DIBPATTERNPT: 6,
				BS_PATTERN8X8: 7,
				BS_DIBPATTERN8X8: 8,
				BS_MONOPATTERN: 9
			},
			PenStyle: {
				PS_COSMETIC: 0x00000000,
				PS_ENDCAP_ROUND: 0x00000000,
				PS_JOIN_ROUND: 0x00000000,
				PS_SOLID: 0x00000000,
				PS_DASH: 0x00000001,
				PS_DOT: 0x00000002,
				PS_DASHDOT: 0x00000003,
				PS_DASHDOTDOT: 0x00000004,
				PS_NULL: 0x00000005,
				PS_INSIDEFRAME: 0x00000006,
				PS_USERSTYLE: 0x00000007,
				PS_ALTERNATE: 0x00000008,
				PS_ENDCAP_SQUARE: 0x00000100,
				PS_ENDCAP_FLAT: 0x00000200,
				PS_JOIN_BEVEL: 0x00001000,
				PS_JOIN_MITER: 0x00002000,
				PS_GEOMETRIC: 0x00010000
			},
			PolyFillMode: {
				ALTERNATE: 1,
				WINDING: 2
			}
		},
		_uniqueId: 0,
		_makeUniqueId: function(prefix) {
			return "EMFJS_" + prefix + (this._uniqueId++);
		}
	};
}

EMFJS.Blob = function(blob, offset) {
	if (blob instanceof EMFJS.Blob) {
		this.blob = blob.blob;
		this.data = blob.data;
		this.pos =  offset || blob.pos;
	} else {
		this.blob = blob;
		this.data = new Uint8Array(blob);
		this.pos =  offset || 0;
	}
};

EMFJS.Blob.prototype.eof = function() {
	return this.pos >= this.data.length;
};

EMFJS.Blob.prototype.seek = function(newpos) {
	if (newpos < 0 || newpos > this.data.length)
		throw new EMFJS.Error("Invalid seek position");
	this.pos = newpos;
};

EMFJS.Blob.prototype.skip = function(cnt) {
	var newPos = this.pos + cnt;
	if (newPos > this.data.length)
		throw new EMFJS.Error("Unexpected end of file");
	this.pos = newPos;
};

EMFJS.Blob.prototype.readBinary = function(cnt) {
	var end = this.pos + cnt;
	if (end > this.data.length)
		throw new EMFJS.Error("Unexpected end of file");
	var ret = "";
	while (cnt-- > 0)
		ret += String.fromCharCode(this.data[this.pos++]);
	return ret;
};

EMFJS.Blob.prototype.readInt8 = function() {
	if (this.pos + 1 > this.data.length)
		throw new EMFJS.Error("Unexpected end of file");
	return this.data[this.pos++];
};

EMFJS.Blob.prototype.readUint8 = function() {
	return this.readInt8() >>> 0;
};

EMFJS.Blob.prototype.readInt32 = function() {
	if (this.pos + 4 > this.data.length)
		throw new EMFJS.Error("Unexpected end of file");
	var val = this.data[this.pos++];
	val |= this.data[this.pos++] << 8;
	val |= this.data[this.pos++] << 16;
	val |= this.data[this.pos++] << 24;
	return val;
};

EMFJS.Blob.prototype.readUint32 = function() {
	return this.readInt32() >>> 0;
};

EMFJS.Blob.prototype.readUint16 = function() {
	if (this.pos + 2 > this.data.length)
		throw new EMFJS.Error("Unexpected end of file");
	var val = this.data[this.pos++];
	val |= this.data[this.pos++] << 8;
	return val;
};

EMFJS.Blob.prototype.readInt16 = function() {
	var val = this.readUint16();
	if (val > 32767)
		val -= 65536;
	return val;
};

EMFJS.Blob.prototype.readString = function(length) {
	if (this.pos + length > this.data.length)
		throw new EMFJS.Error("Unexpected end of file");
	var ret = "";
	for (var i = 0; i < length; i++)
		ret += String.fromCharCode(this.data[this.pos++] >>> 0);
	return ret;
};

EMFJS.Blob.prototype.readNullTermString = function(maxSize) {
	var ret = "";
	if (maxSize > 0) {
		maxSize--;
		for (var i = 0; i < maxSize; i++) {
			if (this.pos + i + 1 > this.data.length)
				throw new EMFJS.Error("Unexpected end of file");
			var byte = this.data[this.pos + i] >>> 0;
			if (byte == 0)
				break;
			ret += String.fromCharCode(byte);
		}
	}
	return ret;
};

EMFJS.ColorRef = function(reader, r, g, b) {
	if (reader != null) {
		this.r = reader.readUint8();
		this.g = reader.readUint8();
		this.b = reader.readUint8();
		reader.skip(1);
	} else {
		this.r = r;
		this.g = g;
		this.b = b;
	}
};

EMFJS.ColorRef.prototype.clone = function() {
	return new EMFJS.ColorRef(null, this.r, this.g, this.b);
};

EMFJS.ColorRef.prototype.toHex = function() {
	var rgb = (this.r << 16) | (this.g << 8) | this.b;
	return (0x1000000 + rgb).toString(16).slice(1);
};

EMFJS.ColorRef.prototype.toString = function() {
	return "{r: " + this.r + ", g: " + this.g + ", b: " + this.b + "}";
};

EMFJS.PointS = function(reader, x, y) {
	if (reader != null) {
		this.x = reader.readInt16();
		this.y = reader.readInt16();
	} else {
		this.x =  x;
		this.y = y;
	}
};

EMFJS.PointS.prototype.clone = function() {
	return new EMFJS.PointS(null, this.x, this.y);
};

EMFJS.PointS.prototype.toString = function() {
	return "{x: " + this.x + ", y: " + this.y + "}";
};

EMFJS.PointL = function(reader, x, y) {
    if (reader != null) {
        this.x = reader.readInt32();
        this.y = reader.readInt32();
    } else {
        this.x =  x;
        this.y = y;
    }
};

EMFJS.PointL.prototype.clone = function() {
    return new EMFJS.PointS(null, this.x, this.y);
};

EMFJS.PointL.prototype.toString = function() {
    return "{x: " + this.x + ", y: " + this.y + "}";
};

EMFJS.RectL = function(reader, left, top, right, bottom) {
	if (reader != null) {
		this.left = reader.readInt32();
		this.top = reader.readInt32();
		this.right = reader.readInt32();
		this.bottom = reader.readInt32();
	} else {
		this.bottom = bottom;
		this.right = right;
		this.top = top;
		this.left = left;
	}
};

EMFJS.RectL.prototype.clone = function() {
	return new EMFJS.RectL(null, this.left, this.top, this.right, this.bottom);
};

EMFJS.RectL.prototype.toString = function() {
	return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
};

EMFJS.RectL.prototype.empty = function() {
	return this.left >= this.right || this.top >= this.bottom;
};

EMFJS.RectL.prototype.intersect = function(rectL) {
	if (this.empty() || rectL.empty())
		return null;
	if (this.left >= rectL.right || this.top >= rectL.bottom ||
		this.right <= rectL.left || this.bottom <= rectL.top) {
		return null;
	}
	return new EMFJS.RectL(null, Math.max(this.left, rectL.left), Math.max(this.top, rectL.top), Math.min(this.right, rectL.right), Math.min(this.bottom, rectL.bottom));
};

EMFJS.Obj = function(type) {
	this.type = type;
}

EMFJS.Obj.prototype.clone = function() {
	throw new EMFJS.Error("clone not implemented");
}

EMFJS.Obj.prototype.toString = function() {
	throw new EMFJS.Error("toString not implemented");
}

EMFJS.Font = function(reader, copy) {
	EMFJS.Obj.call(this, "font");
	if (reader != null) {
		this.height = reader.readInt16();
		this.width = reader.readInt16();
		this.escapement = reader.readInt16();
		this.orientation = reader.readInt16();
		this.weight = reader.readInt16();
		this.italic = reader.readUint8();
		this.underline = reader.readUint8();
		this.strikeout = reader.readUint8();
		this.charset = reader.readUint8();
		this.outprecision = reader.readUint8();
		this.clipprecision = reader.readUint8();
		this.quality = reader.readUint8();
		var pitchAndFamily = reader.readUint8();
		this.pitch = pitchAndFamily & 0xf; // TODO: double check
		this.family = (pitchAndFamily >> 6) & 0x3; // TODO: double check

		var dataLength = copy;
		var start = reader.pos;
		this.facename = reader.readNullTermString(Math.min(dataLength - (reader.pos - start), 32));
	} else if (copy != null) {
		this.height = copy.height;
		this.width = copy.width;
		this.escapement = copy.escapement;
		this.orientation = copy.orientation;
		this.weight = copy.weight;
		this.italic = copy.italic;
		this.underline = copy.underline;
		this.strikeout = copy.strikeout;
		this.charset = copy.charset;
		this.outprecision = copy.outprecision;
		this.clipprecision = copy.clipprecision;
		this.quality = copy.quality;
		this.pitch = copy.pitch;
		this.family = copy.family;
		this.facename = copy.facename;
	} else {
		// TODO: Values for a default font?
		this.height = -80;
		this.width = 0;
		this.escapement = 0;
		this.orientation = 0;
		this.weight = 400;
		this.italic = 0;
		this.underline = 0;
		this.strikeout = 0;
		this.charset = 0;
		this.outprecision = 0;
		this.clipprecision = 0;
		this.quality = 0;
		this.pitch = 0;
		this.family = 0;
		this.facename = "Helvetica";
	}
};
EMFJS.Font.prototype = Object.create(EMFJS.Obj.prototype);

EMFJS.Font.prototype.clone = function() {
	return new EMFJS.Font(null, this);
};

EMFJS.Font.prototype.toString = function() {
	//return "{facename: " + this.facename + ", height: " + this.height + ", width: " + this.width + "}";
	return JSON.stringify(this);
};

EMFJS.Brush = function(reader, copy, forceDibPattern) {
	EMFJS.Obj.call(this, "brush");
	if (reader != null) {
		var dataLength = copy;
		var start = reader.pos;

		// if (forceDibPattern === true || forceDibPattern === false) {
			this.style = reader.readUint32();
			// if (forceDibPattern && this.style != EMFJS.GDI.BrushStyle.BS_PATTERN)
			// 	this.style = EMFJS.GDI.BrushStyle.BS_DIBPATTERNPT;
			switch (this.style) {
				case EMFJS.GDI.BrushStyle.BS_SOLID:
					this.color = new EMFJS.ColorRef(reader);
					break;
				// case EMFJS.GDI.BrushStyle.BS_PATTERN:
				// 	reader.skip(forceDibPattern ? 2 : 4);
				// 	this.pattern = new EMFJS.Bitmap16(reader, dataLength - (reader.pos - start));
				// 	break;
				// case EMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
				// 	this.colorusage = forceDibPattern ? reader.readUint16() : reader.readUint32();
				// 	this.dibpatternpt = new EMFJS.DIBitmap(reader, dataLength - (reader.pos - start));
				// 	break;
				case EMFJS.GDI.BrushStyle.BS_HATCHED:
					this.color = new EMFJS.ColorRef(reader);
					this.hatchstyle = reader.readUint32();
					break;
			}
		// } else if (forceDibPattern instanceof EMFJS.PatternBitmap16) {
		// 	this.style = MFJS.GDI.BrushStyle.BS_PATTERN;
		// 	this.pattern = forceDibPattern;
		// }
	} else {
		this.style = copy.style;
		switch (this.style) {
			case EMFJS.GDI.BrushStyle.BS_SOLID:
				this.color = copy.color.clone();
				break;
			// case EMFJS.GDI.BrushStyle.BS_PATTERN:
			// 	this.pattern = copy.pattern.clone();
			// 	break;
			// case EMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
			// 	this.colorusage = copy.colorusage;
			// 	this.dibpatternpt = copy.dibpatternpt;
			// 	break;
			case EMFJS.GDI.BrushStyle.BS_HATCHED:
				this.color = copy.color.clone();
				this.hatchstyle = copy.hatchstyle;
				break;
		}
	}
};
EMFJS.Brush.prototype = Object.create(EMFJS.Obj.prototype);

EMFJS.Brush.prototype.clone = function() {
	return new EMFJS.Brush(null, this);
};

EMFJS.Brush.prototype.toString = function() {
	var ret = "{style: " + this.style;
	switch (this.style) {
		case EMFJS.GDI.BrushStyle.BS_SOLID:
			ret += ", color: " + this.color.toString();
			break;
		case EMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
			ret += ", colorusage: " + this.colorusage;
			break;
		case EMFJS.GDI.BrushStyle.BS_HATCHED:
			ret += ", color: " + this.color.toString() + ", hatchstyle: " + this.hatchstyle;
			break;
	}
	return ret + "}";
};

EMFJS.Pen = function(reader, style, width, color) {
	EMFJS.Obj.call(this, "pen");
	if (reader != null) {
		var style = reader.readUint32();
		this.style = style & 0xFF;
		this.width = (new EMFJS.PointL(reader)).x;
		this.color = new EMFJS.ColorRef(reader);
	} else {
		this.style = style;
		this.width = width;
		this.color = color;
	}
};
EMFJS.Pen.prototype = Object.create(EMFJS.Obj.prototype);

EMFJS.Pen.prototype.clone = function() {
	return new EMFJS.Pen(null, this.style, this.width.clone(), this.color.clone());
};

EMFJS.Pen.prototype.toString = function() {
	return "{style: " + this.style + ", width: " + this.width.toString() + ", color: " + this.color.toString() + "}";
};

EMFJS.PenEx = function(reader, style, width, brushStyle, color, brushHatch, linecap, join) {
	EMFJS.Obj.call(this, "penEx");
	if (reader != null) {
		var style = reader.readUint32();
		this.style = style & 0xFF;
		this.width = reader.readUint32();
		this.brushStyle = reader.readUint32();
		this.color = new EMFJS.ColorRef(reader);
		this.brushHatch = reader.readUint32();
		this.linecap = (style & (EMFJS.GDI.PenStyle.PS_ENDCAP_SQUARE | EMFJS.GDI.PenStyle.PS_ENDCAP_FLAT));
		this.join = (style & (EMFJS.GDI.PenStyle.PS_JOIN_BEVEL | EMFJS.GDI.PenStyle.PS_JOIN_MITER));
	} else {
		this.style = style;
		this.width = width;
		this.brushStyle = brushStyle;
		this.color = color;
		this.brushHatch = brushHatch;
		this.linecap = linecap;
		this.join = join;
	}
};
EMFJS.PenEx.prototype = Object.create(EMFJS.Obj.prototype);

EMFJS.PenEx.prototype.clone = function() {
	return new EMFJS.Pen(null, this.style, this.width, this.brushStyle, this.color.clone(), this.brushHatch , this.linecap, this.join);
};

EMFJS.PenEx.prototype.toString = function() {
	return "{style: " + this.style + ", width: " + this.width + ", brushStyle: 0x" + this.brushStyle.toString(16) +
		", color: " + this.color.toString() + ", brushHatch: 0x" + this.brushHatch.toString(16) + ", linecap: " + this.linecap + ", join: " + this.join + "}";
};

EMFJS.GDIContextState = function(copy, defObjects) {
	if (copy != null) {
		this._svggroup = copy._svggroup;
		this._svgclipChanged = copy._svgclipChanged;
		this._svgtextbkfilter = copy._svgtextbkfilter;
		this.mapmode = copy.mapmode;
		this.stretchmode = copy.stretchmode;
		this.textalign = copy.textalign;
		this.bkmode = copy.bkmode;
		this.textcolor = copy.textcolor.clone();
		this.bkcolor = copy.bkcolor.clone();
		this.polyfillmode = copy.polyfillmode;
		this.wx = copy.wx;
		this.wy = copy.wy;
		this.ww = copy.ww;
		this.wh = copy.wh;
		this.vx = copy.vx;
		this.vy = copy.vy;
		this.vw = copy.vw;
		this.vh = copy.vh;
		this.x = copy.x;
		this.y = copy.y;
		
		this.clip = copy.clip;
		this.ownclip = false;
		
		this.selected = {};
		for (var type in copy.selected)
			this.selected[type] = copy.selected[type];
	} else {
		this._svggroup = null;
		this._svgclipChanged = false;
		this._svgtextbkfilter = null;
		this.Id = null;
		this.mapmode = EMFJS.GDI.MapMode.MM_ANISOTROPIC;
		this.stretchmode = EMFJS.GDI.StretchMode.COLORONCOLOR;
		this.textalign = 0; // TA_LEFT | TA_TOP | TA_NOUPDATECP
		this.bkmode = EMFJS.GDI.MixMode.OPAQUE;
		this.textcolor = new EMFJS.ColorRef(null, 0, 0, 0);
		this.bkcolor = new EMFJS.ColorRef(null, 255, 255, 255);
		this.polyfillmode = EMFJS.GDI.PolyFillMode.ALTERNATE;
		this.wx = 0;
		this.wy = 0;
		this.ww = 0;
		this.wh = 0;
		this.vx = 0;
		this.vy = 0;
		this.vw = 0;
		this.vh = 0;
		this.x = 0;
		this.y = 0;
		
		this.clip = null;
		this.ownclip = false;
		
		this.selected = {};
		for (var type in defObjects) {
			var defObj = defObjects[type];
			this.selected[type] = defObj != null ? defObj.clone() : null;
		}
	}
}

EMFJS.GDIContext = function(svg) {
	this._svg = svg;
	this._svgdefs = null;
	this._svgPatterns = {};
	this._svgClipPaths = {};
	
	this.defObjects = {
		brush: new EMFJS.Brush(null, EMFJS.GDI.BrushStyle.BS_SOLID, new EMFJS.ColorRef(null, 0, 0, 0), false),
		pen: new EMFJS.Pen(null, EMFJS.GDI.PenStyle.PS_SOLID, new EMFJS.PointS(null, 1, 1), new EMFJS.ColorRef(null, 0, 0, 0), 0, 0),
		font: new EMFJS.Font(null, null),
		palette: null,
		region: null
	};
	
	this.state = new EMFJS.GDIContextState(null, this.defObjects);
	this.statestack = [this.state];
	this.objects = {};
};

EMFJS.GDIContext.prototype._pushGroup = function() {
	if (this.state._svggroup == null || this.state._svgclipChanged) {
		this.state._svgclipChanged = false;
		this.state._svgtextbkfilter = null;

		var settings = {
			viewBox: [this.state.vx, this.state.vy, this.state.vw, this.state.vh].join(" "),
			preserveAspectRatio: "none"
		};
		if (this.state.clip != null) {
			EMFJS.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " with clipping");
			settings["clip-path"] = "url(#" + this._getSvgClipPathForRegion(this.state.clip) + ")";
		}
		else
			EMFJS.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " without clipping");
		this.state._svggroup = this._svg.svg(this.state._svggroup,
			this.state.vx, this.state.vy, this.state.vw, this.state.vh, settings);
	}
};

EMFJS.GDIContext.prototype._storeObject = function(obj, idx) {
	if(!idx) {
		var idx = 0;
		while (this.objects[idx.toString()] != null && idx <= 65535)
			idx++;
		if (idx > 65535) {
			EMFJS.log("[gdi] Too many objects!");
			return -1;
		}
	}

	this.objects[idx.toString()] = obj;
	return idx;
};

EMFJS.GDIContext.prototype._getObject = function(objIdx) {
	var obj = this.objects[objIdx.toString()];
	if (obj == null)
		EMFJS.log("[gdi] No object with handle " + objIdx);
	return obj;
};

EMFJS.GDIContext.prototype._selectObject = function(obj) {
	this.state.selected[obj.type] = obj;
	if (obj.type == "region")
		this.state._svgclipChanged = true;
};

EMFJS.GDIContext.prototype._deleteObject = function(objIdx) {
	var obj = this.objects[objIdx.toString()];
	if (obj != null) {
		for (var i = 0; i < this.statestack.length; i++) {
			var state = this.statestack[i];
			if (state.selected[obj.type] == obj)
				state.selected[obj.type] = this.defObjects[obj.type].clone();
		}
		delete this.objects[objIdx.toString()];
		return true;
	}

	EMFJS.log("[gdi] Cannot delete object with invalid handle " + objIdx);
	return false;
};

EMFJS.GDIContext.prototype._getClipRgn = function() {
	if (this.state.clip != null) {
		if (!this.state.ownclip)
			this.state.clip = this.state.clip.clone();
	} else {
		if (this.state.selected.region != null)
			this.state.clip = this.state.selected.region.clone();
		else
			this.state.clip = EMFJS.CreateSimpleRegion(this.state.wx, this.state.wy, this.state.wx + this.state.ww, this.state.wy + this.state.wh);
	}
	this.state.ownclip = true;
	return this.state.clip;
};

EMFJS.GDIContext.prototype.setMapMode = function(mode) {
	EMFJS.log("[gdi] setMapMode: mode=" + mode);
	this.state.mapmode = mode;
	this.state._svggroup = null;
};

EMFJS.GDIContext.prototype.setWindowOrgEx = function(x, y) {
	EMFJS.log("[gdi] setWindowOrgEx: x=" + x + " y=" + y);
	this.state.wx = x;
	this.state.wy = y;
	this.state._svggroup = null;
};

EMFJS.GDIContext.prototype.setWindowExtEx = function(x, y) {
	EMFJS.log("[gdi] setWindowExtEx: x=" + x + " y=" + y);
	this.state.ww = x;
	this.state.wh = y;
	this.state._svggroup = null;
};

EMFJS.GDIContext.prototype.setViewportOrgEx = function(x, y) {
	EMFJS.log("[gdi] setViewportOrgEx: x=" + x + " y=" + y);
	this.state.vx = x;
	this.state.vy = y;
	this.state._svggroup = null;
};

EMFJS.GDIContext.prototype.setViewportExtEx = function(x, y) {
	EMFJS.log("[gdi] setViewportExtEx: x=" + x + " y=" + y);
	this.state.vw = x;
	this.state.vh = y;
	this.state._svggroup = null;
};

EMFJS.GDIContext.prototype.saveDC = function() {
	EMFJS.log("[gdi] saveDC");
	var prevstate = this.state;
	this.state = new EMFJS.GDIContextState(this.state);
	this.statestack.push(prevstate);
	this.state._svggroup = null;
};

EMFJS.GDIContext.prototype.restoreDC = function(saved) {
	EMFJS.log("[gdi] restoreDC: saved=" + saved);
	if (this.statestack.length > 1) {
		if (saved == -1) {
			this.state = this.statestack.pop();
		} else if (saved < -1) {
			throw new EMFJS.Error("restoreDC: relative restore not implemented");
		} else if (saved > 1) {
			throw new EMFJS.Error("restoreDC: absolute restore not implemented");
		}
	} else {
		throw new EMFJS.Error("No saved contexts");
	}

	this.state._svggroup = null;
};

EMFJS.GDIContext.prototype._applyOpts = function(opts, usePen, useBrush, useFont) {
	if (opts == null)
		opts = {};
	if (usePen) {
		var pen = this.state.selected.pen;
		if (pen.style != EMFJS.GDI.PenStyle.PS_NULL) {
			opts.stroke =  "#" + pen.color.toHex(); // TODO: pen style
			if(pen instanceof EMFJS.Pen){
				opts.strokeWidth = pen.width.x; // TODO: is .y ever used?
			}else{
				opts.strokeWidth = pen.width;
			}

			var dotWidth;
			if ((pen.linecap & EMFJS.GDI.PenStyle.PS_ENDCAP_SQUARE) != 0) {
				opts["stroke-linecap"] = "square";
				dotWidth = 1;
			} else if ((pen.linecap & EMFJS.GDI.PenStyle.PS_ENDCAP_FLAT) != 0) {
				opts["stroke-linecap"] = "butt";
				dotWidth = opts.strokeWidth;
			} else {
				opts["stroke-linecap"] = "round";
				dotWidth = 1;
			}

			if ((pen.join & EMFJS.GDI.PenStyle.PS_JOIN_BEVEL) != 0)
				opts["stroke-linejoin"] = "bevel";
			else if ((pen.join & EMFJS.GDI.PenStyle.PS_JOIN_MITER) != 0)
				opts["stroke-linejoin"] = "miter";
			else
				opts["stroke-linejoin"] = "round";

			var dashWidth = opts.strokeWidth * 4;
			var dotSpacing = opts.strokeWidth * 2;
			switch (pen.style) {
				case EMFJS.GDI.PenStyle.PS_DASH:
					opts["stroke-dasharray"] = [dashWidth, dotSpacing].toString();
					break;
				case EMFJS.GDI.PenStyle.PS_DOT:
					opts["stroke-dasharray"] = [dotWidth, dotSpacing].toString();
					break;
				case EMFJS.GDI.PenStyle.PS_DASHDOT:
					opts["stroke-dasharray"] = [dashWidth, dotSpacing, dotWidth, dotSpacing].toString();
					break;
				case EMFJS.GDI.PenStyle.PS_DASHDOTDOT:
					opts["stroke-dasharray"] = [dashWidth, dotSpacing, dotWidth, dotSpacing, dotWidth, dotSpacing].toString();
					break;
			}
		}
	}
	if (useBrush) {
		var brush = this.state.selected.brush;
		switch (brush.style) {
			case EMFJS.GDI.BrushStyle.BS_SOLID:
				opts.fill = "#" + brush.color.toHex();
				break;
			case EMFJS.GDI.BrushStyle.BS_PATTERN:
			case EMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
				opts.fill = "url(#" + this._getSvgPatternForBrush(brush) + ")";
				break;
			case EMFJS.GDI.BrushStyle.BS_NULL:
				opts.fill = "none";
				break;
			default:
				EMFJS.log("[gdi] unsupported brush style: " + brush.style);
				opts.fill = "none";
				break;
		}
	}
	if (useFont) {
		var font = this.state.selected.font;
		opts["font-family"] = font.facename;
		opts["font-size"] = Math.abs(font.height);
		opts["fill"] = "#" + this.state.textcolor.toHex();
	}
	return opts;
};

EMFJS.GDIContext.prototype.rectangle = function(rect) {
	EMFJS.log("[gdi] rectangle: rect=" + rect.toString() + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
	this._pushGroup();

	var opts = this._applyOpts(null, true, true, false);
	this._svg.rect(this.state._svggroup, rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top, opts);
};

EMFJS.GDIContext.prototype.lineTo = function(x, y) {
	EMFJS.log("[gdi] lineTo: x=" + x + " y=" + y + " with pen " + this.state.selected.pen.toString());
	var toX = x;
	var toY = y;
	var fromX = this.state.x;
	var fromY = this.state.y;

	// Update position
	this.state.x = x;
	this.state.y = y;

	this._pushGroup();

	var opts = this._applyOpts(null, true, false, false);
	this._svg.line(this.state._svggroup, fromX, fromY, toX, toY, opts);
}

EMFJS.GDIContext.prototype.moveTo = function(x, y) {
	EMFJS.log("[gdi] moveTo: x=" + x + " y=" + y);
	this.state.x = x;
	this.state.y = y;
}

EMFJS.GDIContext.prototype.polygon16 = function(points) {
	EMFJS.log("[gdi] polygon16: points=" + points + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
	var pts = [];
	for (var i = 0; i < points.length; i++) {
		var point = points[i];
		pts.push([point.x, point.y]);
	}
	this._pushGroup();
	var opts = {
		"fill-rule": this.state.polyfillmode == EMFJS.GDI.PolyFillMode.ALTERNATE ? "evenodd" : "nonzero",
	};
	this._applyOpts(opts, true, true, false);
	this._svg.polygon(this.state._svggroup, pts, opts);
};

EMFJS.GDIContext.prototype.polyline16 = function(points) {
	EMFJS.log("[gdi] polyline16: points=" + points + " with pen " + this.state.selected.pen.toString());
	var pts = [];
	for (var i = 0; i < points.length; i++) {
		var point = points[i];
		pts.push([point.x, point.y]);
	}
	this._pushGroup();
	var opts = this._applyOpts({fill: "none"}, true, false, false);
	this._svg.polyline(this.state._svggroup, pts, opts);
};

EMFJS.GDIContext.prototype.setBkMode = function(bkMode) {
	EMFJS.log("[gdi] setBkMode: bkMode=0x" + bkMode.toString(16));
	this.state.bkmode = bkMode;
};

EMFJS.GDIContext.prototype.setBkColor = function(bkColor) {
	EMFJS.log("[gdi] setBkColor: bkColor=" + bkColor.toString());
	this.state.bkcolor = bkColor;
	this.state._svgtextbkfilter = null;
};

EMFJS.GDIContext.prototype.setPolyFillMode = function(polyFillMode) {
	EMFJS.log("[gdi] setPolyFillMode: polyFillMode=" + polyFillMode);
	this.state.polyfillmode = polyFillMode;
};

EMFJS.GDIContext.prototype.createBrush = function(index, brush) {
	var idx = this._storeObject(brush, index);
	EMFJS.log("[gdi] createBrush: brush=" + brush.toString() + " with handle " + idx);
};

EMFJS.GDIContext.prototype.createPen = function(index, pen) {
	var idx = this._storeObject(pen, index);
	EMFJS.log("[gdi] createPen: pen=" + pen.toString() + " width handle " + idx);
};

EMFJS.GDIContext.prototype.createPenEx = function(index, pen) {
	var idx = this._storeObject(pen, index);
	EMFJS.log("[gdi] createPenEx: pen=" + pen.toString() + " width handle " + idx);
};

EMFJS.GDIContext.prototype.selectObject = function(objIdx, checkType) {
	var obj = this._getObject(objIdx);
	if (obj != null && (checkType == null || obj.type == checkType)) {
		this._selectObject(obj);
		EMFJS.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " selected " + obj.type + ": " + obj.toString() : "[invalid index]"));
	} else {
		EMFJS.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " invalid object type: " + obj.type : "[invalid index]"));
	}
};

EMFJS.GDIContext.prototype.deleteObject = function(objIdx) {
	var ret = this._deleteObject(objIdx);
	EMFJS.log("[gdi] deleteObject: objIdx=" + objIdx + (ret ? " deleted object" : "[invalid index]"));
};

EMFJS.EMFRect16 = function(reader) {
	this.left = reader.readInt16();
	this.top = reader.readInt16();
	this.right = reader.readInt16();
	this.bottom = reader.readInt16();
};

EMFJS.EMFRect16.prototype.toString = function() {
	return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
};

EMFJS.EMFRecords = function(reader, first) {
	this._records = [];
	
	var all = false;
	var curpos = first;
	main_loop: while (!all) {
		reader.seek(curpos);
		var type = reader.readUint32();
		var size = reader.readUint32();
		if (size < 8)
			throw new EMFJS.Error("Invalid record size");
		switch (type) {
			case EMFJS.GDI.RecordType.EMR_EOF:
				all = true;
				break main_loop;
			case EMFJS.GDI.RecordType.EMR_SETMAPMODE:
				var mapMode = reader.readInt32();
				this._records.push(
					(function(mapMode) {
						return function(gdi) {
							gdi.setMapMode(mapMode);
						}
					})(mapMode)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SETWINDOWORGEX:
				var x = reader.readInt32();
				var y = reader.readInt32();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setWindowOrgEx(x, y);
						}
					})(y, x)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SETWINDOWEXTEX:
				var x = reader.readUint32();
				var y = reader.readUint32();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setWindowExtEx(x, y);
						}
					})(y, x)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SETVIEWPORTORGEX:
				var x = reader.readInt32();
				var y = reader.readInt32();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setViewportOrgEx(x, y);
						}
					})(y, x)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SETVIEWPORTEXTEX:
				var x = reader.readUint32();
				var y = reader.readUint32();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setViewportExtEx(x, y);
						}
					})(y, x)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SAVEDC:
				this._records.push(function(gdi) {
					gdi.saveDC();
				});
				break;
			case EMFJS.GDI.RecordType.EMR_RESTOREDC:
				var saved = reader.readInt32();
				this._records.push(
					(function(saved) {
						return function(gdi) {
							gdi.restoreDC(saved);
						}
					})(saved)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SETBKMODE:
				var bkMode = reader.readUint32();
				this._records.push(
					(function(bkMode) {
						return function(gdi) {
							gdi.setBkMode(bkMode);
						}
					})(bkMode)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SETBKCOLOR:
				var bkColor = new EMFJS.ColorRef(reader);
				this._records.push(
					(function(bkColor) {
						return function(gdi) {
							gdi.setBkColor(bkColor);
						}
					})(bkColor)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_CREATEBRUSHINDIRECT:
				var index = reader.readUint32();
				var datalength = size - (reader.pos - curpos);
				var brush = new EMFJS.Brush(reader, datalength, false);
				this._records.push(
					(function(index, brush) {
						return function(gdi) {
							gdi.createBrush(index, brush);
						}
					})(index, brush)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_CREATEPEN:
                var index = reader.readUint32();
				var pen = new EMFJS.Pen(reader);
				this._records.push(
					(function(index, pen) {
						return function(gdi) {
							gdi.createPen(index, pen);
						}
					})(index, pen)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_EXTCREATEPEN:
				var index = reader.readUint32();
				var offsetDibHeader = reader.readUint32();
				var dibHeaderSize = reader.readUint32();
				var offsetDibBits = reader.readUint32();
				var dibBitsSize = reader.readUint32();
				var pen = new EMFJS.PenEx(reader);
				this._records.push(
					(function(index, pen) {
						return function(gdi) {
							gdi.createPenEx(index, pen);
						}
					})(index, pen)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SELECTOBJECT:
				var idx = reader.readUint32();
				this._records.push(
					(function(idx) {
						return function(gdi) {
							gdi.selectObject(idx, null);
						}
					})(idx)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_DELETEOBJECT:
				var idx = reader.readUint32();
				this._records.push(
					(function(idx) {
						return function(gdi) {
							gdi.deleteObject(idx);
						}
					})(idx)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_RECTANGLE:
				var rect = new EMFJS.RectL(reader);
				this._records.push(
					(function(rect) {
						return function(gdi) {
							gdi.rectangle(rect, 0, 0);
						}
					})(rect)
				);
				break;
            case EMFJS.GDI.RecordType.EMR_LINETO:
                var x = reader.readInt32();
                var y = reader.readInt32();
                this._records.push(
                    (function(y, x) {
                        return function(gdi) {
                            gdi.lineTo(x, y);
                        }
                    })(y, x)
                );
                break;
            case EMFJS.GDI.RecordType.EMR_MOVETOEX:
                var x = reader.readInt32();
                var y = reader.readInt32();
                this._records.push(
                    (function(y, x) {
                        return function(gdi) {
                            gdi.moveTo(x, y);
                        }
                    })(y, x)
                );
                break;
			case EMFJS.GDI.RecordType.EMR_POLYGON16:
				var bounds = new EMFJS.RectL(reader);
				var cnt = reader.readUint32();
				var points = [];
				while (cnt > 0) {
					points.push(new EMFJS.PointS(reader));
					cnt--;
				}
				this._records.push(
					(function(points) {
						return function(gdi) {
							gdi.polygon16(points);
						}
					})(points)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_SETPOLYFILLMODE:
				var polyfillmode = reader.readUint32();
				this._records.push(
					(function(polyfillmode) {
						return function(gdi) {
							gdi.setPolyFillMode(polyfillmode);
						}
					})(polyfillmode)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_POLYLINE16:
				var bounds = new EMFJS.RectL(reader);
				var cnt = reader.readUint32();
				var points = [];
				while (cnt > 0) {
					points.push(new EMFJS.PointS(reader));
					cnt--;
				}
				this._records.push(
					(function(points) {
						return function(gdi) {
							gdi.polyline16(points);
						}
					})(points)
				);
				break;
			case EMFJS.GDI.RecordType.EMR_POLYBEZIER:
			case EMFJS.GDI.RecordType.EMR_POLYGON:
			case EMFJS.GDI.RecordType.EMR_POLYLINE:
			case EMFJS.GDI.RecordType.EMR_POLYBEZIERTO:
			case EMFJS.GDI.RecordType.EMR_POLYLINETO:
			case EMFJS.GDI.RecordType.EMR_POLYPOLYLINE:
			case EMFJS.GDI.RecordType.EMR_POLYPOLYGON:
			case EMFJS.GDI.RecordType.EMR_SETBRUSHORGEX:
			case EMFJS.GDI.RecordType.EMR_SETPIXELV:
			case EMFJS.GDI.RecordType.EMR_SETMAPPERFLAGS:
			case EMFJS.GDI.RecordType.EMR_SETROP2:
			case EMFJS.GDI.RecordType.EMR_SETSTRETCHBLTMODE:
			case EMFJS.GDI.RecordType.EMR_SETTEXTALIGN:
			case EMFJS.GDI.RecordType.EMR_SETCOLORADJUSTMENT:
			case EMFJS.GDI.RecordType.EMR_SETTEXTCOLOR:
			case EMFJS.GDI.RecordType.EMR_OFFSETCLIPRGN:
			case EMFJS.GDI.RecordType.EMR_SETMETARGN:
			case EMFJS.GDI.RecordType.EMR_EXCLUDECLIPRECT:
			case EMFJS.GDI.RecordType.EMR_INTERSECTCLIPRECT:
			case EMFJS.GDI.RecordType.EMR_SCALEVIEWPORTEXTEX:
			case EMFJS.GDI.RecordType.EMR_SCALEWINDOWEXTEX:
			case EMFJS.GDI.RecordType.EMR_SETWORLDTRANSFORM:
			case EMFJS.GDI.RecordType.EMR_MODIFYWORLDTRANSFORM:
			case EMFJS.GDI.RecordType.EMR_ANGLEARC:
			case EMFJS.GDI.RecordType.EMR_ELLIPSE:
			case EMFJS.GDI.RecordType.EMR_ROUNDRECT:
			case EMFJS.GDI.RecordType.EMR_ARC:
			case EMFJS.GDI.RecordType.EMR_CHORD:
			case EMFJS.GDI.RecordType.EMR_PIE:
			case EMFJS.GDI.RecordType.EMR_SELECTPALETTE:
			case EMFJS.GDI.RecordType.EMR_CREATEPALETTE:
			case EMFJS.GDI.RecordType.EMR_SETPALETTEENTRIES:
			case EMFJS.GDI.RecordType.EMR_RESIZEPALETTE:
			case EMFJS.GDI.RecordType.EMR_REALIZEPALETTE:
			case EMFJS.GDI.RecordType.EMR_EXTFLOODFILL:
			case EMFJS.GDI.RecordType.EMR_ARCTO:
			case EMFJS.GDI.RecordType.EMR_POLYDRAW:
			case EMFJS.GDI.RecordType.EMR_SETARCDIRECTION:
			case EMFJS.GDI.RecordType.EMR_SETMITERLIMIT:
			case EMFJS.GDI.RecordType.EMR_BEGINPATH:
			case EMFJS.GDI.RecordType.EMR_ENDPATH:
			case EMFJS.GDI.RecordType.EMR_CLOSEFIGURE:
			case EMFJS.GDI.RecordType.EMR_FILLPATH:
			case EMFJS.GDI.RecordType.EMR_STROKEANDFILLPATH:
			case EMFJS.GDI.RecordType.EMR_STROKEPATH:
			case EMFJS.GDI.RecordType.EMR_FLATTENPATH:
			case EMFJS.GDI.RecordType.EMR_WIDENPATH:
			case EMFJS.GDI.RecordType.EMR_SELECTCLIPPATH:
			case EMFJS.GDI.RecordType.EMR_ABORTPATH:
			case EMFJS.GDI.RecordType.EMR_COMMENT:
			case EMFJS.GDI.RecordType.EMR_FILLRGN:
			case EMFJS.GDI.RecordType.EMR_FRAMERGN:
			case EMFJS.GDI.RecordType.EMR_INVERTRGN:
			case EMFJS.GDI.RecordType.EMR_PAINTRGN:
			case EMFJS.GDI.RecordType.EMR_EXTSELECTCLIPRGN:
			case EMFJS.GDI.RecordType.EMR_BITBLT:
			case EMFJS.GDI.RecordType.EMR_STRETCHBLT:
			case EMFJS.GDI.RecordType.EMR_MASKBLT:
			case EMFJS.GDI.RecordType.EMR_PLGBLT:
			case EMFJS.GDI.RecordType.EMR_SETDIBITSTODEVICE:
			case EMFJS.GDI.RecordType.EMR_STRETCHDIBITS:
			case EMFJS.GDI.RecordType.EMR_EXTCREATEFONTINDIRECTW:
			case EMFJS.GDI.RecordType.EMR_EXTTEXTOUTA:
			case EMFJS.GDI.RecordType.EMR_EXTTEXTOUTW:
			case EMFJS.GDI.RecordType.EMR_POLYBEZIER16:
			case EMFJS.GDI.RecordType.EMR_POLYBEZIERTO16:
			case EMFJS.GDI.RecordType.EMR_POLYLINETO16:
			case EMFJS.GDI.RecordType.EMR_POLYPOLYLINE16:
			case EMFJS.GDI.RecordType.EMR_POLYPOLYGON16:
			case EMFJS.GDI.RecordType.EMR_POLYDRAW16:
			case EMFJS.GDI.RecordType.EMR_CREATEMONOBRUSH:
			case EMFJS.GDI.RecordType.EMR_CREATEDIBPATTERNBRUSHPT:
			case EMFJS.GDI.RecordType.EMR_POLYTEXTOUTA:
			case EMFJS.GDI.RecordType.EMR_POLYTEXTOUTW:
			case EMFJS.GDI.RecordType.EMR_SETICMMODE:
			case EMFJS.GDI.RecordType.EMR_CREATECOLORSPACE:
			case EMFJS.GDI.RecordType.EMR_SETCOLORSPACE:
			case EMFJS.GDI.RecordType.EMR_DELETECOLORSPACE:
			case EMFJS.GDI.RecordType.EMR_GLSRECORD:
			case EMFJS.GDI.RecordType.EMR_GLSBOUNDEDRECORD:
			case EMFJS.GDI.RecordType.EMR_PIXELFORMAT:
			case EMFJS.GDI.RecordType.EMR_DRAWESCAPE:
			case EMFJS.GDI.RecordType.EMR_EXTESCAPE:
			case EMFJS.GDI.RecordType.EMR_SMALLTEXTOUT:
			case EMFJS.GDI.RecordType.EMR_FORCEUFIMAPPING:
			case EMFJS.GDI.RecordType.EMR_NAMEDESCAPE:
			case EMFJS.GDI.RecordType.EMR_COLORCORRECTPALETTE:
			case EMFJS.GDI.RecordType.EMR_SETICMPROFILEA:
			case EMFJS.GDI.RecordType.EMR_SETICMPROFILEW:
			case EMFJS.GDI.RecordType.EMR_ALPHABLEND:
			case EMFJS.GDI.RecordType.EMR_SETLAYOUT:
			case EMFJS.GDI.RecordType.EMR_TRANSPARENTBLT:
			case EMFJS.GDI.RecordType.EMR_GRADIENTFILL:
			case EMFJS.GDI.RecordType.EMR_SETLINKEDUFIS:
			case EMFJS.GDI.RecordType.EMR_SETTEXTJUSTIFICATION:
			case EMFJS.GDI.RecordType.EMR_COLORMATCHTOTARGETW:
			case EMFJS.GDI.RecordType.EMR_CREATECOLORSPACEW:
				EMFJS.log("[EMF] record 0x" + type.toString(16) + " at offset 0x" + curpos.toString(16) + " with " + size + " bytes");
				break;
			default:
				EMFJS.log("[EMF] UNKNOWN record 0x" + type.toString(16) + " at offset 0x" + curpos.toString(16) + " with " + size + " bytes");
				//throw new EMFJS.Error("Record type not recognized: 0x" + type.toString(16));
				break;
		}
		
		curpos += size;
	}
	
	if (!all)
		throw new EMFJS.Error("Could not read all records");
};

EMFJS.EMFRecords.prototype.play = function(gdi) {
	var len = this._records.length;
	for (var i = 0; i < len; i++) {
		this._records[i].call(this, gdi);
	}
};

EMFJS.EMF = function(reader, hdrsize) {
	this._reader = reader;
	this._hdrsize = hdrsize;
	this._img = null;
	this._records = new EMFJS.EMFRecords(reader, this._hdrsize);
};

EMFJS.EMF.prototype.render = function(gdi) {
	this._records.play(gdi);
};

EMFJS.Renderer = function(blob) {
	this.parse(blob);
	EMFJS.log("EMFJS.Renderer instantiated");
};

EMFJS.Renderer.prototype.parse = function(blob) {
	this._img = null;
	
	var reader = new EMFJS.Blob(blob);
	
	var type = reader.readUint32();
	if(type !== 0x00000001){
		throw new EMFJS.error("Not an EMF File");
	}
	var size = reader.readUint32();

	this._img = new EMFJS.EMF(reader, size);
	
	if (this._img == null)
		throw new EMFJS.Error("Format not recognized");
};

EMFJS.Renderer.prototype._render = function(svg, mapMode, xExt, yExt) {
	// See https://www-user.tu-chemnitz.de/~ygu/petzold/ch18b.htm
	var gdi = new EMFJS.GDIContext(svg);
	gdi.setViewportExtEx(xExt, yExt);
	gdi.setMapMode(mapMode);
	EMFJS.log("[EMF] BEGIN RENDERING --->");
	this._img.render(gdi);
	EMFJS.log("[EMF] <--- DONE RENDERING");
};

EMFJS.Renderer.prototype.render = function(info) {
	var inst = this;
	var img = (function(mapMode, xExt, yExt) {
		return $("<div>").svg({
			onLoad: function(svg) {
				return inst._render.call(inst, svg, mapMode, xExt, yExt);
			},
			settings: {
				viewBox: [0, 0, info.xExt, info.yExt].join(" "),
				preserveAspectRatio: "none" // TODO: MM_ISOTROPIC vs MM_ANISOTROPIC
			}
		});
	})(info.mapMode, info.xExt, info.yExt);
	var svg = $(img[0]).svg("get");
	return $(svg.root()).attr("width", info.width).attr("height", info.height);
};
