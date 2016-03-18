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

if (typeof RTFJS === "undefined") {
	(typeof window !== "undefined" ? window : this).RTFJS = {
		Error: function(message) {
			this.message = message;
		},
		_A: "A".charCodeAt(0),
		_a: "a".charCodeAt(0),
		_F: "F".charCodeAt(0),
		_f: "f".charCodeAt(0),
		_Z: "Z".charCodeAt(0),
		_z: "z".charCodeAt(0),
		_0: "0".charCodeAt(0),
		_9: "9".charCodeAt(0),
		
		JUSTIFICATION: {
			LEFT: "left",
			CENTER: "center",
			RIGHT: "right",
			JUSTIFY: "justify"
		},
		BREAKTYPE: {
			NONE: "none",
			COL: "col", // TODO: ???
			EVEN: "even",
			ODD: "odd",
			PAGE: "page"
		},
		PAGENUMBER: {
			DECIMAL: "decimal",
			UROM: "urom", // TODO: ???
			LROM: "lrom", // TODO: ???
			ULTR: "ultr", // TODO: ???
			LLTR: "lltr" // TODO: ???
		},
		UNDERLINE: {
			NONE: "none",
			CONTINUOUS: "continuous",
			DOTTED: "dotted",
			DASHED: "dashed",
			DASHDOTTED: "dashdotted",
			DASHDOTDOTTED:" dashdotdotted",
			DOUBLE: "double",
			HEAVYWAVE: "heavywave",
			LONGDASHED: "longdashed",
			THICK: "thick",
			THICKDOTTED: "thickdotted",
			THICKDASHED: "thickdashed",
			THICKDASHDOTTED: "thickdashdotted",
			THICKDASHDOTDOTTED: "thickdashdotdotted",
			THICKLONGDASH: "thicklongdash",
			DOUBLEWAVE: "doublewave",
			WORD: "word",
			WAVE: "wave"
		},
		FONTPITCH: {
			DEFAULT: 0,
			FIXED: 1,
			VARIABLE: 2
		},
		
		_isalpha: function(str) {
			var len = str.length;
			for (var i = 0; i < len; i++) {
				var ch = str.charCodeAt(i);
				if (!((ch >= this._A && ch <= this._Z) ||
				      (ch >= this._a && ch <= this._z))) {
					return false;
				}
			}
			return len > 0;
		},
		_isdigit: function(str) {
			var len = str.length;
			for (var i = 0; i < len; i++) {
				var ch = str.charCodeAt(i);
				if (ch < this._0 || ch > this._9)
					return false;
			}
			return len > 0;
		},
		_parseHex: function(str) {
			var len = str.length;
			for (var i = 0; i < len; i++) {
				var ch = str.charCodeAt(i);
				if (!((ch >= this._0 && ch <= this._9) ||
				      (ch >= this._a && ch <= this._f) ||
				      (ch >= this._A && ch <= this._F))) {
					return NaN
				}
			}
			if (len > 0)
				return parseInt(str, 16);
			return NaN;
		},
		_blobToBinary: function(blob) {
			var view = new Uint8Array(blob);
			var ret = "";
			var len = view.length;
			for (var i = 0; i < len; i++)
				ret += String.fromCharCode(view[i]);
			return ret;
		},
		_hexToBlob: function(str) {
			var len = str.length;
			var buf = new ArrayBuffer(Math.floor(len-- / 2));
			var view = new Uint8Array(buf);
			var d = 0;
			for (var i = 0; i < len; i += 2) {
				var val = this._parseHex(str.substr(i, 2));
				if (isNaN(val))
					return null;
				view[d++] = val;
			}
			return buf;
		},
		_hexToBinary: function(str) {
			var bin = ""
			var len = str.length - 1;
			for (var i = 0; i < len; i += 2) {
				var val = this._parseHex(str.substr(i, 2));
				if (isNaN(val))
					return null;
				bin += String.fromCharCode(val);
			}
			return bin;
		},
		
		_charsetMap: {
			"0": "windows-1252",
			// TODO
		},
		_mapCharset: function(idx) {
			return this._charsetMap[idx.toString()];
		},
		
		_colorThemeMap: {
			// TODO
			maindarkone: null,
			mainlightone: null,
			maindarktwo: null,
			mainlighttwo: null,
			accentone: null,
			accenttwo: null,
			accentthree: null,
			accentfour: null,
			accentfive: null,
			accentsix: null,
			hyperlink: null,
			followedhyperlink: null,
			backgroundone: null,
			textone: null,
			backgroundtwo: null,
			texttwo: null,
		},
		_mapColorTheme: function(name) {
			return this.__colorThemeMap[name];
		},
		_colorToStr: function(color) {
			return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
		},
		_twipsToPt: function(twips) {
			return Math.floor(twips / 20);
		}
	};
}

RTFJS.RenderElement = function(doc, type, element) {
	this._doc = doc;
	this._type = type;
	this._element = element;
	this._pap = null;
	this._chp = null;
}

RTFJS.RenderElement.prototype.getElement = function() {
	return this._element;
};

RTFJS.RenderElement.prototype.getContent = function() {
	return this._element;
};

RTFJS.RenderElement.prototype.updateProps = function(pap, chp) {
	this._pap = pap;
	this._chp = chp;
};

RTFJS.RenderElement.prototype.finalize = function() {
	console.log("[rtf] finalizing element of type " + this._type);
	return this._element;
};

RTFJS.RenderTextElement = function(doc, text, chp) {
	RTFJS.RenderElement.call(this, doc, "text", $("<span>").text(text));
	this._chp = chp;
};

RTFJS.RenderTextElement.prototype = Object.create(RTFJS.RenderElement.prototype);

RTFJS.RenderTextElement.prototype.applyProps = function() {
	var chp = this._chp;
	var el = this.getElement();
	if (chp.bold)
		el.css("font-weight", "bold");
	if (chp.italic)
		el.css("font-style", "italic");
	if (chp.fontfamily)
		el.css("font-family", this._doc._fonts[chp.fontfamily].fontname.replace(";",""));
		
	var deco = [];
	if (chp.underline != RTFJS.UNDERLINE.NONE)
		deco.push("underline");
	if (chp.strikethrough || chp.dblstrikethrough)
		deco.push("line-through");
	
	if (deco.length > 0)
		el.css("text-decoration-line", deco.join(" "));
	if (chp.colorindex != 0) {
		var color = this._doc._lookupColor(chp.colorindex);
		if (color != null)
			el.css("color", RTFJS._colorToStr(color));
	}
	el.css("font-size", Math.floor(chp.fontsize / 2) + "pt");
};

RTFJS.RenderTextElement.prototype.finalize = function() {
	console.log("[rtf] finalizing text element");
	this.applyProps();
	return RTFJS.RenderElement.prototype.finalize.call(this);
}

RTFJS.RenderContainer = function(doc, type, element, content) {
	RTFJS.RenderElement.call(this, doc, type, element);
	this._content = content;
	this._sub = [];
};

RTFJS.RenderContainer.prototype = Object.create(RTFJS.RenderElement.prototype);

RTFJS.RenderContainer.prototype.getType = function() {
	return this._type;
};

RTFJS.RenderContainer.prototype.getContent = function() {
	return this._content;
};

RTFJS.RenderContainer.prototype.appendSub = function(container) {
	console.log("[rtf] appendSub for container " + this._type);
	this._sub.push({
		container: container
	});
};

RTFJS.RenderContainer.prototype._finalizeSub = function(sub) {
	return sub.container.finalize();
};

RTFJS.RenderContainer.prototype.finalize = function() {
	console.log("[rtf] finalizing container " + this._type);
	if (this._sub == null)
		throw new RTFJS.Error("Container already finalized");
	
	var cont = this.getContent();
	var len = this._sub.length;
	for (var i = 0; i < len; i++) {
		var element = this._finalizeSub(this._sub[i]);
		if (element != null)
			cont.append(element);
	}
	delete this._sub;
	return this._element;
};

RTFJS.RenderParagraphContainer = function(doc) {
	var par = $("<div>");
	RTFJS.RenderContainer.call(this, doc, "par", par, par);
};

RTFJS.RenderParagraphContainer.prototype = Object.create(RTFJS.RenderContainer.prototype);

RTFJS.RenderParagraphContainer.prototype.appendSub = function(container) {
	console.log("[rtf] appendSub for container " + this._type);
	this._sub.push({
		container: container,
		pap: container._pap != null ? container._pap : this._pap,
		chp: container._chp != null ? container._chp : this._chp
	});
};

RTFJS.RenderParagraphContainer.prototype.updateProps = function(pap, chp) {
	this._pap = pap;
	this._chp = chp;
	
	if (this._sub.length > 0) {
		var sub = this._sub[this._sub.length - 1];
		sub.pap = pap;
		sub.chp = chp;
	}
};

RTFJS.RenderParagraphContainer.prototype.applyPap = function(el, pap, chp, ismaindiv) {
	var el = this.getElement();
	if (ismaindiv) {
		if (pap.spacebefore != 0)
			el.css("margin-top", RTFJS._twipsToPt(pap.spacebefore) + "pt");
		else
			el.css("margin-top", "");
		if (pap.spaceafter != 0)
			el.css("margin-bottom", RTFJS._twipsToPt(pap.spaceafter) + "pt");
		else
			el.css("margin-bottom", "");
		if (chp != null)
			el.css("min-height", Math.floor(chp.fontsize / 2) + "pt");
	} else {
		switch (pap.justification) {
			case RTFJS.JUSTIFICATION.LEFT:
				el.css("text-align", "left");
				break;
			case RTFJS.JUSTIFICATION.RIGHT:
				el.css("text-align", "right");
				break;
			case RTFJS.JUSTIFICATION.CENTER:
				el.css("text-align", "center");
				break;
			case RTFJS.JUSTIFICATION.JUSTIFY:
				el.css("text-align", "justify");
				break;
		}
	}
};

RTFJS.RenderParagraphContainer.prototype._finalizeSub = function(sub) {
	var element = sub.container.finalize();
	if (element)
		this.applyPap(element, sub.pap, sub.chp);
	return element;
};

RTFJS.RenderParagraphContainer.prototype.finalize = function() {
	console.log("[rtf] finalizing paragraph");
	if (this._sub == null)
		throw new RTFJS.Error("Paragraph already finalized");
	if (this._sub.length > 0)
		return RTFJS.RenderContainer.prototype.finalize.call(this);
	
	delete this._sub;
	return null;
};

RTFJS.RenderTableContainer = function(doc) {
	RTFJS.RenderContainer.call(this, doc, "table", $("<table>"), null);
	this._rows = [];
	this._row = null;
	this._cell = null;
};

RTFJS.RenderTableContainer.prototype = Object.create(RTFJS.RenderContainer.prototype);

RTFJS.RenderTableContainer.prototype.appendCell = function() {
	console.log("[rtf] Table appending cell");
	if (this._row == null)
		this.appendRow();
	
	this._cell = {
		element: $("<td>").appendTo(this._row.element),
		sub: []
	};
	this._row.cells.push(this._cell);
};

RTFJS.RenderTableContainer.prototype.appendRow = function() {
	console.log("[rtf] Table appending row");
	this._row = {
		element: $("<tr>").appendTo(this._element),
		cells: []
	};
	this._rows.push(this._row);
	this.appendCell();
};

RTFJS.RenderTableContainer.prototype.finishRow = function() {
	console.log("[rtf] Table finish row");
	this.finishCell();
	this._row = null;
};

RTFJS.RenderTableContainer.prototype.finishCell = function() {
	console.log("[rtf] Table finish cell");
	var len = this._sub.length;
	if (len > 0) {
		if (this._row == null)
			this.appendRow();
		if (this._cell == null)
			this.appendCell();
		
		for (var i = 0; i < len; i++)
			this._cell.sub.push(this._sub[i]);
		this._sub = [];
	}
	
	this._cell = null;
};

RTFJS.RenderTableContainer.prototype.finalize = function() {
	console.log("[rtf] Table finalize");
	if (this._sub == null)
		throw new RTFJS.Error("Table container already finalized");
	
	var rlen = this._rows.length;
	console.log("[rtf] Table finalize: #rows: " + rlen);
	for (var r = 0; r < rlen; r++) {
		var row = this._rows[r];
		var clen = row.cells.length;
		console.log("[rtf] Table finalize: row[" + r + "].#cells: " + clen);
		for (var c = 0; c < clen; c++) {
			var cell = row.cells[c];
			
			var slen = cell.sub.length;
			console.log("[rtf] Table finalize: row[" + r + "].cell[" + c + "].#subs: " + slen);
			for (var s = 0; s < slen; s++) {
				var sub = cell.sub[s];
				var element = sub.finalize();
				if (element != null)
					cell.element.append(element);
			}
		}
	}
	
	delete this._sub;
	
	return this._element;
};

RTFJS.Renderer = function(doc) {
	this._doc = doc;
	this._ins = [];
	this._dom = null;
	this.initRender();
};

RTFJS.Renderer.prototype.initRender = function() {
	this._chp = null;
	this._pap = null;
	this._curpar = [];
	this._cursubparIdx = -1;
	this._curcont = [];
};

RTFJS.Renderer.prototype.addIns = function(ins) {
	this._ins.push(ins);
};

RTFJS.Renderer.prototype.pushContainer = function(container) {
	var len = this._curcont.push(container);
	if (len > 1) {
		var prevcontel = this._curcont[len - 1];
		prevcontel.appendSub(container);
	} else {
		if (this._cursubparIdx >= 0) {
			var par = this._curpar[this._cursubparIdx];
			par.appendSub(container);
		} else {
			this._curpar.push(container);
		}
	}
};

RTFJS.Renderer.prototype.currentContainer = function(type) {
	var len = this._curcont.length;
	if (len == 0)
		return null;
	if (type != null) {
		for (var i = len - 1; i >= 0; i--) {
			var cont = this._curcont[i];
			if (cont.getType() == type)
				return cont;
		}
		return null;
	}
	return this._curcont[len - 1];
};

RTFJS.Renderer.prototype.popContainer = function(type) {
	var cont;
	if (type != null) {
		var popped = false;
		while (this._curcont.length > 0) {
			cont = this._curcont.pop();
			if (cont.getType() == type) {
				popped = true;
				break;
			}
		}
		if (!popped)
			throw new RTFJS.Error("No container of type " + type + " on rendering stack");
	} else {
		cont = this._curcont.pop();
		if (cont == null)
			throw new RTFJS.Error("No container on rendering stack");
	}
	return cont;
};

RTFJS.Renderer.prototype.buildHyperlinkElement = function(url) {
	return $("<a>").attr("href", url);
};

RTFJS.Renderer.prototype._appendToPar = function(content, newsubpar) {
	if (newsubpar == true) {
		// Move everything in _curpar since the last sub-paragraph into a new one
		var par = new RTFJS.RenderParagraphContainer(this._doc);
		var len = this._curpar.length;
		for (var i = this._cursubparIdx + 1; i < len; i++)
			par.appendSub(this._curpar[i]);
		this._curpar.splice(this._cursubparIdx + 1, len - this._cursubparIdx - 1);
		par.updateProps(this._pap, this._chp);
		this._curpar.push(par);
		
		// Add a new sub-paragraph
		par = new RTFJS.RenderParagraphContainer(this._doc);
		this._cursubparIdx = this._curpar.push(par) - 1;
		par.updateProps(this._pap, this._chp);
		
		if (content != null)
			this._curpar.push(content);
	} else if (content != null) {
		var contelCnt = this._curcont.length;
		if (contelCnt > 0) {
			this._curcont[contelCnt - 1].appendSub(content);
		} else if (this._cursubparIdx >= 0) {
			this._curpar[this._cursubparIdx].appendSub(content);
		} else {
			this._curpar.push(content);
		}
	}
};

RTFJS.Renderer.prototype.finishPar = function() {
	this._appendToPar(null, true);
	//if (this._pap != null && this._pap.intable) {
	//	console.log("[rtf] finishPar: finishing table row");
	//	this.finishRow();
	//}
};

RTFJS.Renderer.prototype.lineBreak = function() {
	this._appendToPar(null, true);
};

RTFJS.Renderer.prototype.finishRow = function() {
	var table = this.currentContainer("table");
	if (table == null)
		throw new RTFJS.Error("No table on rendering stack");
	table.finishRow();
};

RTFJS.Renderer.prototype.finishCell = function() {
	var table = this.currentContainer("table");
	if (table == null)
		throw new RTFJS.Error("No table on rendering stack");
	table.finishCell();
};

RTFJS.Renderer.prototype.setChp = function(chp) {
	this._chp = chp;
};

RTFJS.Renderer.prototype.setPap = function(pap) {
	this._pap = pap;
	if (this._cursubparIdx >= 0) {
		this._curpar[this._cursubparIdx - 1].updateProps(this._pap, this._chp);
	}
};

RTFJS.Renderer.prototype.appendElement = function(element) {
	this._appendToPar(new RTFJS.RenderElement(this._doc, "element", element));
};

RTFJS.Renderer.prototype.buildRenderedPicture = function(element) {
	if (element == null)
		element = $("<span>").text("[failed to render image]")
	return new RTFJS.RenderElement(this._doc, "picture", element);
};

RTFJS.Renderer.prototype.renderedPicture = function(element) {
	this._appendToPar(this.buildRenderedPicture(element));
};

RTFJS.Renderer.prototype.buildPicture = function(mime, data) {
	var element;
	if (data != null) {
		element = $("<img>", {
			src: "data:" + mime + ";base64," + btoa(data)
		});
	} else {
		var err = "image type not supported";
		if (typeof mime === "string" && mime != "")
			err = mime;
		element = $("<span>").text("[" + mime + "]");
	}
	return new RTFJS.RenderElement(this._doc, "picture", element);
};

RTFJS.Renderer.prototype.picture = function(mime, data) {
	this._appendToPar(this.buildPicture(mime, data));
};

RTFJS.Renderer.prototype.buildDom = function() {
	if (this._dom != null)
		return this._dom;
	
	this._dom = [];
	this.initRender();
	
	var len = this._ins.length;
	for (var i = 0; i < len; i++) {
		var ins = this._ins[i];
		if (typeof ins === "string") {
			this._appendToPar(new RTFJS.RenderTextElement(this._doc, ins, this._chp));
		} else {
			ins.call(this);
		}
	}
	
	len = this._curpar.length;
	for (var i = 0; i < len; i++) {
		var element = this._curpar[i].finalize();
		if (element)
			this._dom.push(element);
	}
	
	return this._dom;
};

RTFJS.Document = function(blob, settings) {
	this._settings = settings || {};
	this._meta = {};
	this._fonts = [];
	this._colors = [];
	this._autoColor = null;
	this._stylesheets = [];
	this._renderer = new RTFJS.Renderer(this);
	this.parse(blob);
};

RTFJS.Document.prototype._lookupColor = function(idx) {
	if (idx == 0) {
		if (this._autoColor == null)
			return null;
		return this._colors[this._autoColor];
	}
	if (idx < 0 || idx >= this._colors.length)
		throw new RTFJS.Error("Invalid color index");
	return this._colors[idx];
};

RTFJS.Document.prototype.metadata = function() {
	return this._meta;
}

RTFJS.Document.prototype.render = function() {
	return this._renderer.buildDom();
};

RTFJS.Document.prototype.parse = function(blob) {
	if (!('TextDecoder' in window))
		throw new RTFJS.Error("Encoding API required");
	
	var inst = this;
	
	var parseKeyword, processKeyword, appendText, parseLoop;
	
	var Chp = function(parent) {
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
			this.underline = RTFJS.UNDERLINE.NONE;
			this.italic = false;
			this.strikethrough = false;
			this.dblstrikethrough = false;
			this.colorindex = 0;
			this.fontsize = 24;
		}
	};
	
	var Tbl = function(parent) {
		if (parent != null) {
			this.intbl = parent.intbl;
		} else {
			this.intbl = false;
		}
	};
	
	var Pap = function(parent) {
		if (parent != null) {
			this.indent = {
				left: parent.indent.left,
				right: parent.indent.right,
				firstline: parent.indent.firstline
			};
			this.justification = parent.justification;
			this.spacebefore = parent.spacebefore;
			this.spaceafter = parent.spaceafter;
			this.intable = parent.intable;
			this.isrow = parent.isrow;
		} else {
			this.indent = {
				left: 0,
				right: 0,
				firstline: 0
			};
			this.justification = RTFJS.JUSTIFICATION.LEFT;
			this.spacebefore = 0;
			this.spaceafter = 0;
			this.intable = false;
			this.isrow = false;
		}
	};
	
	var Sep = function(parent) {
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
			this.breaktype = RTFJS.BREAKTYPE.NONE;
			this.pagenumber = {
				x: 0,
				y: 0,
			};
			this.pagenumberformat = RTFJS.PAGENUMBER.DECIMAL;
		}
	};
	
	var Dop = function(parent) {
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
	};
	
	var State = function(parent) {
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
			this.table = parent.table;
		} else {
			this.chp = new Chp(null);
			this.pap = new Pap(null);
			this.sep = new Sep(null);
			this.dop = new Dop(null);
			this.destination = null;
			this.skipunknowndestination = false;
			this.skipdestination = false;
			this.ucn = 1;
			this.table = null;
		}
	};
	
	var parser = {
		data: new Uint8Array(blob),
		pos: 0,
		state: null,
		version: null,
		text: "",
		codepage: 1252,
		eof: function() {
			return this.pos >= this.data.length;
		},
		readChar: function() {
			if (this.pos < this.data.length) {
				return cptable[this.codepage].dec[this.data[this.pos++]];
			}
			
			throw new RTFJS.Error("Unexpected end of file");
		},
		unreadChar: function() {
			if (this.pos > 0)
				this.pos--;
			else
				throw new RTFJS.Error("Already at beginning of file");
		},
		readBlob: function(cnt) {
			if (this.pos + cnt > this.data.length)
				throw new RTFJS.Error("Cannot read binary data: too long");
			var buf = new ArrayBuffer(cnt);
			var view = new Uint8Array(buf);
			for (var i = 0; i < cnt; i++)
				view[i] = this.data[this.pos + i];
			return buf;
		}
	};
	
	var findParentDestination = function(dest) {
		var state = parser.state;
		while (state != null) {
			if (state.destination == null)
				break;
			if (state.destination._name == dest)
				return state.destination;
			state = state.parent;
		}
		console.log("findParentDestination() did not find destination " + dest);
	};
	
	var DestinationBase = function(name) {
		this._name = name;
	};
	
	var DestinationTextBase = function(name) {
		this._name = name;
		this.text = "";
	};
	DestinationTextBase.prototype.appendText = function(text) {
		this.text += text;
	};
	
	var DestinationFormattedTextBase = function(name) {
		this._name = name;
		this._records = [];
	};
	DestinationFormattedTextBase.prototype.appendText = function(text) {
		this._records.push(function(rtf) {
			rtf.appendText(text);
		});
	};
	DestinationFormattedTextBase.prototype.handleKeyword = function(keyword, param) {
		this._records.push(function(rtf) {
			return rtf.handleKeyword(keyword, param);
		});
	};
	DestinationFormattedTextBase.prototype.apply = function() {
		var rtf = findParentDestination("rtf");
		if (rtf == null)
			throw new RTFJS.Error("Destination " + this._name + " is not child of rtf destination");
		
		var len = this._records.length;
		var doRender = true;
		if (this.renderBegin != null)
			doRender = this.renderBegin(rtf, len);
		
		if (doRender) {
			for (var i = 0; i < len; i++) {
				this._records[i](rtf);
			};
			if (this.renderEnd != null)
				this.renderEnd(rtf, len);
		}
		delete this._records;
	};
	
	var rtfDestination = function() {
		var cls = function(name, param) {
			if (parser.version != null)
				throw new RTFJS.Error("Unexpected rtf destination");
			DestinationBase.call(this, name);
			if (param != 1)
				throw new RTFJS.Error("Unsupported rtf version");
			parser.version = param;
			
			this._metadata = {};
			this._propchanged = {
				chp: null,
				pap: null,
				sep: null
			};
		};
		cls.prototype = Object.create(DestinationBase.prototype);
		cls.prototype.addIns = function(func) {
			inst._renderer.addIns(func);
		};
		cls.prototype.appendText = function(text) {
			console.log("[rtf] appendText()");
			this.flushProps();
			if (parser.state.pap.intable) {
				if (parser.state.table == null)
					throw new RTFJS.Error("intbl flag without table definition");
			} else {
				if (parser.state.table != null) {
					console.log("[rtf] TABLE END");
					parser.state.table = null;
				}
			}
			
			console.log("[rtf] output: " + text);
			inst._renderer.addIns(text);
		}
		cls.prototype.sub = function() {
			console.log("[rtf].sub()");
		}
		
		var _addInsHandler = function(flushprops, func) {
			return function(param) {
				if (flushprops)
					this.flushProps();
				inst._renderer.addIns(func);
			};
		};
		cls.prototype._addFormatIns = function(ptype, props) {
			console.log("[rtf] update " + ptype);
			switch (ptype) {
				case "chp":
					var chp = new Chp(props);
					(function(chp) {
						inst._renderer.addIns(function() {
							this.setChp(chp);
						});
					})(chp);
					break;
				case "pap":
					var pap = new Pap(props);
					(function(pap) {
						inst._renderer.addIns(function() {
							this.setPap(pap);
						});
					})(pap);
					break;
			}
		};
		cls.prototype._updateFormatIns = function(ptype, props) {
			var changed = this._propchanged[ptype];
			if (changed == null)
				this._propchanged[ptype] = changed = props;
			if (changed != props) {
				this._propchanged[ptype] = props;
				this._addFormatIns(ptype, changed);
			}
		};
		cls.prototype.flushProps = function(ptype) {
			if (ptype != null) {
				var changed = this._propchanged[ptype];
				if (changed != null) {
					this._propchanged[ptype] = null;
					this._addFormatIns(ptype, changed);
				}
			} else {
				this.flushProps("chp");
				this.flushProps("pap");
				this.flushProps("sep");
			}
		};
		cls.prototype._finishTableRow = function() {
			console.log("[rtf] finalize table row");
			inst._renderer.addIns(function() {
				this.finishRow();
			});
		};
		cls.prototype._finishTableCell = function() {
			console.log("[rtf] finalize table cell");
			inst._renderer.addIns(function() {
				this.finishCell();
			});
		};
		var _genericFormatSetNoParam = function(ptype, prop, val) {
			return function(param) {
				var props = parser.state[ptype];
				props[prop] = val;
				console.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
				this._updateFormatIns(ptype, props);
			};
		};
		var _genericFormatOnOff = function(ptype, prop, onval, offval) {
			return function(param) {
				var props = parser.state[ptype];
				props[prop] = (param == null || param != 0) ? (onval != null ? onval : true) : (offval != null ? offval : false);
				console.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
				this._updateFormatIns(ptype, props);
			};
		};
		var _genericFormatSetVal = function(ptype, prop, defaultval) {
			return function(param) {
				var props = parser.state[ptype];
				props[prop] = (param == null) ? defaultval : param;
				console.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
				this._updateFormatIns(ptype, props);
			};
		};
		var _genericFormatSetValRequired = function(ptype, prop) {
			return function(param) {
				if (param == null)
					throw new RTFJS.Error("Keyword without required param");
				var props = parser.state[ptype];
				props[prop] = param;
				console.log("[rtf] state." + ptype + "." + prop + " = " + props[prop].toString());
				this._updateFormatIns(ptype, props);
			};
		};
		var _genericFormatSetMemberVal = function(ptype, prop, member, defaultValOrFunc) {
			return function(param) {
				var props = parser.state[ptype];
				var members = props[prop];
				var val;
				if (typeof defaultValOrFunc === "function")
					val = defaultValOrFunc.call(this, param);
				else
					val = (param == null) ? defaultValOrFunc : param;
				members[member] = val;
				console.log("[rtf] state." + ptype + "." + prop + "." + member + " = " + members[member].toString());
				this._updateFormatIns(ptype, props);
			};
		};
		var _setTableVal = function(member, defaultValOrFunc) {
			return function(param) {
				if (member != null) {
					var val;
					if (parser.state.table == null)
						throw new RTFJS.Error("Invalid table row definition");
					if (typeof defaultValOrFunc === "function")
						val = defaultValOrFunc.call(this, param);
					else
						val = (param == null) ? defaultValOrFunc : param;
					parser.state.table[member] = val;
					console.log("[rtf] state.table." + member + " = " + parser.state.table[member].toString());
				} else {
					if (parser.state.table != null)
						this._finishTableRow();
					parser.state.table = new Tbl();
					console.log("[rtf] state.pap.table initialized");
					inst._renderer.addIns(function() {
						this.pushContainer(new RTFJS.RenderTableContainer(this._doc));
					});
				}
 			};
 		};
		var _charFormatHandlers = {
			ansicpg: function(param) {
				console.log("[rtf] using charset: " + param);
				parser.codepage = param;
			},
			sectd: function(param) {
				console.log("[rtf] reset to section defaults");
				parser.state.sep = new Sep(null);
				this._updateFormatIns("sep", parser.state.sep);
			},
			plain: function(param) {
				console.log("[rtf] reset to character defaults");
				parser.state.chp = new Chp(null);
				this._updateFormatIns("chp", parser.state.chp);
			},
			pard: function(param) {
				console.log("[rtf] reset to paragraph defaults");
				parser.state.pap = new Pap(null);
				this._updateFormatIns("pap", parser.state.pap);
			},
			b: _genericFormatOnOff("chp", "bold"),
			i: _genericFormatOnOff("chp", "italic"),
			cf: _genericFormatSetValRequired("chp", "colorindex"),
			fs: _genericFormatSetValRequired("chp", "fontsize"),
			f: _genericFormatSetValRequired("chp", "fontfamily"),
			strike: _genericFormatOnOff("chp", "strikethrough"),
			striked: _genericFormatOnOff("chp", "dblstrikethrough"), // TODO: reject param == null in this particular case?
			ul: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.CONTINUOUS, RTFJS.UNDERLINE.NONE),
			uld: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.DOTTED, RTFJS.UNDERLINE.NONE),
			uldash: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.DASHED, RTFJS.UNDERLINE.NONE),
			uldashd: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.DASHDOTTED, RTFJS.UNDERLINE.NONE),
			uldashdd: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.DASHDOTDOTTED, RTFJS.UNDERLINE.NONE),
			uldb: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.DOUBLE, RTFJS.UNDERLINE.NONE),
			ulhwave: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.HEAVYWAVE, RTFJS.UNDERLINE.NONE),
			ulldash: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.LONGDASHED, RTFJS.UNDERLINE.NONE),
			ulnone: _genericFormatSetNoParam("chp", "underline", RTFJS.UNDERLINE.NONE),
			ulth: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.THICK, RTFJS.UNDERLINE.NONE),
			ulthd: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.THICKDOTTED, RTFJS.UNDERLINE.NONE),
			ulthdash: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.THICKDASHED, RTFJS.UNDERLINE.NONE),
			ulthdashd: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.THICKDASHDOTTED, RTFJS.UNDERLINE.NONE),
			ulthdashdd: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.THICKDASHDOTDOTTED, RTFJS.UNDERLINE.NONE),
			ululdbwave: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.DOUBLEWAVE, RTFJS.UNDERLINE.NONE),
			ulw: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.WORD, RTFJS.UNDERLINE.NONE),
			ulwave: _genericFormatOnOff("chp", "underline", RTFJS.UNDERLINE.WAVE, RTFJS.UNDERLINE.NONE),
			li: _genericFormatSetMemberVal("pap", "indent", "left", 0),
			ri: _genericFormatSetMemberVal("pap", "indent", "right", 0),
			fi: _genericFormatSetMemberVal("pap", "indent", "firstline", 0),
			sa: _genericFormatSetValRequired("pap", "spaceafter"),
			sb: _genericFormatSetValRequired("pap", "spacebefore"),
			cols: _genericFormatSetVal("sep", "columns", 0),
			sbknone: _genericFormatSetNoParam("sep", "breaktype", RTFJS.BREAKTYPE.NONE),
			sbkcol: _genericFormatSetNoParam("sep", "breaktype", RTFJS.BREAKTYPE.COL),
			sbkeven: _genericFormatSetNoParam("sep", "breaktype", RTFJS.BREAKTYPE.EVEN),
			sbkodd: _genericFormatSetNoParam("sep", "breaktype", RTFJS.BREAKTYPE.ODD),
			sbkpage: _genericFormatSetNoParam("sep", "breaktype", RTFJS.BREAKTYPE.PAGE),
			pgnx: _genericFormatSetMemberVal("sep", "pagenumber", "x", 0),
			pgny: _genericFormatSetMemberVal("sep", "pagenumber", "y", 0),
			pgndec: _genericFormatSetNoParam("sep", "pagenumberformat", RTFJS.PAGENUMBER.DECIMAL),
			pgnucrm: _genericFormatSetNoParam("sep", "pagenumberformat", RTFJS.PAGENUMBER.UROM),
			pgnlcrm: _genericFormatSetNoParam("sep", "pagenumberformat", RTFJS.PAGENUMBER.LROM),
			pgnucltr: _genericFormatSetNoParam("sep", "pagenumberformat", RTFJS.PAGENUMBER.ULTR),
			pgnlcltr: _genericFormatSetNoParam("sep", "pagenumberformat", RTFJS.PAGENUMBER.LLTR),
			qc: _genericFormatSetNoParam("pap", "justification", RTFJS.JUSTIFICATION.CENTER),
			ql: _genericFormatSetNoParam("pap", "justification", RTFJS.JUSTIFICATION.LEFT),
			qr: _genericFormatSetNoParam("pap", "justification", RTFJS.JUSTIFICATION.RIGHT),
			qj: _genericFormatSetNoParam("pap", "justification", RTFJS.JUSTIFICATION.JUSTIFY),
			paperw: _genericFormatSetVal("dop", "width", 12240),
			paperh: _genericFormatSetVal("dop", "height", 15480),
			margl: _genericFormatSetMemberVal("dop", "margin", "left", 1800),
			margr: _genericFormatSetMemberVal("dop", "margin", "right", 1800),
			margt: _genericFormatSetMemberVal("dop", "margin", "top", 1440),
			margb: _genericFormatSetMemberVal("dop", "margin", "bottom", 1440),
			pgnstart: _genericFormatSetVal("dop", "pagenumberstart", 1),
			facingp: _genericFormatSetNoParam("dop", "facingpages", true),
			landscape: _genericFormatSetNoParam("dop", "landscape", true),
			par: _addInsHandler(true, function() {
				this.finishPar();
			}),
			line: _addInsHandler(true, function() {
				this.lineBreak();
			}),
			trowd: _setTableVal(),
			intbl: _genericFormatSetNoParam("pap", "intable", true),
			row: _genericFormatSetNoParam("pap", "isrow", true),
			cell: function(param) {
				this._finishTableCell();
			},
		};
		cls.prototype.handleKeyword = function(keyword, param) {
			var handler = _charFormatHandlers[keyword];
			if (handler != null) {
				console.log("[rtf] handling keyword: " + keyword);
				handler.call(this, param);
				return true;
			}
			//console.log("[rtf] unhandled keyword: " + keyword + " param: " + param);
			return false;
		}
		cls.prototype.apply = function() {
			console.log("[rtf] apply()");
			this.flushProps();
			for (var prop in this._metadata)
				inst._meta[prop] = this._metadata[prop];
			delete this._metadata;
		}
		cls.prototype.setMetadata = function(prop, val) {
			this._metadata[prop] = val;
		}
		return cls;
	};
	
	var genericPropertyDestination = function(parentdest, metaprop) {
		var cls = function(name) {
			DestinationTextBase.call(this, name);
		};
		cls.prototype = Object.create(DestinationTextBase.prototype);
		cls.prototype.apply = function() {
			var dest = findParentDestination(parentdest);
			if (dest == null)
				throw new RTFJS.Error("Destination " + this._name + " must be within " + parentdest + " destination");
			if (dest.setMetadata == null)
				throw new RTFJS.Error("Destination " + parentdest + " does not accept meta data");
			dest.setMetadata(metaprop, this.text);
		};
		return cls;
	};
	
	var infoDestination = function() {
		var cls = function(name) {
			DestinationBase.call(this, name);
			this._metadata = {};
		};
		cls.prototype.apply = function() {
			for (var prop in this._metadata)
				inst._meta[prop] = this._metadata[prop];
			delete this._metadata;
		}
		cls.prototype.setMetadata = function(prop, val) {
			this._metadata[prop] = val;
		}
		return cls;
	};
	
	var metaPropertyDestination = function(metaprop) {
		var cls = function(name) {
			DestinationTextBase.call(this, name);
		};
		cls.prototype = Object.create(DestinationTextBase.prototype);
		cls.prototype.apply = function() {
			var info = findParentDestination("info");
			if (info == null)
				throw new RTFJS.Error("Destination " + this._name + " must be within info destination");
			info.setMetadata(metaprop, this.text);
		};
		return cls;
	};
	
	var metaPropertyTimeDestination = function(metaprop) {
		var cls = function(name) {
			DestinationBase.call(this, name);
			this._yr = null;
			this._mo = null;
			this._dy = null;
			this._hr = null;
			this._min = null;
			this._sec = null;
		};
		cls.prototype.handleKeyword = function(keyword, param) {
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
				throw new RTFJS.Error("No param found for keyword " + keyword);
			return true;
		};
		cls.prototype.apply = function() {
			var info = findParentDestination("info");
			if (info == null)
				throw new RTFJS.Error("Destination " + this._name + " must be within info destination");
			var date = new Date(
				this._yr != null ? this._yr : 1970,
				this._mo != null ? this._mo : 1,
				this._dy != null ? this._dy : 1,
				this._hr != null ? this._hr : 0,
				this._min != null ? this._min : 0,
				this._sec != null ? this._sec : 0,
				0);
			info.setMetadata(metaprop, date);
		};
		return cls;
	};
	
	var fonttblDestinationSub = function() {
		var cls = function(fonttbl) {
			DestinationBase.call(this, "fonttbl:sub");
			this._fonttbl = fonttbl;
			this.index = null;
			this.fontname = null;
			this.altfontname = null;
			this.family = null;
			this.pitch = RTFJS.FONTPITCH.DEFAULT;
			this.bias = 0;
			this.charset = null;
		};
		cls.prototype.handleKeyword = function(keyword, param) {
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
					this.family = keyword.slice(1);
					return true;
				case "fprq":
					switch (param) {
						case 0:
							this.pitch = RTFJS.FONTPITCH.DEFAULT;
							break;
						case 1:
							this.pitch = RTFJS.FONTPITCH.FIXED;
							break;
						case 2:
							this.pitch = RTFJS.FONTPITCH.VARIABLE;
							break;
					}
					return true;
				case "fbias":
					if (param != null)
						this.bias = param;
					return true;
				case "fcharset":
					if (param != null) {
						this.charset = RTFJS._mapCharset(param);
						if (this.charset == null)
							console.log("Unknown font charset: " + param);
					}
					return true;
			}
			return false;
		};
		cls.prototype.appendText = function(text) {
			if (this.fontname == null)
				this.fontname = text;
			else
				this.fontname += text;
		};
		cls.prototype.apply = function() {
			if (this.index == null)
				throw new RTFJS.Error("No font index provided");
			if (this.fontname == null)
				throw new RTFJS.Error("No font name provided");
			this._fonttbl.addSub(this);
			delete this._fonttbl;
		};
		cls.prototype.setAltFontName = function(name) {
			this.altfontname = name;
		};
		return cls;
	};
	
	var fonttblDestination = function() {
		var cls = function() {
			DestinationBase.call(this, "fonttbl");
			this._fonts = [];
			this._sub = null;
		};
		cls.prototype.sub = function() {
			var subCls = fonttblDestinationSub();
			return new subCls(this);
		};
		cls.prototype.apply = function() {
			console.log("[fonttbl] apply()");
			for (var idx in this._fonts) {
				console.log("[fonttbl][" + idx + "] index = " + this._fonts[idx].fontname + " alternative: " + this._fonts[idx].altfontname);
			}
			inst._fonts = this._fonts;
			delete this._fonts;
		}
		cls.prototype.appendText = function(text) {
			this._sub.appendText(text);
			this._sub.apply();
		}
		cls.prototype.handleKeyword = function(keyword, param) {
			if(keyword === "f") {
				this._sub = this.sub();
			}
			this._sub.handleKeyword(keyword, param);
		}
		cls.prototype.addSub = function(sub) {
			this._fonts[sub.index] = sub;
		};
		return cls;
	};
	
	var genericSubTextPropertyDestination = function(name, parentDest, propOrFunc) {
		var cls = function() {
			DestinationTextBase.call(this, name);
		};
		cls.prototype = Object.create(DestinationTextBase.prototype);
		cls.prototype.apply = function() {
			var dest = findParentDestination(parentDest);
			if (dest == null)
				throw new RTFJS.Error(this._name + " destination must be child of " + parentDest + " destination");
			if (dest[propOrFunc] == null)
				throw new RTFJS.Error(this._name + " destination cannot find member + " + propOrFunc + " in " + parentDest + " destination");
			if (dest[propOrFunc] instanceof Function)
				dest[propOrFunc](this.text);
			else
				dest[propOrFunc] = this.text;
		}
		return cls;
	};
	
	var colortblDestination = function() {
		var cls = function() {
			DestinationBase.call(this, "colortbl");
			this._colors = [];
			this._current = null;
			this._autoIndex = null;
		};
		cls.prototype._startNewColor = function() {
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
		cls.prototype.appendText = function(text) {
			var len = text.length;
			for (var i = 0; i < len; i++) {
				if (text[i] != ";")
					throw new RTFJS.Error("Error parsing colortbl destination");
				if (this._current == null) {
					if (this._autoIndex != null)
						throw new RTFJS.Error("colortbl cannot define more than one auto color");
					this._autoIndex = this._colors.length;
					this._startNewColor();
				} else {
					if (this._current.tint < 255 && this._current.shade < 255)
						throw new RTFJS.Error("colortbl cannot define shade and tint at the same time");
				}
				this._colors.push(this._current);
				this._current = null;
			}
		};
		var _validateColorValueRange = function(keyword, param) {
			if (param == null)
				throw new RTFJS.Error(keyword + " has no param");
			if (param < 0 || param > 255)
				throw new RTFJS.Error(keyword + " has invalid param value");
			return param;
		};
		cls.prototype.handleKeyword = function(keyword, param) {
			if (this._current == null)
				this._startNewColor();
			
			switch (keyword) {
				case "red":
					this._current.r = _validateColorValueRange(keyword, param);
					return true;
				case "green":
					this._current.g = _validateColorValueRange(keyword, param);
					return true;
				case "blue":
					this._current.b = _validateColorValueRange(keyword, param);
					return true;
				case "ctint":
					this._current.tint = _validateColorValueRange(keyword, param);
					return true;
				case "cshade":
					this._current.shade = _validateColorValueRange(keyword, param);
					return true;
				default:
					if (keyword[0] == "c") {
						this._current.theme = RTFJS._mapColorTheme(keyword.slice(1));
						return true;
					}
					break;
			}
			
			console.log("[colortbl] handleKeyword(): unhandled keyword: " + keyword);
			return false;
		}
		cls.prototype.apply = function() {
			console.log("[colortbl] apply()");
			if (this._autoIndex == null)
				this._autoIndex = 0;
			if (this._autoIndex >= this._colors.length)
				throw new RTFJS.Error("colortbl doesn't define auto color")
			for (var idx in this._colors)
				console.log("[colortbl] [" + idx + "] = " + this._colors[idx].r + "," + this._colors[idx].g + "," + this._colors[idx].b + " theme: " + this._colors[idx].theme);
			inst._colors = this._colors;
			inst._autoColor = this._autoIndex;
			delete this._colors;
		}
		return cls;
	};
	
	var stylesheetDestinationSub = function() {
		var _handleKeywordCommon = function(member) {
			var data = this[member];
			if (data == null)
				this[member] = data = {};
			return function(keyword, param) {
				console.log("[stylesheet:sub]." + member + ": unhandled keyword: " + keyword + " param: " + param);
				return false;
			};
		};
		
		var cls = function(stylesheet) {
			DestinationBase.call(this, "stylesheet:sub");
			this._stylesheet = stylesheet;
			this.index = 0;
			this.name = null;
			this.handler = _handleKeywordCommon("paragraph");
		};
		cls.prototype.handleKeyword = function(keyword, param) {
			switch (keyword) {
				case "s":
					this.index = param;
					return true;
				case "cs":
					delete this.paragraph;
					this.handler = _handleKeywordCommon("character");
					this.index = param;
					return true;
				case "ds":
					delete this.paragraph;
					this.handler = _handleKeywordCommon("section");
					this.index = param;
					return true;
				case "ts":
					delete this.paragraph;
					this.handler = _handleKeywordCommon("table");
					this.index = param;
					return true;
			}
			
			return this.handler(keyword, param);
		};
		cls.prototype.appendText = function(text) {
			if (this.name == null)
				this.name = text;
			else
				this.name += text;
		};
		cls.prototype.apply = function() {
			this._stylesheet.addSub({
				index: this.index,
				name: this.name
			});
			delete this._stylesheet;
		};
		return cls;
	};
	
	var stylesheetDestination = function() {
		var cls = function() {
			DestinationBase.call(this, "stylesheet");
			this._stylesheets = [];
		};
		cls.prototype.sub = function() {
			var subCls = stylesheetDestinationSub();
			return new subCls(this);
		};
		cls.prototype.apply = function() {
			console.log("[stylesheet] apply()");
			for (var idx in this._stylesheets)
				console.log("[stylesheet] [" + idx + "] name: " + this._stylesheets[idx].name);
			inst._stylesheets = this._stylesheets;
			delete this._stylesheets;
		};
		cls.prototype.addSub = function(sub) {
			if (this._stylesheets[sub.index] != null)
				throw new RTFJS.Error("Cannot redefine stylesheet with index " + sub.index);
			this._stylesheets[sub.index] = sub;
		};
		return cls;
	};
	
	var fieldDestination = function() {
		var cls = function() {
			DestinationBase.call(this, "field");
			this._haveInst = false;
			this._parsedInst = null; // FieldBase
			this._result = null;
		};
		cls.prototype.apply = function() {
			if (!this._haveInst)
				throw new RTFJS.Error("Field has no fldinst destination");
			if (this._result == null)
				throw new RTFJS.Error("Field has no fldrslt destination");
		};
		cls.prototype.setInst = function(inst) {
			this._haveInst = true;
			if (this._parsedInst != null)
				throw new RTFJS.Error("Field cannot have multiple fldinst destinations");
			this._parsedInst = inst;
		};
		cls.prototype.getInst = function() {
			return this._parsedInst;
		};
		cls.prototype.setResult = function(inst) {
			if (this._result != null)
				throw new RTFJS.Error("Field cannot have multiple fldrslt destinations");
			this._result = inst;
		};
		return cls;
	};
	
	var FieldBase = function(fldinst) {
		this._fldinst = fldinst;
	};
	FieldBase.prototype.renderFieldEnd = function(field, rtf, records) {
		if (records > 0) {
			rtf.addIns(function() {
				console.log("[rtf] Popping container");
				this.popContainer();
			});
		}
	};
	
	var FieldHyperlink = function(fldinst, data) {
		FieldBase.call(this, fldinst);
		this._url = data;
	};
	FieldHyperlink.prototype = Object.create(FieldBase.prototype);
	FieldHyperlink.prototype.renderFieldBegin = function(field, rtf, records) {
		var self = this;
		if (records > 0) {
			rtf.addIns(function() {
				var renderer = this;
				var create = function() {
					return renderer.buildHyperlinkElement(self._url);
				};
				var container;
				if (inst._settings.onHyperlink != null) {
					container = inst._settings.onHyperlink.call(inst, create, {
						url: self._url
					});
				} else {
					var elem = create();
					container = {
						element: elem,
						content: elem
					};
				}
				console.log("[rtf] Pushing hyperlink container for url " + self._url);
				this.pushContainer(new RTFJS.RenderContainer(this._doc, "hyperlink", container.element, container.content));
			});
			return true;
		}
		return false;
	};
	
	var fldinstDestination = function() {
		var cls = function() {
			DestinationTextBase.call(this, "fldinst");
		};
		cls.prototype = Object.create(DestinationTextBase.prototype);
		cls.prototype.apply = function() {
			var field = findParentDestination("field");
			if (field == null)
				throw new RTFJS.Error("fldinst destination must be child of field destination");
			field.setInst(this.parseType());
		};
		cls.prototype.parseType = function() {
			var sep = this.text.indexOf(" ");
			if (sep > 0) {
				var data = this.text.substr(sep + 1);
				if (data.length >= 2 && data[0] == "\"") {
					var end = data.indexOf("\"", 1);
					if (end >= 1)
						data = data.substring(1, end);
				}
				var fieldType = this.text.substr(0, sep);
				switch (fieldType) {
					case "HYPERLINK":
						return new FieldHyperlink(this, data);
					default:
						console.log("[fldinst]: unknown field type: " + fieldType);
						break;
				}
			}
		};
		return cls;
	};
	
	var fldrsltDestination = function() {
		var cls = function() {
			DestinationFormattedTextBase.call(this, "fldrslt");
		};
		cls.prototype = Object.create(DestinationFormattedTextBase.prototype);
		var baseApply = cls.prototype.apply;
		cls.prototype.apply = function() {
			var field = findParentDestination("field");
			if (field == null)
				throw new RTFJS.Error("fldrslt destination must be child of field destination");
			field.setResult(this);
			
			baseApply.call(this);
		};
		cls.prototype.renderBegin = function(rtf, records) {
			var field = findParentDestination("field");
			if (field == null)
				throw new RTFJS.Error("fldrslt destination must be child of field destination");
			
			var inst = field.getInst();
			if (inst != null)
				return inst.renderFieldBegin(field, rtf, records);
			return false;
		};
		cls.prototype.renderEnd = function(rtf, records) {
			var field = findParentDestination("field");
			if (field == null)
				throw new RTFJS.Error("fldrslt destination must be child of field destination");
			
			var inst = field.getInst();
			if (inst != null)
				inst.renderFieldEnd(field, rtf, records);
		};
		return cls;
	};
	
	var pictDestination = function() {
		var cls = function() {
			DestinationTextBase.call(this, "pict");
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
		};
		cls.prototype = Object.create(DestinationTextBase.prototype);
		_setPropValueRequired = function(member, prop) {
			return function(param) {
				if (param == null)
					throw new RTFJS.Error("Picture property has no value");
				console.log("[pict] set " + member + "." + prop + " = " + param);
				var obj = (member != null ? this[member] : this);
				obj[prop] = param;
			};
		};				
		var _pictHandlers = {
			picw: _setPropValueRequired("_size", "width"),
			pich: _setPropValueRequired("_size", "height"),
			picwgoal: _setPropValueRequired("_displaysize", "width"),
			pichgoal: _setPropValueRequired("_displaysize", "height")
		};
		var _pictTypeHandler = {
			emfblip: "", // TODO
			pngblip: "image/png",
			jpegblip: "image/jpeg",
			macpict: "", // TODO
			pmmetafile: "", // TODO
			wmetafile: (function() {
				if (typeof WMFJS !== "undefined") {
					return function(param) {
						if (param == null || param < 0 || param > 8)
							throw new RTFJS.Error("Insufficient metafile information");
						return {
							load: function() {
								try {
									return new WMFJS.Renderer(this._blob);
								} catch(e) {
									if (e instanceof WMFJS.Error)
										return e.message;
									else
										throw e;
								}
							},
							render: function(img) {
								return img.render({
									width: RTFJS._twipsToPt(this._displaysize.width) + "pt",
									height: RTFJS._twipsToPt(this._displaysize.height) + "pt",
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
			dibitmap: "" // TODO
		};
		cls.prototype.handleKeyword = function(keyword, param) {
			var handler = _pictHandlers[keyword];
			if (handler != null) {
				handler.call(this, param);
				return true;
			}
			var inst = this;
			var type = _pictTypeHandler[keyword];
			if (type != null) {
				if (this._type == null) {
					if (typeof type === "function") {
						var info = type.call(this, param);
						if (info != null) {
							if (typeof info === "string") {
								this._type = info;
							} else {
								this._type = function() {
									var renderer = info.load.call(inst);
									if (renderer != null) {
										if (typeof renderer === "string")
											return renderer;
										return function() {
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
		cls.prototype.handleBlob = function(blob) {
			this._blob = blob;
		};
		cls.prototype.apply = function() {
			if (this._type == null)
				throw new RTFJS.Error("Picture type unknown or not specified");
			//if (this._size.width == null || this._size.height == null)
			//	throw new RTFJS.Error("Picture dimensions not specified");
			//if (this._displaysize.width == null || this._displaysize.height == null)
			//	throw new RTFJS.Error("Picture display dimensions not specified");
			
			var type = this._type;
			if (typeof type === "function") {
				// type is the trampoline function that executes the .load function
				// and returns a renderer trampoline that ends up calling the .render function
				if (this._blob == null) {
					this._blob = RTFJS._hexToBlob(this.text);
					if (this._blob == null)
						throw new RTFJS.Error("Could not parse picture data");
					delete this.text;
				}
				
				var info = this;
				var doRender = function(rendering) {
					var pictrender = type.call(info);
					if (pictrender != null) {
						if (typeof pictrender === "string") {
							console.log("[pict] Could not load image: " + pictrender);
							if (rendering) {
								return this.buildPicture(pictrender, null);
							} else {
								(function(pictrender) {
									inst._renderer.addIns(function() {
										this.picture(pictrender, null);
									});
								})(pictrender);
							}
						} else {
							if (typeof pictrender !== "function")
								throw new RTFJS.Error("Expected a picture render function");
							if (rendering) {
								return this.buildRenderedPicture(pictrender());
							} else {
								(function(pictrender) {
									inst._renderer.addIns(function() {
										this.renderedPicture(pictrender());
									});
								})(pictrender);
							}
						}
					}
				};
				
				(function(doRender) {
					if (inst._settings.onPicture != null) {
						inst._renderer.addIns(function() {
							var renderer = this;
							var elem = inst._settings.onPicture.call(inst, function() {
								return doRender.call(renderer, true).getElement();
							});
							if (elem != null)
								this.appendElement(elem);
						});
					} else {
						doRender(false);
					}
				})(doRender);
			} else if (typeof type === "string") {
				var text = this.text;
				var blob = this._blob;
				
				var doRender = function(rendering) {
					var bin = blob != null ? RTFJS._blobToBinary(blob) : RTFJS._hexToBinary(text);
					if (type !== "") {
						if (rendering) {
							return this.buildPicture(type, bin);
						} else {
							inst._renderer.addIns(function() {
								this.picture(type, bin);
							});
						}
					} else {
						if (rendering) {
							return this.buildPicture("Unsupported image format", null);
						} else {
							inst._renderer.addIns(function() {
								this.picture("Unsupported image format", null);
							});
						}
					}
				};
				
				(function(doRender) {
					if (inst._settings.onPicture != null) {
						inst._renderer.addIns(function() {
							var renderer = this;
							var elem = inst._settings.onPicture.call(inst, function() {
								return doRender.call(renderer, true).getElement();
							});
							if (elem != null)
								this.appendElement(elem);
						});
					} else {
						doRender(false);
					}
				})(doRender);
			}
			
			delete this.text;
		}
		return cls;
	};
	
	var requiredDestination = function(name) {
		return function() {
			DestinationBase.call(this, name);
		};
	};
	
	var destinations = {
		rtf: rtfDestination(),
		info: infoDestination(),
		title: metaPropertyDestination("title"),
		subject: metaPropertyDestination("subject"),
		author: metaPropertyDestination("author"),
		manager: metaPropertyDestination("manager"),
		company: metaPropertyDestination("company"),
		operator: metaPropertyDestination("operator"),
		category: metaPropertyDestination("category"),
		keywords: metaPropertyDestination("keywords"),
		doccomm: metaPropertyDestination("doccomm"),
		hlinkbase: metaPropertyDestination("hlinkbase"),
		generator: genericPropertyDestination("rtf", "generator"),
		creatim: metaPropertyTimeDestination("creatim"),
		revtim: metaPropertyTimeDestination("revtim"),
		printim: metaPropertyTimeDestination("printim"),
		buptim: metaPropertyTimeDestination("buptim"),
		fonttbl: fonttblDestination(),
		falt: genericSubTextPropertyDestination("falt", "fonttbl:sub", "setAltFontName"),
		colortbl: colortblDestination(),
		stylesheet: stylesheetDestination(),
		footer: requiredDestination("footer"),
		footerf: requiredDestination("footerf"),
		footerl: requiredDestination("footerl"),
		footerr: requiredDestination("footerr"),
		footnote: requiredDestination("footnote"),
		ftncn: requiredDestination("ftncn"),
		ftnsep: requiredDestination("ftnsep"),
		ftnsepc: requiredDestination("ftnsepc"),
		header: requiredDestination("header"),
		headerf: requiredDestination("headerf"),
		headerl: requiredDestination("headerl"),
		headerr: requiredDestination("headerr"),
		pict: pictDestination(),
		private1: requiredDestination("private1"),
		rxe: requiredDestination("rxe"),
		tc: requiredDestination("tc"),
		txe: requiredDestination("txe"),
		xe: requiredDestination("xe"),
		field: fieldDestination(),
		fldinst: fldinstDestination(),
		fldrslt: fldrsltDestination(),
	};
	
	var applyDestination = function(always) {
		var dest = parser.state.destination;
		if (dest != null) {
			if (always || parser.state.parent == null || parser.state.parent.destination != parser.state.destination) {
				if (dest.apply != null)
					dest.apply();
				parser.state.destination = null;
			}
		}
	};
	
	var applyText = function() {
		if (parser.text.length > 0) {
			var dest = parser.state.destination;
			if (dest == null)
				throw new RTFJS.Error("Cannot route text to destination");
			if (dest != null && dest.appendText != null && !parser.state.skipdestination)
				dest.appendText(parser.text);
			parser.text = "";
		}
	}
	
	var pushState = function(forceSkip) {
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
	
	var popState = function() {
		var state = parser.state;
		if (state == null)
			throw new RTFJS.Error("Unexpected end of state");
		
		applyText();
		if (state.parent == null || state.destination != state.parent.destination)
			applyDestination(true);
		parser.state = state.parent;
		return parser.state;
	};
	
	var changeDestination = function(name, param) {
		applyText();
		var handler = destinations[name];
		if (handler != null) {
			applyDestination(false);
			parser.state.destination = new handler(name, param);
			return true;
		}
		return false;
	};
	
	processKeyword = function(keyword, param) {
		var first = parser.state.first;
		if (first) {
			if (keyword == "*") {
				parser.state.skipunknowndestination = true;
				return;
			}
			
			parser.state.first = false;
		}
		
		//if (param != null)
		//	console.log("keyword " + keyword + " with param " + param);
		//else
		//	console.log("keyword " + keyword);
		
		if (parser.state.bindata > 0)
			throw new RTFJS.Error("Keyword encountered within binary data");
		
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
						throw new RTFJS.Error("Invalid unicode character encountered");

					appendText(cptable[parser.codepage].dec[param]);
					parser.state.skipchars = parser.state.ucn;
				}
				return;
			
			case "bin":
				if (param == null)
					throw new RTFJS.Error("Binary data is missing length");
				if (param < 0)
					throw new RTFJS.Error("Binary data with invalid length");
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
							console.log("Unhandled keyword: " + keyword + " param: " + param);
						}
					}
				}
				return;
		}
		
		parser.state.skipdestination = false;
	};
	
	appendText = function(text) {
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
	
	var applyBlob = function(blob) {
		parser.state.first = false;
		applyText();
		if (parser.state.skipchars > 0) {
			// \bin and all its data is considered one character for skipping purposes
			parser.state.skipchars--;
		} else {
			var dest = parser.state.destination;
			if (dest == null)
				throw new RTFJS.Error("Cannot route binary to destination");
			if (dest != null && dest.handleBlob != null && !parser.state.skipdestination)
				dest.handleBlob(blob);
		}
	};
	
	parseKeyword = function(process) {
		if (parser.state == null)
			throw new RTFJS.Error("No state");
		
		var param;
		var ch = parser.readChar();
		if (!RTFJS._isalpha(ch)) {
			if (ch == "\'") {
				param = RTFJS._parseHex(parser.readChar() + parser.readChar())
				if (isNaN(param))
					throw new RTFJS.Error("Could not parse hexadecimal number");
				
				if (process != null)
					appendText(cptable[parser.codepage].dec[param]);
			} else if (process != null) {
				var text = process(ch, param);
				if (text != null)
					appendText(text);
			}
		} else {
			var keyword = ch;
			ch = parser.readChar();
			while (keyword.length < 30 && RTFJS._isalpha(ch)) {
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
		
			if (RTFJS._isdigit(ch)) {
				do {
					num += ch;
					ch = parser.readChar();
				} while (num.length < 20 && RTFJS._isdigit(ch));
			
				if (num.length >= 20)
					throw new RTFJS.Error("Param for keyword " + keyword + " too long");
			
				param = parseInt(num, 10);
				if (isNaN(param))
					throw new RTFJS.Error("Invalid keyword " + keyword + " param");
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
	
	parseLoop = function(skip, process) {
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
					case "\n":
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
	};
	
	if (parser.data.length > 1 && String.fromCharCode(parser.data[0]) == "{") {
		parseLoop(false, processKeyword);
	}
	if (parser.version == null)
		throw new RTFJS.Error("Not a valid rtf document");
	if (parser.state != null)
		throw new RTFJS.Error("File truncated");
}
