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

if (typeof WMFJS === 'undefined') {
	(typeof window !== 'undefined' ? window : this).WMFJS = {
		Error: function(message) {
			this.message = message;
		},
		loggingEnabled: true,
		log: function(message){
			if(WMFJS.loggingEnabled) {
				console.log(message);
			}
		},
		GDI: {
			METAHEADER_SIZE: 18,
			BITMAPINFOHEADER_SIZE: 40,
			BITMAPCOREHEADER_SIZE: 12,
			MetafileType: {
				MEMORYMETAFILE: 1,
				DISKMETAFILE: 2
			},
			MetafileVersion: {
				METAVERSION100: 0x100,
				METAVERSION300: 0x300
			},
			RecordType: {
				META_EOF: 0x0000,
				META_REALIZEPALETTE: 0x0035,
				META_SETPALENTRIES: 0x0037,
				META_SETBKMODE: 0x0102,
				META_SETMAPMODE: 0x0103,
				META_SETROP2: 0x0104,
				META_SETRELABS: 0x0105,
				META_SETPOLYFILLMODE: 0x0106,
				META_SETSTRETCHBLTMODE: 0x0107,
				META_SETTEXTCHAREXTRA: 0x0108,
				META_RESTOREDC: 0x0127,
				META_RESIZEPALETTE: 0x0139,
				META_DIBCREATEPATTERNBRUSH: 0x0142,
				META_SETLAYOUT: 0x0149,
				META_SETBKCOLOR: 0x0201,
				META_SETTEXTCOLOR: 0x0209,
				META_OFFSETVIEWPORTORG: 0x0211,
				META_LINETO: 0x0213,
				META_MOVETO: 0x0214,
				META_OFFSETCLIPRGN: 0x0220,
				META_FILLREGION: 0x0228,
				META_SETMAPPERFLAGS: 0x0231,
				META_SELECTPALETTE: 0x0234,
				META_POLYGON: 0x0324,
				META_POLYLINE: 0x0325,
				META_SETTEXTJUSTIFICATION: 0x020a,
				META_SETWINDOWORG: 0x020b,
				META_SETWINDOWEXT: 0x020c,
				META_SETVIEWPORTORG: 0x020d,
				META_SETVIEWPORTEXT: 0x020e,
				META_OFFSETWINDOWORG: 0x020f,
				META_SCALEWINDOWEXT: 0x0410,
				META_SCALEVIEWPORTEXT: 0x0412,
				META_EXCLUDECLIPRECT: 0x0415,
				META_INTERSECTCLIPRECT: 0x0416,
				META_ELLIPSE: 0x0418,
				META_FLOODFILL: 0x0419,
				META_FRAMEREGION: 0x0429,
				META_ANIMATEPALETTE: 0x0436,
				META_TEXTOUT: 0x0521,
				META_POLYPOLYGON: 0x0538,
				META_EXTFLOODFILL: 0x0548,
				META_RECTANGLE: 0x041b,
				META_SETPIXEL: 0x041f,
				META_ROUNDRECT: 0x061c,
				META_PATBLT: 0x061d,
				META_SAVEDC: 0x001e,
				META_PIE: 0x081a,
				META_STRETCHBLT: 0x0b23,
				META_ESCAPE: 0x0626,
				META_INVERTREGION: 0x012a,
				META_PAINTREGION: 0x012b,
				META_SELECTCLIPREGION: 0x012c,
				META_SELECTOBJECT: 0x012d,
				META_SETTEXTALIGN: 0x012e,
				META_ARC: 0x0817,
				META_CHORD: 0x0830,
				META_BITBLT: 0x0922,
				META_EXTTEXTOUT: 0x0a32,
				META_SETDIBTODEV: 0x0d33,
				META_DIBBITBLT: 0x0940,
				META_DIBSTRETCHBLT: 0x0b41,
				META_STRETCHDIB: 0x0f43,
				META_DELETEOBJECT: 0x01f0,
				META_CREATEPALETTE: 0x00f7,
				META_CREATEPATTERNBRUSH: 0x01f9,
				META_CREATEPENINDIRECT: 0x02fa,
				META_CREATEFONTINDIRECT: 0x02fb,
				META_CREATEBRUSHINDIRECT: 0x02fc,
				META_CREATEREGION: 0x06ff
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
			TextAlignmentMode: {
				TA_UPDATECP: 1,
				TA_RIGHT: 2,
				TA_CENTER: 6,
				TA_BOTTOM: 8,
				TA_BASELINE: 24,
				TA_RTLREADING: 256
			},
			MixMode: {
				TRANSPARENT: 1,
				OPAQUE: 2
			},
			VerticalTextAlignmentMode: {
				VTA_BOTTOM: 2,
				VTA_CENTER: 6,
				VTA_LEFT: 8,
				VTA_BASELINE: 24
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
				PS_SOLID: 0,
				PS_DASH: 1,
				PS_DOT: 2,
				PS_DASHDOT: 3,
				PS_DASHDOTDOT: 4,
				PS_NULL: 5,
				PS_INSIDEFRAME: 6,
				PS_USERSTYLE: 7,
				PS_ALTERNATE: 8,
				PS_ENDCAP_SQUARE: 256,
				PS_ENDCAP_FLAT: 512,
				PS_JOIN_BEVEL: 4096,
				PS_JOIN_MITER: 8192
			},
			PolyFillMode: {
				ALTERNATE: 1,
				WINDING: 2
			},
			ColorUsage: {
				DIB_RGB_COLORS: 0,
				DIB_PAL_COLORS: 1,
				DIB_PAL_INDICES: 2
			},
			PaletteEntryFlag: {
				PC_RESERVED: 1,
				PC_EXPLICIT: 2,
				PC_NOCOLLAPSE: 4
			},
			BitmapCompression: {
				BI_RGB: 0,
				BI_RLE8: 1,
				BI_RLE4: 2,
				BI_BITFIELDS: 3,
				BI_JPEG: 4,
				BI_PNG: 5
			},
		},
		_uniqueId: 0,
		_makeUniqueId: function(prefix) {
			return "wmfjs_" + prefix + (this._uniqueId++);
		},
		_writeUint32Val: function(uint8arr, pos, val) {
			uint8arr[pos++] = val & 0xff;
			uint8arr[pos++] = (val >>> 8) & 0xff;
			uint8arr[pos++] = (val >>> 16) & 0xff;
			uint8arr[pos++] = (val >>> 24) & 0xff;
		},
		_blobToBinary: function(blob) {
			var ret = "";
			var len = blob.length;
			for (var i = 0; i < len; i++)
				ret += String.fromCharCode(blob[i]);
			return ret;
		},
	};
}

WMFJS.Blob = function(blob, offset) {
	if (blob instanceof WMFJS.Blob) {
		this.blob = blob.blob;
		this.data = blob.data;
		this.pos =  offset || blob.pos;
	} else {
		this.blob = blob;
		this.data = new Uint8Array(blob);
		this.pos =  offset || 0;
	}
};

WMFJS.Blob.prototype.eof = function() {
	return this.pos >= this.data.length;
};

WMFJS.Blob.prototype.seek = function(newpos) {
	if (newpos < 0 || newpos > this.data.length)
		throw new WMFJS.Error("Invalid seek position");
	this.pos = newpos;
};

WMFJS.Blob.prototype.skip = function(cnt) {
	var newPos = this.pos + cnt;
	if (newPos > this.data.length)
		throw new WMFJS.Error("Unexpected end of file");
	this.pos = newPos;
};

WMFJS.Blob.prototype.readBinary = function(cnt) {
	var end = this.pos + cnt;
	if (end > this.data.length)
		throw new WMFJS.Error("Unexpected end of file");
	var ret = "";
	while (cnt-- > 0)
		ret += String.fromCharCode(this.data[this.pos++]);
	return ret;
};

WMFJS.Blob.prototype.readInt8 = function() {
	if (this.pos + 1 > this.data.length)
		throw new WMFJS.Error("Unexpected end of file");
	return this.data[this.pos++];
};

WMFJS.Blob.prototype.readUint8 = function() {
	return this.readInt8() >>> 0;
};

WMFJS.Blob.prototype.readInt32 = function() {
	if (this.pos + 4 > this.data.length)
		throw new WMFJS.Error("Unexpected end of file");
	var val = this.data[this.pos++];
	val |= this.data[this.pos++] << 8;
	val |= this.data[this.pos++] << 16;
	val |= this.data[this.pos++] << 24;
	return val;
};

WMFJS.Blob.prototype.readUint32 = function() {
	return this.readInt32() >>> 0;
};

WMFJS.Blob.prototype.readUint16 = function() {
	if (this.pos + 2 > this.data.length)
		throw new WMFJS.Error("Unexpected end of file");
	var val = this.data[this.pos++];
	val |= this.data[this.pos++] << 8;
	return val;
};

WMFJS.Blob.prototype.readInt16 = function() {
	var val = this.readUint16();
	if (val > 32767)
		val -= 65536;
	return val;
};

WMFJS.Blob.prototype.readString = function(length) {
	if (this.pos + length > this.data.length)
		throw new WMFJS.Error("Unexpected end of file");
	var ret = "";
	for (var i = 0; i < length; i++)
		ret += String.fromCharCode(this.data[this.pos++] >>> 0);
	return ret;
};

WMFJS.Blob.prototype.readNullTermString = function(maxSize) {
	var ret = "";
	if (maxSize > 0) {
		maxSize--;
		for (var i = 0; i < maxSize; i++) {
			if (this.pos + i + 1 > this.data.length)
				throw new WMFJS.Error("Unexpected end of file");
			var byte = this.data[this.pos + i] >>> 0;
			if (byte == 0)
				break;
			ret += String.fromCharCode(byte);
		}
	}
	return ret;
};

WMFJS.ColorRef = function(reader, r, g, b) {
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

WMFJS.ColorRef.prototype.clone = function() {
	return new WMFJS.ColorRef(null, this.r, this.g, this.b);
};

WMFJS.ColorRef.prototype.toHex = function() {
	var rgb = (this.r << 16) | (this.g << 8) | this.b;
	return (0x1000000 + rgb).toString(16).slice(1);
};

WMFJS.ColorRef.prototype.toString = function() {
	return "{r: " + this.r + ", g: " + this.g + ", b: " + this.b + "}";
};

WMFJS.PointS = function(reader, x, y) {
	if (reader != null) {
		this.x = reader.readInt16();
		this.y = reader.readInt16();
	} else {
		this.x =  x;
		this.y = y;
	}
};

WMFJS.PointS.prototype.clone = function() {
	return new WMFJS.PointS(null, this.x, this.y);
};

WMFJS.PointS.prototype.toString = function() {
	return "{x: " + this.x + ", y: " + this.y + "}";
};

WMFJS.Rect = function(reader, left, top, right, bottom) {
	if (reader != null) {
		this.bottom = reader.readInt16();
		this.right = reader.readInt16();
		this.top = reader.readInt16();
		this.left = reader.readInt16();
	} else {
		this.bottom = bottom;
		this.right = right;
		this.top = top;
		this.left = left;
	}
};

WMFJS.Rect.prototype.clone = function() {
	return new WMFJS.Rect(null, this.left, this.top, this.right, this.bottom);
};

WMFJS.Rect.prototype.toString = function() {
	return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
};

WMFJS.Rect.prototype.empty = function() {
	return this.left >= this.right || this.top >= this.bottom;
};

WMFJS.Rect.prototype.intersect = function(rect) {
	if (this.empty() || rect.empty())
		return null;
	if (this.left >= rect.right || this.top >= rect.bottom ||
		this.right <= rect.left || this.bottom <= rect.top) {
		return null;
	}
	return new WMFJS.Rect(null, Math.max(this.left, rect.left), Math.max(this.top, rect.top), Math.min(this.right, rect.right), Math.min(this.bottom, rect.bottom));
};

WMFJS.Obj = function(type) {
	this.type = type;
}

WMFJS.Obj.prototype.clone = function() {
	throw new WMFJS.Error("clone not implemented");
}

WMFJS.Obj.prototype.toString = function() {
	throw new WMFJS.Error("toString not implemented");
}

WMFJS.Font = function(reader, copy) {
	WMFJS.Obj.call(this, "font");
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
WMFJS.Font.prototype = Object.create(WMFJS.Obj.prototype);

WMFJS.Font.prototype.clone = function() {
	return new WMFJS.Font(null, this);
};

WMFJS.Font.prototype.toString = function() {
	//return "{facename: " + this.facename + ", height: " + this.height + ", width: " + this.width + "}";
	return JSON.stringify(this);
};

WMFJS.Brush = function(reader, copy, forceDibPattern) {
	WMFJS.Obj.call(this, "brush");
	if (reader != null) {
		var dataLength = copy;
		var start = reader.pos;
		
		if (forceDibPattern === true || forceDibPattern === false) {
			this.style = reader.readUint16();
			if (forceDibPattern && this.style != WMFJS.GDI.BrushStyle.BS_PATTERN)
				this.style = WMFJS.GDI.BrushStyle.BS_DIBPATTERNPT;
			switch (this.style) {
				case WMFJS.GDI.BrushStyle.BS_SOLID:
					this.color = new WMFJS.ColorRef(reader);
					break;
				case WMFJS.GDI.BrushStyle.BS_PATTERN:
					reader.skip(forceDibPattern ? 2 : 4);
					this.pattern = new WMFJS.Bitmap16(reader, dataLength - (reader.pos - start));
					break;
				case WMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
					this.colorusage = forceDibPattern ? reader.readUint16() : reader.readUint32();
					this.dibpatternpt = new WMFJS.DIBitmap(reader, dataLength - (reader.pos - start));
					break;
				case WMFJS.GDI.BrushStyle.BS_HATCHED:
					this.color = new WMFJS.ColorRef(reader);
					this.hatchstyle = reader.readUint16();
					break;
			}
		} else if (forceDibPattern instanceof WMFJS.PatternBitmap16) {
			this.style = MFJS.GDI.BrushStyle.BS_PATTERN;
			this.pattern = forceDibPattern;
		}
	} else {
		this.style = copy.style;
		switch (this.style) {
			case WMFJS.GDI.BrushStyle.BS_SOLID:
				this.color = copy.color.clone();
				break;
			case WMFJS.GDI.BrushStyle.BS_PATTERN:
				this.pattern = copy.pattern.clone();
				break;
			case WMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
				this.colorusage = copy.colorusage;
				this.dibpatternpt = copy.dibpatternpt;
				break;
			case WMFJS.GDI.BrushStyle.BS_HATCHED:
				this.color = copy.color.clone();
				this.hatchstyle = copy.hatchstyle;
				break;
		}
	}
};
WMFJS.Brush.prototype = Object.create(WMFJS.Obj.prototype);

WMFJS.Brush.prototype.clone = function() {
	return new WMFJS.Brush(null, this);
};

WMFJS.Brush.prototype.toString = function() {
	var ret = "{style: " + this.style;
	switch (this.style) {
		case WMFJS.GDI.BrushStyle.BS_SOLID:
			ret += ", color: " + this.color.toString();
			break
		case WMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
			ret += ", colorusage: " + this.colorusage;
			break;
		case WMFJS.GDI.BrushStyle.BS_HATCHED:
			ret += ", color: " + this.color.toString() + ", hatchstyle: " + this.hatchstyle;
			break;
	}
	return ret + "}";
};

WMFJS.Pen = function(reader, style, width, color, linecap, join) {
	WMFJS.Obj.call(this, "pen");
	if (reader != null) {
		var style = reader.readUint16();
		this.style = style & 0xFF;
		this.width = new WMFJS.PointS(reader);
		this.color = new WMFJS.ColorRef(reader);
		this.linecap = (style & (WMFJS.GDI.PenStyle.PS_ENDCAP_SQUARE | WMFJS.GDI.PenStyle.PS_ENDCAP_FLAT));
		this.join = (style & (WMFJS.GDI.PenStyle.PS_JOIN_BEVEL | WMFJS.GDI.PenStyle.PS_JOIN_MITER));
	} else {
		this.style = style;
		this.width = width;
		this.color = color;
		this.linecap = linecap;
		this.join = join;
	}
};
WMFJS.Pen.prototype = Object.create(WMFJS.Obj.prototype);

WMFJS.Pen.prototype.clone = function() {
	return new WMFJS.Pen(null, this.style, this.width.clone(), this.color.clone(), this.linecap, this.join);
};

WMFJS.Pen.prototype.toString = function() {
	return "{style: " + this.style + ", width: " + this.width.toString() + ", color: " + this.color.toString() + ", linecap: " + this.linecap + ", join: " + this.join + "}";
};

WMFJS.PaletteEntry = function(reader, copy) {
	if (reader != null) {
		this.flag = reader.readUint8();
		this.b = reader.readUint8();
		this.g = reader.readUint8();
		this.r = reader.readUint8();
	} else {
		this.flag = copy.flag;
		this.b = copy.b;
		this.g = copy.g;
		this.r = copy.r;
	}
};

WMFJS.PaletteEntry.prototype.clone = function() {
	return new WMFJS.PaletteEntry(null, this);
};

WMFJS.Palette = function(reader, copy) {
	WMFJS.Obj.call(this, "palette");
	if (reader != null) {
		this.start = reader.readUint16();
		var cnt = reader.readUint16();
		this.entries = [];
		while (cnt > 0)
			this.entries.push(new WMFJS.PaletteEntry(reader));
	} else {
		this.start = copy.start;
		this.entries = [];
		var len = copy.entries.length;
		for (var i = 0; i < len; i++)
			entries.push(copy.entries[i.clone()]);
	}
};
WMFJS.Palette.prototype = Object.create(WMFJS.Obj.prototype);

WMFJS.Palette.prototype.clone = function() {
	return new WMFJS.Palette(null, this);
};

WMFJS.Palette.prototype.toString = function() {
	return "{ #entries: " + this.entries.length + "}"; // TODO
};

WMFJS.Scan = function(reader, copy, top, bottom, scanlines) {
	if (reader != null) {
		var cnt = reader.readUint16();
		this.top = reader.readUint16();
		this.bottom = reader.readUint16();
		this.scanlines = [];
		for (var i = 0; i < cnt; i++) {
			var left = reader.readUint16();
			var right = reader.readUint16();
			this.scanlines.push({left: left, right: right});
		}
		reader.skip(2);
	} else if (copy != null) {
		this.top = copy.top;
		this.bottom = copy.bottom;
		this.scanlines = [];
		for (var i = 0; i < copy.scanlines.length; i++) {
			var scanline = copy.scanlines[i];
			this.scanlines.push({left: scanline.left, right: scanline.right});
		}
	} else {
		this.top = top;
		this.bottom = bottom;
		this.scanlines = scanlines;
	}
};

WMFJS.Scan.prototype.clone = function() {
	return new WMFJS.Scan(null, this);
};

WMFJS.Scan.prototype.subtract = function(left, right) {
	var i;
	
	// Keep everything on the left side
	i = 0;
	while (i < this.scanlines.length) {
		var scanline = this.scanlines[i];
		if (scanline.left <= left) {
			if (scanline.right >= left) {
				scanline.right = left - 1;
				if (scanline.left >= scanline.right) {
					this.scanlines.splice(i, 1);
					continue;
				}
			}
			i++;
		} else {
			break;
		}
	}
	
	// Find the first one that may exceed to the right side
	var first = i;
	var cnt = 0;
	while (i < this.scanlines.length) {
		var scanline = this.scanlines[i];
		if (scanline.right > right) {
			scanline.left = right;
			cnt = i - first;
			if (scanline.left >= scanline.right)
				cnt++;
			break;
		}
		i++;
	}
	
	// Delete everything we're subtracting
	if (cnt > 0 && first < this.scanlines.length)
		this.scanlines.splice(first, cnt);
	
	return this.scanlines.length > 0;
};

WMFJS.Scan.prototype.intersect = function(left, right) {
	// Get rid of anything that falls entirely outside to the left
	for (var i = 0; i < this.scanlines.length; i++) {
		var scanline = this.scanlines[i];
		if (scanline.left >= left || scanline.right >= left) {
			if (i > 0)
				this.scanlines.splice(0, i);
			break;
		}
	}
	
	if (this.scanlines.length > 0) {
		// Adjust the first to match the left, if needed
		var scanline = this.scanlines[0];
		if (scanline.left < left)
			scanline.left = left;
		
		// Get rid of anything that falls entirely outside to the right
		for (var i = 0; i < this.scanlines.length; i++) {
			scanline = this.scanlines[i];
			if (scanline.left > right) {
				this.scanlines.splice(i, this.scanline.length - i);
				break;
			}
		}
		
		if (this.scanlines.length > 0) {
			// Adjust the last to match the right, if needed
			scanline = this.scanlines[this.scanlines.length - 1];
			if (scanline.right > right)
				scanline.right = right;
		}
	}
	return this.scanlines.length > 0;
};

WMFJS.Scan.prototype.toString = function() {
	return "{ #scanlines: " + this.scanlines.length + " bounds: " + this.bounds.toString() + "}";
};

WMFJS.Region = function(reader, copy) {
	WMFJS.Obj.call(this, "region");
	if (reader != null) {
		reader.skip(8);
		var rgnSize = reader.readInt16();
		var scanCnt = reader.readInt16();
		reader.skip(2);
		// note, Rect in reverse, can't use WMFJS.Rect(reader) directly
		var left = reader.readInt16();
		var top = reader.readInt16();
		var right = reader.readInt16();
		var bottom = reader.readInt16();
		this.bounds = new WMFJS.Rect(null, left, top, right, bottom);
		this.scans = [];
		for (var i = 0; i < scanCnt; i++)
			this.scans.push(new WMFJS.Scan(reader));
		this._updateComplexity();
	} else if (copy != null) {
		this.bounds = copy.bounds != null ? copy.bounds.clone() : null;
		if (copy.scans != null) {
			this.scans = [];
			for (var i = 0; i < copy.scans.length; i++)
				this.scans.push(copy.scans[i].clone());
		} else {
			this.scans = null;
		}
		this.complexity = copy.complexity;
	} else {
		this.bounds = null;
		this.scans = null;
		this.complexity = 0;
	}
};
WMFJS.Region.prototype = Object.create(WMFJS.Obj.prototype);

WMFJS.Region.prototype.clone = function() {
	return new WMFJS.Region(null, this);
};

WMFJS.Region.prototype.toString = function() {
	var _complexity = ["null", "simple", "complex"];
	return "{complexity: " + _complexity[this.complexity] + " bounds: " + (this.bounds != null ? this.bounds.toString() : "[none]") + " #scans: " + (this.scans != null ? this.scans.length : "[none]") + "}";
};

WMFJS.Region.prototype._updateComplexity = function() {
	if (this.bounds == null) {
		this.complexity = 0;
		this.scans = null;
	} else if (this.bounds.empty()) {
		this.complexity = 0;
		this.scans = null;
		this.bounds = null;
	} else if (this.scans == null) {
		this.complexity = 1;
	} else {
		this.complexity = 2;
		if (this.scans.length == 1) {
			var scan = this.scans[0];
			if (scan.top == this.bounds.top && scan.bottom == this.bounds.bottom && scan.scanlines.length == 1) {
				var scanline = scan.scanlines[0];
				if (scanline.left == this.bounds.left && scanline.right == this.bounds.right) {
					this.scans = null;
					this.complexity = 1;
				}
			}
		}
	}
};

WMFJS.Region.prototype.subtract = function(rect) {
	WMFJS.log("[wmf] Region " + this.toString() + " subtract " + rect.toString());
	
	if (this.bounds != null) {
		var isect = this.bounds.intersect(rect);
		if (isect != null) { // Only need to do anything if there is any chance of an overlap
			if (this.scans == null) {
				// We currently have a simple region and there is some kind of an overlap.
				// We need to create scanlines now.  Simplest method is to fake one scan line
				// that equals the simple region and re-use the same logic as for complex regions
				this.scans = new WMFJS.Scan(null, null, this.bounds.top, this.bounds.bottom,
					[{left: this.bounds.left, right: this.bounds.right}]);
				this.complexity = 2;
			}
			
			// We (now) have a complex region.  First we skip any scans that are entirely above rect.top
			// The first scan that falls partially below rect.top needs to be split into two scans.
			var si = 0;
			while (si < this.scans.length) {
				var scan = this.scans[si];
				if (scan.bottom >= rect.top) {
					// We need to clone this scan into two so that we can subtract from the second one
					var cloned = scan.clone();
					scan.bottom = rect.top - 1;
					cloned.top = rect.top;
					if (scan.top >= scan.bottom) {
						this.scans[si] = cloned;
					} else {
						WMFJS.log("[wmf] Region split top scan " + si + " for substraction");
						this.scans.splice(++si, 0, cloned);
					}
					break;
				}
				si++;
			}
			
			// Now find the first one that falls at least partially below rect.bottom, which needs to be
			// split if it is only partially below rect.bottom
			var first = si;
			while (si < this.scans.length) {
				var scan = this.scans[si];
				if (scan.top > rect.bottom)
					break;
				if (scan.bottom > rect.bottom) {
					// We need to clone this scan into two so that we can subtract from the first one
					var cloned = scan.clone();
					scan.bottom = rect.bottom;
					cloned.top = rect.bottom + 1;
					if (scan.top >= scan.bottom) {
						this.scans[si] = cloned;
					} else {
						WMFJS.log("[wmf] Region split bottom scan " + si + " for substraction");
						this.scans.splice(++si, 0, clone);
					}
					break;
				}
				si++;
			}
			
			// Now perform a subtraction on each scan in between rect.top and rect.bottom.  Because we
			// cloned scans that partially overlapped rect.top and rect.bottom, we don't have to
			// account for this anymore.
			if (first < this.scans.length) {
				var last = si;
				si = first;
				while (si < last) {
					var scan = this.scans[si];
					if (!scan.subtract(rect.left, rect.right)) {
						WMFJS.log("[wmf] Region remove now empty scan " + si + " due to subtraction");
						this.scans.splice(si, 1);
						last--;
						continue;
					}
					
					si++;
				}
			}
			
			// Update bounds
			if (this.scans != null) {
				var left, top, right, bottom;
				var len = this.scans.length;
				for (var i = 0; i < len; i++) {
					var scan = this.scans[i];
					if (i == 0)
						top = scan.top;
					if (i == len - 1)
						bottom = scan.bottom;
					
					var slen = scan.scanline.length;
					if (slen > 0) {
						var scanline = scan.scanline[0];
						if (left == null || scanline.left < left)
							left = scanline.left;
						scanline = scan.scanline[slen - 1];
						if (right == null || scanline.right > right)
							right = scanline.right;
					}
				}
				
				if (left != null && top != null && right != null && bottom != null) {
					this.bounds = new WMFJS.Rect(null, left, top, right, bottom);
					this._updateComplexity();
				} else {
					// This has to be a null region now
					this.bounds = null;
					this.scans = null;
					this.complexity = 0;
				}
			} else {
				this._updateComplexity();
			}
		}
	}
	
	WMFJS.log("[wmf] Region subtraction -> " + this.toString());
};

WMFJS.Region.prototype.intersect = function(rect) {
	WMFJS.log("[wmf] Region " + this.toString() + " intersect with " + rect.toString());
	if (this.bounds != null) {
		this.bounds = this.bounds.intersect(rect);
		if (this.bounds != null) {
			if (this.scans != null) {
				var si = 0;
				// Remove any scans that are entirely above the new bounds.top
				while (si < this.scans.length) {
					var scan = this.scans[si];
					if (scan.bottom < this.bounds.top)
						si++;
					else
						break;
				}
				if (si > 0) {
					WMFJS.log("[wmf] Region remove " + si + " scans from top");
					this.scans.splice(0, si);
					
					// Adjust the first scan's top to match the new bounds.top
					if (this.scans.length > 0)
						this.scans[0].top = this.bounds.top;
				}
				
				// Get rid of anything that falls outside the new bounds.left/bounds.right
				si = 0;
				while (si < this.scans.length) {
					var scan = this.scans[si];
					if (scan.top > this.bounds.bottom) {
						// Remove this and all remaining scans that fall entirely below the new bounds.bottom
						WMFJS.log("[wmf] Region remove " + (this.scans.length - si) + " scans from bottom");
						this.scans.splice(si, this.scans.length - si);
						break;
					}
					if (!scan.intersect(this.bounds.left, this.bounds.right)) {
						// Remove now empty scan
						WMFJS.log("[wmf] Region remove now empty scan " + si + " due to intersection");
						this.scans.splice(si, 1);
						continue;
					}
					si++;
				}
				
				// If there are any scans left, adjust the last one's bottom to the new bounds.bottom
				if (this.scans.length > 0)
					this.scans[this.scans.length - 1].bottom = this.bounds.bottom;
				
				this._updateComplexity();
			}
		} else {
			this.scans = null;
			this.complexity = 0;
		}
	}
	WMFJS.log("[wmf] Region intersection -> " + this.toString());
};

WMFJS.Region.prototype.offset = function(offX, offY) {
	if (this.bounds != null) {
		this.bounds.left += offX;
		this.bounds.top += offY;
		this.bounds.right += offX;
		this.bounds.bottom += offY;
	}
	
	if (this.scans != null) {
		var slen = this.scans.length;
		for (var si = 0; si < slen; si++) {
			var scan = this.scans[si];
			scan.top += offY;
			scan.bottom += offY;
			
			var len = scan.scanlines.length;
			for (var i = 0; i < len; i++) {
				var scanline = scan.scanlines[i];
				scanline.left += offX;
				scanline.right += offX;
			}
		}
	}
};

WMFJS.CreateSimpleRegion = function(left, top, right, bottom) {
	var rgn = new WMFJS.Region(null, null);
	rgn.bounds = new WMFJS.Rect(null, left, top, right, bottom);
	rgn._updateComplexity();
	return rgn;
};

WMFJS.BitmapBase = function() {
};

WMFJS.BitmapBase.prototype.getWidth = function() {
	throw WMFJS.Error("getWidth not implemented");
}

WMFJS.BitmapBase.prototype.getHeight = function() {
	throw WMFJS.Error("getHeight not implemented");
}

WMFJS.BitmapCoreHeader = function(reader, skipsize) {
	if (skipsize)
		reader.skip(4);
	this.width = reader.readUint16();
	this.height = reader.readUint16();
	this.planes = reader.readUint16();
	this.bitcount = reader.readUint16();
}

WMFJS.BitmapCoreHeader.prototype.colors = function() {
	return this.bitcount <= 8 ? 1 << this.bitcount : 0;
};

WMFJS.BitmapInfoHeader = function(reader, skipsize) {
	if (skipsize)
		reader.skip(4);
	this.width = reader.readInt32();
	this.height = reader.readInt32();
	this.planes = reader.readUint16();
	this.bitcount = reader.readUint16();
	this.compression = reader.readUint32();
	this.sizeimage = reader.readUint32();
	this.xpelspermeter = reader.readInt32();
	this.ypelspermeter = reader.readInt32();
	this.clrused = reader.readUint32();
	this.clrimportant = reader.readUint32();
};

WMFJS.BitmapInfoHeader.prototype.colors = function() {
	if (this.clrused != 0)
		return this.clrused < 256 ? this.clrused : 256;
	else
		return this.bitcount > 8 ? 0 : 1 << this.bitcount;
};

WMFJS.BitmapInfo = function(reader, usergb) {
	WMFJS.BitmapBase.call(this);
	this._reader = reader;
	this._offset = reader.pos;
	this._usergb = usergb;
	var hdrsize = reader.readUint32();
	this._infosize = hdrsize;
	if (hdrsize == WMFJS.GDI.BITMAPCOREHEADER_SIZE) {
		this._header = new WMFJS.BitmapCoreHeader(reader, false);
		this._infosize += this._header.colors() * (usergb ? 3 : 2);
	}
	else {
		this._header = new WMFJS.BitmapInfoHeader(reader, false);
		var masks = this._header.compression == WMFJS.GDI.BitmapCompression.BI_BITFIELDS ? 3 : 0;
		if (hdrsize <= WMFJS.GDI.BITMAPINFOHEADER_SIZE + (masks * 4))
			this._infosize = WMFJS.GDI.BITMAPINFOHEADER_SIZE + (masks * 4);
		this._infosize += this._header.colors() * (usergb ? 4 : 2);
	}
};
WMFJS.BitmapInfo.prototype = Object.create(WMFJS.BitmapBase.prototype);

WMFJS.BitmapInfo.prototype.getWidth = function() {
	return this._header.width;
};

WMFJS.BitmapInfo.prototype.getHeight = function() {
	return Math.abs(this._header.height);
};

WMFJS.BitmapInfo.prototype.infosize = function() {
	return this._infosize;
};

WMFJS.BitmapInfo.prototype.header = function() {
	return this._header;
};

WMFJS.DIBitmap = function(reader, size) {
	WMFJS.BitmapBase.call(this);
	this._reader = reader;
	this._offset = reader.pos;
	this._size = size;
	this._info = new WMFJS.BitmapInfo(reader, true);
};
WMFJS.DIBitmap.prototype = Object.create(WMFJS.BitmapBase.prototype);

WMFJS.DIBitmap.prototype.getWidth = function() {
	return this._info.getWidth();
};

WMFJS.DIBitmap.prototype.getHeight = function() {
	return this._info.getHeight();
};

WMFJS.DIBitmap.prototype.makeBitmapFileHeader = function() {
	var buf = new ArrayBuffer(14);
	var view = new Uint8Array(buf);
	view[0] = 0x42;
	view[1] = 0x4d;
	WMFJS._writeUint32Val(view, 2, this._size + 14);
	WMFJS._writeUint32Val(view, 10, this._info.infosize() + 14);
	return WMFJS._blobToBinary(view);
};

WMFJS.DIBitmap.prototype.base64ref = function() {
	var prevpos = this._reader.pos;
	this._reader.seek(this._offset);
	var mime = "image/bmp";
	var header = this._info.header();
	var data;
	if (header.compression != null) {
		switch (header.compression) {
			case WMFJS.GDI.BitmapCompression.BI_JPEG:
				mime = "data:image/jpeg";
				break;
			case WMFJS.GDI.BitmapCompression.BI_PNG:
				mime = "data:image/png";
				break;
			default:
				data = this.makeBitmapFileHeader();
				break;
		}
	} else {
		data = this.makeBitmapFileHeader();
	}
	
	if (data != null)
		data += this._reader.readBinary(this._size);
	else
		data = this._reader.readBinary(this._size);
	
	var ref = "data:" + mime + ";base64," + btoa(data);
	this._reader.seek(prevpos);
	return ref;
};

WMFJS.Bitmap16 = function(reader, size) {
	if (reader != null) {
		this._reader = reader;
		this._offset = reader.pos;
		this._size = size;
		this.type = reader.readInt16();
		this.width = reader.readInt16();
		this.height = reader.readInt16();
		this.widthBytes = reader.readInt16();
		this.planes = reader.readUint8();
		this.bitsPixel = reader.readUint8();
		this.bitsOffset = reader.pos;
		this.bitsSize = (((this.width * this.bitsPixel + 15) >> 4) << 1) * this.height;
		if (this.bitsSize != size - 10)
			throw new WMFJS.Error("Bitmap should have " + this.bitsSize + " bytes, but has " + (size - 10));
	} else {
		var copy = size;
		this._reader = copy._reader;
		this._offset = copy._offset;
		this._size = copy._size;
		this.type = copy.type;
		this.width = copy.width;
		this.height = copy.height;
		this.widthBytes = copy.widthBytes;
		this.planes = copy.planes;
		this.bitsPixel = copy.bitsPixel;
		this.bitsOffset = copy.bitsOffset;
		this.bitsSize = copy.bitsSize;
	}
};
WMFJS.Bitmap16.prototype = Object.create(WMFJS.BitmapBase.prototype);

WMFJS.Bitmap16.prototype.getWidth = function() {
	return this.width;
};

WMFJS.Bitmap16.prototype.getHeight = function() {
	return this.height;
};

WMFJS.Bitmap16.prototype.clone = function() {
	return new WMFJS.Bitmap16(null, this);
};

WMFJS.PatternBitmap16 = function(reader, size) {
	WMFJS.Bitmap16.call(this, reader, size);
	if (reader != null) {
		this.bitsOffset += 22; // skip bits (4 bytes) + reserved (18 bytes)
	}
};
WMFJS.PatternBitmap16.prototype = Object.create(WMFJS.Bitmap16.prototype);

WMFJS.PatternBitmap16.prototype.clone = function() {
	return new WMFJS.PatternBitmap16(null, this);
};

WMFJS.PolyPolygon = function(reader) {
	var polygonsCnt = reader.readUint16();
	var polygonsPtCnts = [];
	for (var i = 0; i < polygonsCnt; i++)
		polygonsPtCnts.push(reader.readUint16());
	
	this._polygons = [];
	for (var i = 0; i < polygonsCnt; i++) {
		var ptCnt = polygonsPtCnts[i];
		
		var polygon = [];
		for (var ip = 0; ip < ptCnt; ip++)
			polygon.push(new WMFJS.PointS(reader));
		this._polygons.push(polygon);
	}
};

WMFJS.GDIContextState = function(copy, defObjects) {
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
		this.mapmode = WMFJS.GDI.MapMode.MM_ANISOTROPIC;
		this.stretchmode = WMFJS.GDI.StretchMode.COLORONCOLOR;
		this.textalign = 0; // TA_LEFT | TA_TOP | TA_NOUPDATECP
		this.bkmode = WMFJS.GDI.MixMode.OPAQUE;
		this.textcolor = new WMFJS.ColorRef(null, 0, 0, 0);
		this.bkcolor = new WMFJS.ColorRef(null, 255, 255, 255);
		this.polyfillmode = WMFJS.GDI.PolyFillMode.ALTERNATE;
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

WMFJS.GDIContext = function(svg) {
	this._svg = svg;
	this._svgdefs = null;
	this._svgPatterns = {};
	this._svgClipPaths = {};
	
	this.defObjects = {
		brush: new WMFJS.Brush(null, WMFJS.GDI.BrushStyle.BS_SOLID, new WMFJS.ColorRef(null, 0, 0, 0), false),
		pen: new WMFJS.Pen(null, WMFJS.GDI.PenStyle.PS_SOLID, new WMFJS.PointS(null, 1, 1), new WMFJS.ColorRef(null, 0, 0, 0), 0, 0),
		font: new WMFJS.Font(null, null),
		palette: null,
		region: null
	};
	
	this.state = new WMFJS.GDIContextState(null, this.defObjects);
	this.statestack = [this.state];
	this.objects = {};
};

WMFJS.GDIContext.prototype._pushGroup = function() {
	if (this.state._svggroup == null || this.state._svgclipChanged) {
		this.state._svgclipChanged = false;
		this.state._svgtextbkfilter = null;
		
		var settings = {
			viewBox: [this.state.vx, this.state.vy, this.state.vw, this.state.vh].join(" "),
			preserveAspectRatio: "none"
		};
		if (this.state.clip != null) {
			WMFJS.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " with clipping");
			settings["clip-path"] = "url(#" + this._getSvgClipPathForRegion(this.state.clip) + ")";
		}
		else
			WMFJS.log("[gdi] new svg x=" + this.state.vx + " y=" + this.state.vy + " width=" + this.state.vw + " height=" + this.state.vh + " without clipping");
		this.state._svggroup = this._svg.svg(this.state._svggroup,
			this.state.vx, this.state.vy, this.state.vw, this.state.vh, settings);
	}
};

WMFJS.GDIContext.prototype._storeObject = function(obj) {
	var i = 0;
	while (this.objects[i.toString()] != null && i <= 65535)
		i++;
	if (i > 65535) {
		WMFJS.log("[gdi] Too many objects!");
		return -1;
	}
	
	this.objects[i.toString()] = obj;
	return i;
};

WMFJS.GDIContext.prototype._getObject = function(objIdx) {
	var obj = this.objects[objIdx.toString()];
	if (obj == null)
		WMFJS.log("[gdi] No object with handle " + objIdx);
	return obj;
};

WMFJS.GDIContext.prototype._getSvgDef = function() {
	if (this._svgdefs == null)
		this._svgdefs = this._svg.defs();
	return this._svgdefs;
};


WMFJS.GDIContext.prototype._getSvgClipPathForRegion = function(region) {
	for (var id in this._svgClipPaths) {
		var rgn = this._svgClipPaths[id];
		if (rgn == region)
			return id;
	}
	
	var id = WMFJS._makeUniqueId("c");
	var sclip = this._svg.clipPath(this._getSvgDef(), id, "userSpaceOnUse");
	switch (region.complexity) {
		case 1:
			this._svg.rect(sclip, this._todevX(region.bounds.left), this._todevY(region.bounds.top),
				this._todevW(region.bounds.right - region.bounds.left), this._todevH(region.bounds.bottom - region.bounds.top),
				{ fill: 'black', strokeWidth: 0 });
			break;
		case 2:
			for (var i = 0; i < region.scans.length; i++) {
				var scan = region.scans[i];
				for (var j = 0; j < scan.scanlines.length; j++) {
					var scanline = scan.scanlines[j];
					this._svg.rect(sclip, this._todevX(scanline.left), this._todevY(scan.top),
						this._todevW(scanline.right - scanline.left), this._todevH(scan.bottom - scan.top),
						{ fill: 'black', strokeWidth: 0 });
				}
			}
			break;
	};
	this._svgClipPaths[id] = region;
	return id;
};

WMFJS.GDIContext.prototype._getSvgPatternForBrush = function(brush) {
	for (var id in this._svgPatterns) {
		var pat = this._svgPatterns[id];
		if (pat == brush)
			return id;
	}
	
	var width, height, img;
	switch (brush.style) {
		case WMFJS.GDI.BrushStyle.BS_PATTERN:
			width = brush.pattern.getWidth();
			height = brush.pattern.getheight();
			break;
		case WMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
			width = brush.dibpatternpt.getWidth();
			height = brush.dibpatternpt.getHeight();
			img = brush.dibpatternpt.base64ref();
			break;
		default:
			throw new WMFJS.Error("Invalid brush style");
	}
	
	var id = WMFJS._makeUniqueId("p");
	var spat = this._svg.pattern(this._getSvgDef(), id, 0, 0, width, height, {patternUnits: 'userSpaceOnUse'});
	this._svg.image(spat, 0, 0, width, height, img);
	this._svgPatterns[id] = brush;
	return id;
};

WMFJS.GDIContext.prototype._selectObject = function(obj) {
	this.state.selected[obj.type] = obj;
	if (obj.type == "region")
		this.state._svgclipChanged = true;
};

WMFJS.GDIContext.prototype._deleteObject = function(objIdx) {
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
	
	WMFJS.log("[gdi] Cannot delete object with invalid handle " + objIdx);
	return false;
};

WMFJS.GDIContext.prototype._getClipRgn = function() {
	if (this.state.clip != null) {
		if (!this.state.ownclip)
			this.state.clip = this.state.clip.clone();
	} else {
		if (this.state.selected.region != null)
			this.state.clip = this.state.selected.region.clone();
		else
			this.state.clip = WMFJS.CreateSimpleRegion(this.state.wx, this.state.wy, this.state.wx + this.state.ww, this.state.wy + this.state.wh);
	}
	this.state.ownclip = true;
	return this.state.clip;
};

WMFJS.GDIContext.prototype._todevX = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor((val - this.state.wx) * (this.state.vw / this.state.ww)) + this.state.vx;
};

WMFJS.GDIContext.prototype._todevY = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor((val - this.state.wy) * (this.state.vh / this.state.wh)) + this.state.vy;
};

WMFJS.GDIContext.prototype._todevW = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor(val * (this.state.vw / this.state.ww)) + this.state.vx;
};

WMFJS.GDIContext.prototype._todevH = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor(val * (this.state.vh / this.state.wh)) + this.state.vy;
};

WMFJS.GDIContext.prototype._tologicalX = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor((val - this.state.vx) / (this.state.vw / this.state.ww)) + this.state.wx;
};

WMFJS.GDIContext.prototype._tologicalY = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor((val - this.state.vy) / (this.state.vh / this.state.wh)) + this.state.wy;
};

WMFJS.GDIContext.prototype._tologicalW = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor(val / (this.state.vw / this.state.ww)) + this.state.wx;
};

WMFJS.GDIContext.prototype._tologicalH = function(val) {
	// http://wvware.sourceforge.net/caolan/mapmode.html
	// logical -> device
	return Math.floor(val / (this.state.vh / this.state.wh)) + this.state.wy;
};

WMFJS.GDIContext.prototype.setMapMode = function(mode) {
	WMFJS.log("[gdi] setMapMode: mode=" + mode);
	this.state.mapmode = mode;
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.setWindowOrg = function(x, y) {
	WMFJS.log("[gdi] setWindowOrg: x=" + x + " y=" + y);
	this.state.wx = x;
	this.state.wy = y;
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.setWindowExt = function(x, y) {
	WMFJS.log("[gdi] setWindowExt: x=" + x + " y=" + y);
	this.state.ww = x;
	this.state.wh = y;
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.offsetWindowOrg = function(offX, offY) {
	WMFJS.log("[gdi] offsetWindowOrg: offX=" + offX + " offY=" + offY);
	this.state.wx += offX;
	this.state.wy += offY;
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.setViewportOrg = function(x, y) {
	WMFJS.log("[gdi] setViewportOrg: x=" + x + " y=" + y);
	this.state.vx = x;
	this.state.vy = y;
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.setViewportExt = function(x, y) {
	WMFJS.log("[gdi] setViewportExt: x=" + x + " y=" + y);
	this.state.vw = x;
	this.state.vh = y;
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.offsetViewportOrg = function(offX, offY) {
	WMFJS.log("[gdi] offsetViewportOrg: offX=" + offX + " offY=" + offY);
	this.state.vx += offX;
	this.state.vy += offY;
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.saveDC = function() {
	WMFJS.log("[gdi] saveDC");
	var prevstate = this.state;
	this.state = new WMFJS.GDIContextState(this.state);
	this.statestack.push(prevstate);
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.restoreDC = function(saved) {
	WMFJS.log("[gdi] restoreDC: saved=" + saved);
	if (this.statestack.length > 1) {
		if (saved == -1) {
			this.state = this.statestack.pop();
		} else if (saved < -1) {
			throw new WMFJS.Error("restoreDC: relative restore not implemented");
		} else if (saved > 1) {
			throw new WMFJS.Error("restoreDC: absolute restore not implemented");
		}
	} else {
		throw new WMFJS.Error("No saved contexts");
	}
	
	this.state._svggroup = null;
};

WMFJS.GDIContext.prototype.escape = function(func, blob, offset, count) {
	WMFJS.log("[gdi] escape: func=" + func + " offset=" + offset + " count=" + count);
};

WMFJS.GDIContext.prototype.setStretchBltMode = function(stretchMode) {
	WMFJS.log("[gdi] setStretchBltMode: stretchMode=" + stretchMode);
};

WMFJS.GDIContext.prototype.stretchDib = function(srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, rasterOp, colorUsage, dib) {
	WMFJS.log("[gdi] stretchDibBits: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16));
	srcX = this._todevX(srcX);
	srcY = this._todevY(srcY);
	srcW = this._todevW(srcW);
	srcH = this._todevH(srcH);
	dstX = this._todevX(dstX);
	dstY = this._todevY(dstY);
	dstW = this._todevW(dstW);
	dstH = this._todevH(dstH);
	WMFJS.log("[gdi] stretchDib: TRANSLATED: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16) + " colorUsage=0x" + colorUsage.toString(16));
	this._pushGroup();
	this._svg.image(this.state._svggroup, dstX, dstY, dstW, dstH, dib.base64ref());
};

WMFJS.GDIContext.prototype.stretchDibBits = function(srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, rasterOp, dib) {
	WMFJS.log("[gdi] stretchDibBits: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16));
	srcX = this._todevX(srcX);
	srcY = this._todevY(srcY);
	srcW = this._todevW(srcW);
	srcH = this._todevH(srcH);
	dstX = this._todevX(dstX);
	dstY = this._todevY(dstY);
	dstW = this._todevW(dstW);
	dstH = this._todevH(dstH);
	WMFJS.log("[gdi] stretchDibBits: TRANSLATED: srcX=" + srcX + " srcY=" + srcY + " srcW=" + srcW + " srcH=" + srcH + " dstX=" + dstX + " dstY=" + dstY + " dstW=" + dstW + " dstH=" + dstH + " rasterOp=0x" + rasterOp.toString(16));
	this._pushGroup();
	this._svg.image(this.state._svggroup, dstX, dstY, dstW, dstH, dib.base64ref());
};

WMFJS.GDIContext.prototype._applyOpts = function(opts, usePen, useBrush, useFont) {
	if (opts == null)
		opts = {};
	if (usePen) {
		var pen = this.state.selected.pen;
		if (pen.style != WMFJS.GDI.PenStyle.PS_NULL) {
			opts.stroke =  "#" + pen.color.toHex(), // TODO: pen style
			opts.strokeWidth = this._todevW(pen.width.x) // TODO: is .y ever used?
			
			var dotWidth;
			if ((pen.linecap & WMFJS.GDI.PenStyle.PS_ENDCAP_SQUARE) != 0) {
				opts["stroke-linecap"] = "square";
				dotWidth = 1;
			} else if ((pen.linecap & WMFJS.GDI.PenStyle.PS_ENDCAP_FLAT) != 0) {
				opts["stroke-linecap"] = "butt";
				dotWidth = opts.strokeWidth;
			} else {
				opts["stroke-linecap"] = "round";
				dotWidth = 1;
			}
			
			if ((pen.join & WMFJS.GDI.PenStyle.PS_JOIN_BEVEL) != 0)
				opts["stroke-linejoin"] = "bevel";
			else if ((pen.join & WMFJS.GDI.PenStyle.PS_JOIN_MITER) != 0)
				opts["stroke-linejoin"] = "miter";
			else
				opts["stroke-linejoin"] = "round";
			
			var dashWidth = opts.strokeWidth * 4;
			var dotSpacing = opts.strokeWidth * 2;
			switch (pen.style) {
				case WMFJS.GDI.PenStyle.PS_DASH:
					opts["stroke-dasharray"] = [dashWidth, dotSpacing].toString();
					break;
				case WMFJS.GDI.PenStyle.PS_DOT:
					opts["stroke-dasharray"] = [dotWidth, dotSpacing].toString();
					break;
				case WMFJS.GDI.PenStyle.PS_DASHDOT:
					opts["stroke-dasharray"] = [dashWidth, dotSpacing, dotWidth, dotSpacing].toString();
					break;
				case WMFJS.GDI.PenStyle.PS_DASHDOTDOT:
					opts["stroke-dasharray"] = [dashWidth, dotSpacing, dotWidth, dotSpacing, dotWidth, dotSpacing].toString();
					break;
			}
		}
	}
	if (useBrush) {
		var brush = this.state.selected.brush;
		switch (brush.style) {
			case WMFJS.GDI.BrushStyle.BS_SOLID:
				opts.fill = "#" + brush.color.toHex();
				break;
			case WMFJS.GDI.BrushStyle.BS_PATTERN:
			case WMFJS.GDI.BrushStyle.BS_DIBPATTERNPT:
				opts.fill = "url(#" + this._getSvgPatternForBrush(brush) + ")";
				break;
			case WMFJS.GDI.BrushStyle.BS_NULL:
				opts.fill = "none";
				break;
			default:
				WMFJS.log("[gdi] unsupported brush style: " + brush.style);
				opts.fill = "none";
				break;
		}
	}
	if (useFont) {
		var font = this.state.selected.font;
		opts["font-family"] = font.facename;
		opts["font-size"] = this._todevH(Math.abs(font.height));
		opts["fill"] = "#" + this.state.textcolor.toHex();
	}
	return opts;
};

WMFJS.GDIContext.prototype.rectangle = function(rect, rw, rh) {
	WMFJS.log("[gdi] rectangle: rect=" + rect.toString() + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
	var bottom = this._todevY(rect.bottom);
	var right = this._todevX(rect.right);
	var top = this._todevY(rect.top);
	var left = this._todevX(rect.left);
	rw = this._todevH(rw);
	rh = this._todevH(rh);
	WMFJS.log("[gdi] rectangle: TRANSLATED: bottom=" + bottom + " right=" + right + " top=" + top + " left=" + left + " rh=" + rh + " rw=" + rw);
	this._pushGroup();
	
	var opts = this._applyOpts(null, true, true, false);
	this._svg.rect(this.state._svggroup, left, top, right - left, bottom - top, rw / 2, rh / 2, opts);
};

WMFJS.GDIContext.prototype.textOut = function(x, y, text) {
	WMFJS.log("[gdi] textOut: x=" + x + " y=" + y + " text=" + text + " with font " + this.state.selected.font.toString());
	x = this._todevX(x);
	y = this._todevY(y);
	WMFJS.log("[gdi] textOut: TRANSLATED: x=" + x + " y=" + y);
	this._pushGroup();
	
	var opts = this._applyOpts(null, false, false, true);
	if (this.state.selected.font.escapement != 0) {
		opts.transform = "rotate(" + [(-this.state.selected.font.escapement / 10), x, y] + ")";
		opts.style = "dominant-baseline: middle; text-anchor: start;";
	}
	if (this.state.bkmode == WMFJS.GDI.MixMode.OPAQUE) {
		if (this.state._svgtextbkfilter == null) {
			var filterId = WMFJS._makeUniqueId("f");
			var filter = this._svg.filter(this._getSvgDef(), filterId, 0, 0, 1, 1);
			this._svg.filters.flood(filter, null, "#" + this.state.bkcolor.toHex(), 1.0);
			this._svg.filters.composite(filter, null, null, "SourceGraphic");
			this.state._svgtextbkfilter = filter;
		}
		
		opts.filter = "url(#" + $(this.state._svgtextbkfilter).attr("id") + ")";
	}
	this._svg.text(this.state._svggroup, x, y, text, opts);
};

WMFJS.GDIContext.prototype.lineTo = function(x, y) {
	WMFJS.log("[gdi] lineTo: x=" + x + " y=" + y + " with pen " + this.state.selected.pen.toString());
	var toX = this._todevX(x);
	var toY = this._todevY(y);
	var fromX = this._todevX(this.state.x);
	var fromY = this._todevY(this.state.y);
	
	// Update position
	this.state.x = x;
	this.state.y = y;
	
	WMFJS.log("[gdi] lineTo: TRANSLATED: toX=" + toX + " toY=" + toY + " fromX=" + fromX + " fromY=" + fromY);
	this._pushGroup();
	
	var opts = this._applyOpts(null, true, false, false);
	this._svg.line(this.state._svggroup, fromX, fromY, toX, toY, opts);
}

WMFJS.GDIContext.prototype.moveTo = function(x, y) {
	WMFJS.log("[gdi] moveTo: x=" + x + " y=" + y);
	this.state.x = x;
	this.state.y = y;
}

WMFJS.GDIContext.prototype.polygon = function(points) {
	WMFJS.log("[gdi] polygon: points=" + points + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
	var pts = [];
	for (var i = 0; i < points.length; i++) {
		var point = points[i];
		pts.push([this._todevX(point.x), this._todevY(point.y)]);
	}
	WMFJS.log("[gdi] polygon: TRANSLATED: pts=" + pts);
	this._pushGroup();
	var opts = {
		"fill-rule": this.state.polyfillmode == WMFJS.GDI.PolyFillMode.ALTERNATE ? "evenodd" : "nonzero",
	};
	this._applyOpts(opts, true, true, false);
	this._svg.polygon(this.state._svggroup, pts, opts);
};

WMFJS.GDIContext.prototype.polyPolygon = function(polyPolygon) {
	WMFJS.log("[gdi] polyPolygon: polyPolygon=" + JSON.stringify(polyPolygon) + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
	this._pushGroup();
	var cnt = polyPolygon._polygons.length;
	for (var i = 0; i < cnt; i++)
		this.polygon(polyPolygon._polygons[i]);
};

WMFJS.GDIContext.prototype.polyline = function(points) {
	WMFJS.log("[gdi] polyline: points=" + points + " with pen " + this.state.selected.pen.toString());
	var pts = [];
	for (var i = 0; i < points.length; i++) {
		var point = points[i];
		pts.push([this._todevX(point.x), this._todevY(point.y)]);
	}
	WMFJS.log("[gdi] polyline: TRANSLATED: pts=" + pts);
	this._pushGroup();
	var opts = this._applyOpts({fill: "none"}, true, false, false);
	this._svg.polyline(this.state._svggroup, pts, opts);
};

WMFJS.GDIContext.prototype.ellipse = function(rect) {
	WMFJS.log("[gdi] ellipse: rect=" + rect.toString() + " with pen " + this.state.selected.pen.toString() + " and brush " + this.state.selected.brush.toString());
	var bottom = this._todevY(rect.bottom);
	var right = this._todevX(rect.right);
	var top = this._todevY(rect.top);
	var left = this._todevX(rect.left);
	WMFJS.log("[gdi] ellipse: TRANSLATED: bottom=" + bottom + " right=" + right + " top=" + top + " left=" + left);
	this._pushGroup();
	var width2 = (right - left) / 2;
	var height2 = (bottom - top) / 2;
	var opts = this._applyOpts(null, true, true, false);
	this._svg.ellipse(this.state._svggroup, left + width2, top + height2, width2, height2, opts);
};

WMFJS.GDIContext.prototype.excludeClipRect = function(rect) {
	WMFJS.log("[gdi] excludeClipRect: rect=" + rect.toString());
	this._getClipRgn().subtract(rect);
};

WMFJS.GDIContext.prototype.intersectClipRect = function(rect) {
	WMFJS.log("[gdi] intersectClipRect: rect=" + rect.toString());
	this._getClipRgn().intersect(rect);
};

WMFJS.GDIContext.prototype.offsetClipRgn = function(offX, offY) {
	WMFJS.log("[gdi] offsetClipRgn: offX=" + offX + " offY=" + offY);
	this._getClipRgn().offset(offX, offY);
};

WMFJS.GDIContext.prototype.setTextAlign = function(textAlignmentMode) {
	WMFJS.log("[gdi] setTextAlign: textAlignmentMode=0x" + textAlignmentMode.toString(16));
	this.state.textalign = textAlignmentMode;
};

WMFJS.GDIContext.prototype.setBkMode = function(bkMode) {
	WMFJS.log("[gdi] setBkMode: bkMode=0x" + bkMode.toString(16));
	this.state.bkmode = bkMode;
};

WMFJS.GDIContext.prototype.setTextColor = function(textColor) {
	WMFJS.log("[gdi] setTextColor: textColor=" + textColor.toString());
	this.state.textcolor = textColor;
};

WMFJS.GDIContext.prototype.setBkColor = function(bkColor) {
	WMFJS.log("[gdi] setBkColor: bkColor=" + bkColor.toString());
	this.state.bkcolor = bkColor;
	this.state._svgtextbkfilter = null;
};

WMFJS.GDIContext.prototype.setPolyFillMode = function(polyFillMode) {
	WMFJS.log("[gdi] setPolyFillMode: polyFillMode=" + polyFillMode);
	this.state.polyfillmode = polyFillMode;
};

WMFJS.GDIContext.prototype.createBrush = function(brush) {
	var idx = this._storeObject(brush);
	WMFJS.log("[gdi] createBrush: brush=" + brush.toString() + " with handle " + idx);
};

WMFJS.GDIContext.prototype.createFont = function(font) {
	var idx = this._storeObject(font);
	WMFJS.log("[gdi] createFont: font=" + font.toString() + " with handle " + idx);
};

WMFJS.GDIContext.prototype.createPen = function(pen) {
	var idx = this._storeObject(pen);
	WMFJS.log("[gdi] createPen: pen=" + pen.toString() + " width handle " + idx);
};

WMFJS.GDIContext.prototype.createPalette = function(palette) {
	var idx = this._storeObject(palette);
	WMFJS.log("[gdi] createPalette: palette=" + palette.toString() + " width handle " + idx);
};

WMFJS.GDIContext.prototype.createRegion = function(region) {
	var idx = this._storeObject(region);
	WMFJS.log("[gdi] createRegion: region=" + region.toString() + " width handle " + idx);
};

WMFJS.GDIContext.prototype.createPatternBrush = function(patternBrush) {
	var idx = this._storeObject(patternBrush);
	WMFJS.log("[gdi] createRegion: region=" + patternBrush.toString() + " width handle " + idx);
};

WMFJS.GDIContext.prototype.selectObject = function(objIdx, checkType) {
	var obj = this._getObject(objIdx);
	if (obj != null && (checkType == null || obj.type == checkType)) {
		this._selectObject(obj);
		WMFJS.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " selected " + obj.type + ": " + obj.toString() : "[invalid index]"));
	} else {
		WMFJS.log("[gdi] selectObject: objIdx=" + objIdx + (obj ? " invalid object type: " + obj.type : "[invalid index]"));
	}
};

WMFJS.GDIContext.prototype.deleteObject = function(objIdx) {
	var ret = this._deleteObject(objIdx);
	WMFJS.log("[gdi] deleteObject: objIdx=" + objIdx + (ret ? " deleted object" : "[invalid index]"));
};

WMFJS.WMFRect16 = function(reader) {
	this.left = reader.readInt16();
	this.top = reader.readInt16();
	this.right = reader.readInt16();
	this.bottom = reader.readInt16();
};

WMFJS.WMFRect16.prototype.toString = function() {
	return "{left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + "}";
};

WMFJS.WMFRecords = function(reader, first) {
	this._records = [];
	
	var all = false;
	var curpos = first;
	main_loop: while (!all) {
		reader.seek(curpos);
		var size = reader.readUint32();
		if (size < 3)
			throw new WMFJS.Error("Invalid record size");
		var type = reader.readUint16();
		switch (type) {
			case WMFJS.GDI.RecordType.META_EOF:
				all = true;
				break main_loop;
			case WMFJS.GDI.RecordType.META_SETMAPMODE:
				var mapMode = reader.readUint16();
				this._records.push(
					(function(mapMode) {
						return function(gdi) {
							gdi.setMapMode(mapMode);
						}
					})(mapMode)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETWINDOWORG:
				var y = reader.readInt16();
				var x = reader.readInt16();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setWindowOrg(x, y);
						}
					})(y, x)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETWINDOWEXT:
				var y = reader.readInt16();
				var x = reader.readInt16();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setWindowExt(x, y);
						}
					})(y, x)
				);
				break;
			case WMFJS.GDI.RecordType.META_OFFSETWINDOWORG:
				var offY = reader.readInt16();
				var offX = reader.readInt16();
				this._records.push(
					(function(offY, offX) {
						return function(gdi) {
							gdi.offsetWindowOrg(offX, offY);
						}
					})(offY, offX)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETVIEWPORTORG:
				var y = reader.readInt16();
				var x = reader.readInt16();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setViewportOrg(x, y);
						}
					})(y, x)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETVIEWPORTEXT:
				var y = reader.readInt16();
				var x = reader.readInt16();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.setViewportExt(x, y);
						}
					})(y, x)
				);
				break;
			case WMFJS.GDI.RecordType.META_OFFSETVIEWPORTORG:
				var offY = reader.readInt16();
				var offX = reader.readInt16();
				this._records.push(
					(function(offY, offX) {
						return function(gdi) {
							gdi.offsetViewportOrg(offX, offY);
						}
					})(offY, offX)
				);
				break;
			case WMFJS.GDI.RecordType.META_SAVEDC:
				this._records.push(function(gdi) {
					gdi.saveDC();
				});
				break;
			case WMFJS.GDI.RecordType.META_RESTOREDC:
				var saved = reader.readInt16();
				this._records.push(
					(function(saved) {
						return function(gdi) {
							gdi.restoreDC(saved);
						}
					})(saved)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETSTRETCHBLTMODE:
				var stretchMode = reader.readUint16();
				this._records.push(
					(function(stretchMode) {
						return function(gdi) {
							gdi.setStretchBltMode(stretchMode);
						}
					})(stretchMode)
				);
				break;
			case WMFJS.GDI.RecordType.META_DIBSTRETCHBLT:
				var haveSrcDib = ((type >> 8) + 3 != size);
				var rasterOp = reader.readUint16() | (reader.readUint16() << 16);
				var srcH = reader.readInt16();
				var srcW = reader.readInt16();
				var srcY = reader.readInt16();
				var srcX = reader.readInt16();
				var destH = reader.readInt16();
				var destW = reader.readInt16();
				var destY = reader.readInt16();
				var destX = reader.readInt16();
				var datalength = size * 2 - (reader.pos - curpos);
				var dib = new WMFJS.DIBitmap(reader, datalength);
				this._records.push(
					(function(rasterOp, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib) {
						return function(gdi) {
							gdi.stretchDibBits(srcX, srcY, srcW, srcH, destX, destY, destW, destH, rasterOp, dib);
						}
					})(rasterOp, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib)
				);
				break;
			case WMFJS.GDI.RecordType.META_STRETCHDIB:
				var rasterOp = reader.readUint16() | (reader.readUint16() << 16);
				var colorUsage = reader.readInt16();
				var srcH = reader.readInt16();
				var srcW = reader.readInt16();
				var srcY = reader.readInt16();
				var srcX = reader.readInt16();
				var destH = reader.readInt16();
				var destW = reader.readInt16();
				var destY = reader.readInt16();
				var destX = reader.readInt16();
				var datalength = size * 2 - (reader.pos - curpos);
				var dib = new WMFJS.DIBitmap(reader, datalength);
				this._records.push(
					(function(rasterOp, colorUsage, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib) {
						return function(gdi) {
							gdi.stretchDib(srcX, srcY, srcW, srcH, destX, destY, destW, destH, rasterOp, colorUsage, dib);
						}
					})(rasterOp, colorUsage, srcH, srcW, srcY, srcX, destH, destW, destY, destX, dib)
				);
				break;
			case WMFJS.GDI.RecordType.META_ESCAPE:
				var func = reader.readUint16();
				var count = reader.readUint16();
				var offset = reader.pos;
				var blob = new WMFJS.Blob(reader, offset);
				this._records.push(
					(function(func, count, offset, blob) {
						return function(gdi) {
							gdi.escape(func, blob, offset, count);
						}
					})(func, count, offset, blob)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETTEXTALIGN:
				var textAlign = reader.readUint16();
				this._records.push(
					(function(textAlign) {
						return function(gdi) {
							gdi.setTextAlign(textAlign);
						}
					})(textAlign)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETBKMODE:
				var bkMode = reader.readUint16();
				this._records.push(
					(function(bkMode) {
						return function(gdi) {
							gdi.setBkMode(bkMode);
						}
					})(bkMode)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETTEXTCOLOR:
				var textColor = new WMFJS.ColorRef(reader);
				this._records.push(
					(function(textColor) {
						return function(gdi) {
							gdi.setTextColor(textColor);
						}
					})(textColor)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETBKCOLOR:
				var bkColor = new WMFJS.ColorRef(reader);
				this._records.push(
					(function(bkColor) {
						return function(gdi) {
							gdi.setBkColor(bkColor);
						}
					})(bkColor)
				);
				break;
			case WMFJS.GDI.RecordType.META_CREATEBRUSHINDIRECT:
				var datalength = size * 2 - (reader.pos - curpos);
				var brush = new WMFJS.Brush(reader, datalength, false);
				this._records.push(
					(function(brush, datalength) {
						return function(gdi) {
							gdi.createBrush(brush);
						}
					})(brush, datalength)
				);
				break;
			case WMFJS.GDI.RecordType.META_DIBCREATEPATTERNBRUSH:
				var datalength = size * 2 - (reader.pos - curpos);
				var brush = new WMFJS.Brush(reader, datalength, true);
				this._records.push(
					(function(brush, datalength) {
						return function(gdi) {
							gdi.createBrush(brush);
						}
					})(brush, datalength)
				);
				break;
			case WMFJS.GDI.RecordType.META_CREATEPENINDIRECT:
				var pen = new WMFJS.Pen(reader);
				this._records.push(
					(function(pen) {
						return function(gdi) {
							gdi.createPen(pen);
						}
					})(pen)
				);
				break;
			case WMFJS.GDI.RecordType.META_CREATEFONTINDIRECT:
				var datalength = size * 2 - (reader.pos - curpos);
				var font = new WMFJS.Font(reader, datalength);
				this._records.push(
					(function(font, datalength) {
						return function(gdi) {
							gdi.createFont(font);
						}
					})(font, datalength)
				);
				break;
			case WMFJS.GDI.RecordType.META_SELECTOBJECT:
				var idx = reader.readUint16();
				this._records.push(
					(function(idx) {
						return function(gdi) {
							gdi.selectObject(idx, null);
						}
					})(idx)
				);
				break;
			case WMFJS.GDI.RecordType.META_SELECTPALETTE:
				var idx = reader.readUint16();
				this._records.push(
					(function(idx) {
						return function(gdi) {
							gdi.selectObject(idx, "palette");
						}
					})(idx)
				);
				break;
			case WMFJS.GDI.RecordType.META_SELECTCLIPREGION:
				var idx = reader.readUint16();
				this._records.push(
					(function(idx) {
						return function(gdi) {
							gdi.selectObject(idx, "region");
						}
					})(idx)
				);
				break;
			case WMFJS.GDI.RecordType.META_DELETEOBJECT:
				var idx = reader.readUint16();
				this._records.push(
					(function(idx) {
						return function(gdi) {
							gdi.deleteObject(idx);
						}
					})(idx)
				);
				break;
			case WMFJS.GDI.RecordType.META_RECTANGLE:
				var rect = new WMFJS.Rect(reader);
				this._records.push(
					(function(rect) {
						return function(gdi) {
							gdi.rectangle(rect, 0, 0);
						}
					})(rect)
				);
				break;
			case WMFJS.GDI.RecordType.META_ROUNDRECT:
				var rh = reader.readInt16();
				var rw = reader.readInt16();
				var rect = new WMFJS.Rect(reader);
				this._records.push(
					(function(rh, rw, rect) {
						return function(gdi) {
							gdi.rectangle(rect, rw, rh);
						}
					})(rh, rw, rect)
				);
				break;
			case WMFJS.GDI.RecordType.META_LINETO:
				var y = reader.readInt16();
				var x = reader.readInt16();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.lineTo(x, y);
						}
					})(y, x)
				);
				break;
			case WMFJS.GDI.RecordType.META_MOVETO:
				var y = reader.readInt16();
				var x = reader.readInt16();
				this._records.push(
					(function(y, x) {
						return function(gdi) {
							gdi.moveTo(x, y);
						}
					})(y, x)
				);
				break;
			case WMFJS.GDI.RecordType.META_TEXTOUT:
				var len = reader.readInt16();
				if (len > 0) {
					var text = reader.readString(len);
					reader.skip(len % 2);
					var y = reader.readInt16();
					var x = reader.readInt16();
					this._records.push(
						(function(text, y, x) {
							return function(gdi) {
								gdi.textOut(x, y, text);
							}
						})(text, y, x)
					);
				}
				break;
			case WMFJS.GDI.RecordType.META_EXCLUDECLIPRECT:
				var rect = new WMFJS.Rect(reader);
				this._records.push(
					(function(rect) {
						return function(gdi) {
							gdi.excludeClipRect(rect);
						}
					})(rect)
				);
				break;
			case WMFJS.GDI.RecordType.META_INTERSECTCLIPRECT:
				var rect = new WMFJS.Rect(reader);
				this._records.push(
					(function(rect) {
						return function(gdi) {
							gdi.intersectClipRect(rect);
						}
					})(rect)
				);
				break;
			case WMFJS.GDI.RecordType.META_POLYGON:
				var cnt = reader.readInt16();
				var points = [];
				while (cnt > 0) {
					points.push(new WMFJS.PointS(reader));
					cnt--;
				}
				this._records.push(
					(function(points) {
						return function(gdi) {
							gdi.polygon(points);
						}
					})(points)
				);
				break;
			case WMFJS.GDI.RecordType.META_SETPOLYFILLMODE:
				var polyfillmode = reader.readUint16();
				this._records.push(
					(function(polyfillmode) {
						return function(gdi) {
							gdi.setPolyFillMode(polyfillmode);
						}
					})(polyfillmode)
				);
				break;
			case WMFJS.GDI.RecordType.META_POLYPOLYGON:
				var polyPolygon = new WMFJS.PolyPolygon(reader);
				this._records.push(
					(function(polyPolygon) {
						return function(gdi) {
							gdi.polyPolygon(polyPolygon);
						}
					})(polyPolygon)
				);
				break;
			case WMFJS.GDI.RecordType.META_POLYLINE:
				var cnt = reader.readInt16();
				var points = [];
				while (cnt > 0) {
					points.push(new WMFJS.PointS(reader));
					cnt--;
				}
				this._records.push(
					(function(points) {
						return function(gdi) {
							gdi.polyline(points);
						}
					})(points)
				);
				break;
			case WMFJS.GDI.RecordType.META_ELLIPSE:
				var rect = new WMFJS.Rect(reader);
				this._records.push(
					(function(rect) {
						return function(gdi) {
							gdi.ellipse(rect);
						}
					})(rect)
				);
				break;
			case WMFJS.GDI.RecordType.META_CREATEPALETTE:
				var palette = new WMFJS.Palette(reader);
				this._records.push(
					(function(palette) {
						return function(gdi) {
							gdi.createPalette(palette);
						}
					})(palette)
				);
				break;
			case WMFJS.GDI.RecordType.META_CREATEREGION:
				var region = new WMFJS.Region(reader);
				this._records.push(
					(function(region) {
						return function(gdi) {
							gdi.createRegion(region);
						}
					})(region)
				);
				break;
			case WMFJS.GDI.RecordType.META_CREATEPATTERNBRUSH:
				var datalength = size * 2 - (reader.pos - curpos);
				var patternBitmap = new WMFJS.PatternBitmap16(reader, datalength);
				var brush = new WMFJS.Brush(reader, datalength, patternBitmap);
				this._records.push(
					(function(brush) {
						return function(gdi) {
							gdi.createPatternBrush(brush);
						}
					})(brush)
				);
				break;
			case WMFJS.GDI.RecordType.META_OFFSETCLIPRGN:
				var offY = reader.readInt16();
				var offX = reader.readInt16();
				this._records.push(
					(function(offY, offX) {
						return function(gdi) {
							gdi.offsetClipRgn(offX, offY);
						}
					})(offY, offX)
				);
				break;
			case WMFJS.GDI.RecordType.META_REALIZEPALETTE:
			case WMFJS.GDI.RecordType.META_SETPALENTRIES:
			case WMFJS.GDI.RecordType.META_SETROP2:
			case WMFJS.GDI.RecordType.META_SETRELABS:
			case WMFJS.GDI.RecordType.META_SETTEXTCHAREXTRA:
			case WMFJS.GDI.RecordType.META_RESIZEPALETTE:
			case WMFJS.GDI.RecordType.META_SETLAYOUT:
			case WMFJS.GDI.RecordType.META_FILLREGION:
			case WMFJS.GDI.RecordType.META_SETMAPPERFLAGS:
			case WMFJS.GDI.RecordType.META_SETTEXTJUSTIFICATION:
			case WMFJS.GDI.RecordType.META_SCALEWINDOWEXT:
			case WMFJS.GDI.RecordType.META_SCALEVIEWPORTEXT:
			case WMFJS.GDI.RecordType.META_FLOODFILL:
			case WMFJS.GDI.RecordType.META_FRAMEREGION:
			case WMFJS.GDI.RecordType.META_ANIMATEPALETTE:
			case WMFJS.GDI.RecordType.META_EXTFLOODFILL:
			case WMFJS.GDI.RecordType.META_SETPIXEL:
			case WMFJS.GDI.RecordType.META_PATBLT:
			case WMFJS.GDI.RecordType.META_PIE:
			case WMFJS.GDI.RecordType.META_STRETCHBLT:
			case WMFJS.GDI.RecordType.META_INVERTREGION:
			case WMFJS.GDI.RecordType.META_PAINTREGION:
			case WMFJS.GDI.RecordType.META_ARC:
			case WMFJS.GDI.RecordType.META_CHORD:
			case WMFJS.GDI.RecordType.META_BITBLT:
			case WMFJS.GDI.RecordType.META_EXTTEXTOUT:
			case WMFJS.GDI.RecordType.META_SETDIBTODEV:
			case WMFJS.GDI.RecordType.META_DIBBITBLT:
				WMFJS.log("[WMF] record 0x" + type.toString(16) + " at offset 0x" + curpos.toString(16) + " with " + (size * 2) + " bytes");
				break;
			default:
				WMFJS.log("[WMF] UNKNOWN record 0x" + type.toString(16) + " at offset 0x" + curpos.toString(16) + " with " + (size * 2) + " bytes");
				//throw new WMFJS.Error("Record type not recognized: 0x" + type.toString(16));
				break;
		}
		
		curpos += size * 2;
	}
	
	if (!all)
		throw new WMFJS.Error("Could not read all records");
};

WMFJS.WMFRecords.prototype.play = function(gdi) {
	var len = this._records.length;
	for (var i = 0; i < len; i++) {
		this._records[i].call(this, gdi);
	}
};

WMFJS.WMFPlacable = function(reader) {
	reader.skip(2);
	this.boundingBox = new WMFJS.WMFRect16(reader);
	this.unitsPerInch = reader.readInt16();
	reader.skip(4);
	reader.skip(2); // TODO: checksum
	WMFJS.log("Got bounding box " + this.boundingBox + " and " + this.unitsPerInch + " units/inch");
};

WMFJS.WMF = function(reader, placable, version, hdrsize) {
	this._reader = reader;
	this._version = version;
	this._hdrsize = hdrsize;
	this._placable = placable;
	this._img = null;
	this._records = new WMFJS.WMFRecords(reader, this._hdrsize);
};

WMFJS.WMF.prototype.render = function(gdi) {
	this._records.play(gdi);
};

WMFJS.Renderer = function(blob) {
	this.parse(blob);
	WMFJS.log("WMFJS.Renderer instantiated");
};

WMFJS.Renderer.prototype.parse = function(blob) {
	this._img = null;
	
	var reader = new WMFJS.Blob(blob);
	
	var type, size, placeable, headerstart;
	var key = reader.readUint32();
	if (key == 0x9ac6cdd7) {
		placable = new WMFJS.WMFPlacable(reader);
		headerstart = reader.pos;
		type = reader.readUint16();
		size = reader.readUint16();
	} else {
		headerstart = 0;
		type = key & 0xffff;
		size = (key >>> 16) & 0xffff;
	}
	switch (type) {
		case WMFJS.GDI.MetafileType.MEMORYMETAFILE:
		case WMFJS.GDI.MetafileType.DISKMETAFILE:
			if (size == WMFJS.GDI.METAHEADER_SIZE / 2) {
				var version = reader.readUint16();
				switch (version) {
					case WMFJS.GDI.MetafileVersion.METAVERSION100:
					case WMFJS.GDI.MetafileVersion.METAVERSION300:
						this._img = new WMFJS.WMF(reader, placeable, version, headerstart + (size * 2));
						break;
				}
			}
			break;
	}
	
	if (this._img == null)
		throw new WMFJS.Error("Format not recognized");
};

WMFJS.Renderer.prototype._render = function(svg, mapMode, xExt, yExt) {
	// See https://www-user.tu-chemnitz.de/~ygu/petzold/ch18b.htm
	var gdi = new WMFJS.GDIContext(svg);
	gdi.setViewportExt(xExt, yExt);
	gdi.setMapMode(mapMode);
	WMFJS.log("[WMF] BEGIN RENDERING --->");
	this._img.render(gdi);
	WMFJS.log("[WMF] <--- DONE RENDERING");
};

WMFJS.Renderer.prototype.render = function(info) {
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
