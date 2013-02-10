var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = true;
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,__class__: IntIter
}
var Std = function() { }
Std.__name__ = true;
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var js = js || {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
js.Lib.__name__ = true;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var org = org || {}
if(!org.jinjor) org.jinjor = {}
if(!org.jinjor.smf) org.jinjor.smf = {}
org.jinjor.smf.Smf = function() { }
org.jinjor.smf.Smf.__name__ = true;
org.jinjor.smf.Smf.main = function() {
}
org.jinjor.smf.SmfData = function(data) {
	var buf = eval("new Uint8Array(data)");
	var p = 0;
	if(!(buf[p++] == 77 && buf[p++] == 84 && buf[p++] == 104 && buf[p++] == 100)) throw "MIDIファイルではありません";
	p += 4;
	this.format = buf[p++] * 256 + buf[p++];
	var trackCount = buf[p++] * 256 + buf[p++];
	this.timeMode = buf[p++] * 256 + buf[p++];
	var tracks = [];
	var _g = 0;
	while(_g < trackCount) {
		var i = _g++;
		var chunkType = [buf[p++],buf[p++],buf[p++],buf[p++]];
		if(!(chunkType[0] == 77 && chunkType[1] == 84 && chunkType[2] == 114 && chunkType[3] == 107)) throw "チャンク名が不正です";
		console.log("Track start!");
		var dataLength = buf[p++] * 256 * 256 * 256 + buf[p++] * 256 * 256 + buf[p++] * 256 + buf[p++];
		var end = p + dataLength;
		var events = [];
		var event = [];
		var prevEventFirst = null;
		while(p < end) {
			var delta_incr = org.jinjor.smf.SmfData.getVariableLength(buf,p);
			var delta = delta_incr[0];
			p += delta_incr[1];
			var eventFirst = buf[p++];
			var event1 = [delta,eventFirst];
			if(eventFirst == 255) {
				event1.push(buf[p++]);
				var metaLength_incr = org.jinjor.smf.SmfData.getVariableLength(buf,p);
				var metaLength = metaLength_incr[0];
				p += metaLength_incr[1];
				var _g1 = 0;
				while(_g1 < metaLength) {
					var k = _g1++;
					event1.push(buf[p++]);
				}
			} else if(eventFirst == 247) {
				var sysxLength_incr = org.jinjor.smf.SmfData.getVariableLength(buf,p);
				var sysxLength = sysxLength_incr[0];
				p += sysxLength_incr[1];
				var _g1 = 0;
				while(_g1 < sysxLength) {
					var k = _g1++;
					event1.push(buf[p++]);
				}
			} else if(eventFirst == 240) while(true) {
				var e = buf[p++];
				if(e == 247) break; else event1.push(e);
			} else if(eventFirst < 240) {
				var firstData = null;
				if(eventFirst < 128) {
					firstData = event1.pop();
					if(prevEventFirst != null && (prevEventFirst < 128 || 240 <= prevEventFirst)) throw "予期しないランニングステータス: " + prevEventFirst;
					eventFirst = prevEventFirst;
					event1.push(eventFirst);
				} else firstData = buf[p++];
				if(eventFirst >= 192) event1.push(firstData); else {
					event1.push(firstData);
					event1.push(buf[p++]);
				}
			}
			events.push(event1);
			prevEventFirst = eventFirst;
		}
		tracks.push(events);
	}
	this.tracks = tracks;
	console.log(tracks);
};
org.jinjor.smf.SmfData.__name__ = true;
org.jinjor.smf.SmfData.getVariableLength = function(buf,p) {
	var length = 0;
	var k = 1;
	while(k <= 4) {
		var d = buf[p++];
		length = length * 128 + d % 128;
		if(d <= 127) break; else if(k == 4) throw "4バイトを超えました";
		k++;
	}
	return [length,k];
}
org.jinjor.smf.SmfData.prototype = {
	__class__: org.jinjor.smf.SmfData
}
org.jinjor.smf.SmfFile = function(file,reader,onReady) {
	this.name = file.name;
	this.type = file.type;
	this.size = file.size;
	var that = this;
	reader.onload = function(event) {
		var data = event.target.result;
		that.smfData = new org.jinjor.smf.SmfData(data);
		onReady();
	};
	reader.readAsArrayBuffer(file);
};
org.jinjor.smf.SmfFile.__name__ = true;
org.jinjor.smf.SmfFile.prototype = {
	__class__: org.jinjor.smf.SmfFile
}
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
org.jinjor.smf.Smf.main();
