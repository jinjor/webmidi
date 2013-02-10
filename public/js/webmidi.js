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
var Lambda = function() { }
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
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
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
}
var haxe = haxe || {}
haxe.Log = function() { }
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
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
		haxe.Log.trace("Track start!",{ fileName : "Smf.hx", lineNumber : 49, className : "org.jinjor.smf.SmfData", methodName : "new"});
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
	haxe.Log.trace(tracks,{ fileName : "Smf.hx", lineNumber : 113, className : "org.jinjor.smf.SmfData", methodName : "new"});
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
if(!org.jinjor.synth) org.jinjor.synth = {}
org.jinjor.synth.SynthDef = function(name,url,author,programs) {
	this.name = name;
	this.url = url;
	this.author = author;
	this.programs = programs;
};
org.jinjor.synth.SynthDef.__name__ = true;
org.jinjor.synth.SynthDef.prototype = {
	__class__: org.jinjor.synth.SynthDef
}
if(!org.jinjor.util) org.jinjor.util = {}
org.jinjor.util.Util = function() { }
org.jinjor.util.Util.__name__ = true;
org.jinjor.util.Util.or = function(a,b) {
	return a != null?a:b;
}
if(!org.jinjor.webmidi) org.jinjor.webmidi = {}
org.jinjor.webmidi.All = function() { }
org.jinjor.webmidi.All.__name__ = true;
org.jinjor.webmidi.All.main = function() {
	haxe.Log.trace("hello.",{ fileName : "All.hx", lineNumber : 11, className : "org.jinjor.webmidi.All", methodName : "main"});
}
org.jinjor.webmidi.Sequencer = function(tune) {
	this.location = 0;
	this.tune = tune;
	this.playing = null;
	this.recState = null;
};
org.jinjor.webmidi.Sequencer.__name__ = true;
org.jinjor.webmidi.Sequencer.prototype = {
	stop: function() {
		haxe.Log.trace("stop",{ fileName : "Sequencer.hx", lineNumber : 106, className : "org.jinjor.webmidi.Sequencer", methodName : "stop"});
		this.location = 0;
		this.playing = null;
		this.stopPlaying();
	}
	,play: function(rerender,optMode) {
		if(this.tune.tracks.length <= 0) return;
		var that = this;
		this.recState = new org.jinjor.webmidi.RecState();
		if(optMode == "recoding") {
			this.recState.onNoteFinished = function(note,velocity,startTime,endTime) {
				Lambda.foreach(that.tune.getSelectedTracks(),function(track) {
					track.recNote(note,velocity,that.tune.msToTick(startTime),that.tune.msToTick(endTime));
					return true;
				});
			};
			this.recState.onElse = function(time,m0,m1,m2) {
				Lambda.foreach(that.tune.getSelectedTracks(),function(track) {
					track.recElse(that.tune.msToTick(time),m0,m1,m2);
					return true;
				});
			};
		}
		var messageTrackPairs = Lambda.fold(this.tune.tracks,function(track,memo) {
			var pairs = Lambda.array(Lambda.map(track.messages,function(mes) {
				return [mes,track];
			}));
			return memo.concat(pairs);
		},[]);
		this.playing = optMode != null?optMode:"playing";
		messageTrackPairs.sort(function(a,b) {
			return a[0][0] - b[0][0];
		});
		Lambda.foreach(that.tune.tracks,function(track) {
			track.programChange(null);
			return true;
		});
		var index = 0;
		var current = null;
		var currentTrack = null;
		var currentMessage = null;
		var that1 = this;
		var r = { };
		r.tick = function() {
			var location = that1.recState.getLocation();
			current = index < messageTrackPairs.length?messageTrackPairs[index]:null;
			currentTrack = current[1];
			currentMessage = current[0];
			if(that1.playing == null) that1.stopPlaying(); else if(current == null) that1.stop(); else if(that1.tune.tickToMs(currentMessage[0]) < location) {
				currentTrack.putMidi(currentMessage[1],currentMessage[2],currentMessage[3]);
				index++;
				r.tick();
			} else haxe.Timer.delay(r.tick,1);
		};
		r.render = function() {
			if(that1.playing != null) {
				var s = new Date().getTime();
				rerender();
				haxe.Timer.delay(r.render,30);
			}
		};
		r.tick();
		r.render();
	}
	,stopPlaying: function() {
		Lambda.foreach(this.tune.tracks,function(track) {
			track.allSoundOff();
			return true;
		});
	}
	,rec: function(rerender) {
		this.play(rerender,"recoding");
	}
	,send: function(t,m0,m1,m2) {
		this.recState.send(m0,m1,m2);
		Lambda.foreach(this.tune.getSelectedTracks(),function(track) {
			track.putMidi(m0,m1,m2);
			return true;
		});
	}
	,__class__: org.jinjor.webmidi.Sequencer
}
org.jinjor.webmidi.RecState = function() {
	this.keyCount = 0;
	this.noteOns = [];
	this.running = false;
	this.startTime = Math.floor(new Date().getTime());
};
org.jinjor.webmidi.RecState.__name__ = true;
org.jinjor.webmidi.RecState.prototype = {
	getLocation: function() {
		return Math.floor(new Date().getTime()) - this.startTime;
	}
	,keyIsPressed: function() {
		return this.keyCount > 0;
	}
	,reset: function() {
		this.keyCount = 0;
		this.noteOns = [];
	}
	,send: function(m0,m1,m2) {
		var time = this.getLocation();
		if(m0 >> 4 == 9) {
			this.noteOns[m1] = [time,m2];
			this.keyCount++;
		} else if(m0 >> 4 == 8) {
			var startTime_velocity = this.noteOns[m1];
			if(startTime_velocity != null) this.onNoteFinished(m1,startTime_velocity[1],startTime_velocity[0],time);
			this.noteOns[m1] = false;
			this.keyCount--;
		} else this.onElse(time,m0,m1,m2);
	}
	,onElse: function(time,m0,m1,m2) {
	}
	,onNoteFinished: function(startTime,endTime,velocity,time) {
	}
	,__class__: org.jinjor.webmidi.RecState
}
org.jinjor.webmidi.Track = function(name,synth,channel,program,messages) {
	this.id = org.jinjor.webmidi.Track.createTrackId();
	this.name = name;
	this.synth = synth;
	this.channel = channel != null?channel:1;
	this.program = program != null?this.synth.programs[program.number]:this.synth.programs[1];
	if(this.program == null) this.program = this.synth.programs[1];
	this.selected = true;
	this.messages = messages != null?messages:[[Math.floor(40.),128,62,0]];
	this.programChange(this.program.number);
};
org.jinjor.webmidi.Track.__name__ = true;
org.jinjor.webmidi.Track.createTrackId = function() {
	return ++org.jinjor.webmidi.Track.trackId;
}
org.jinjor.webmidi.Track.prototype = {
	onChangeSynth: function() {
		this.program = this.synth.programs[1];
	}
	,deleteAll: function() {
		this.messages = [[Math.floor(40.),128,62,0]];
	}
	,putMidi: function(m0,m1,m2) {
		this.synth.sendMidiMessage(m0 + this.channel - 1,m1,m2);
	}
	,allSoundOff: function() {
		this.synth.allSoundOff();
	}
	,programChange: function(number) {
		this.putMidi(192,number != null?number:this.program.number,0);
	}
	,noteOff: function(note) {
		this.putMidi(128,note,0);
	}
	,noteOn: function(note,velo) {
		this.putMidi(144,note,velo);
	}
	,recElse: function(time,m0,m1,m2) {
		this.messages.push([time,m0,m1,m2]);
	}
	,recNote: function(note,velocity,startTime,endTime) {
		this.messages.push([startTime,144,note,velocity]);
		this.messages.push([endTime,128,note,0]);
	}
	,__class__: org.jinjor.webmidi.Track
}
org.jinjor.webmidi.Tune = function() {
	this.format = 1;
	this.timeMode = 480;
	this.tracks = [];
	this.selectedTrackId = -1;
	this.pxPerMsMode = 0;
};
org.jinjor.webmidi.Tune.__name__ = true;
org.jinjor.webmidi.Tune.prototype = {
	getTimePerTick: function() {
		var tempo = 120;
		return 60000 / (this.timeMode * tempo);
	}
	,msToTick: function(ms) {
		return Math.floor(ms / this.getTimePerTick());
	}
	,tickToMs: function(tick) {
		return Math.floor(this.getTimePerTick() * tick);
	}
	,trackIsSelected: function(track) {
		return track.id == this.selectedTrackId;
	}
	,getSelectedTracks: function() {
		var that = this;
		return Lambda.array(Lambda.filter(this.tracks,function(track) {
			return that.trackIsSelected(track);
		}));
	}
	,replaceTracksByLoadedTracks: function(tracks,synths) {
		var that = this;
		this.tracks = tracks != null?Lambda.array(Lambda.map(tracks,function(_track) {
			return new org.jinjor.webmidi.Track(_track.name,synths[_track.synth.name],_track.channel,_track.program,_track.messages.filter(function(e) {
				return e.message == null && e.time == null;
			}));
		})):[];
	}
	,addTrack: function(synth,channel) {
		var track = new org.jinjor.webmidi.Track("_",synth,channel,null,null);
		this.tracks.push(track);
	}
	,gainPxPerMs: function(amount) {
		var pxPerMsMode = this.pxPerMsMode + amount;
		this.pxPerMsMode = pxPerMsMode < 0?0:pxPerMsMode >= org.jinjor.webmidi.Tune.pxPerMsModes.length?org.jinjor.webmidi.Tune.pxPerMsModes.length - 1:pxPerMsMode;
	}
	,hasMinPxPerMs: function() {
		return this.pxPerMsMode <= 0;
	}
	,hasMaxPxPerMs: function() {
		return this.pxPerMsMode >= org.jinjor.webmidi.Tune.pxPerMsModes.length - 1;
	}
	,getPxPerMs: function() {
		return org.jinjor.webmidi.Tune.pxPerMsModes[this.pxPerMsMode];
	}
	,refresh: function(smfData,synth) {
		if(smfData.format != 1) throw "まだ1しか受け付けません";
		if(smfData.timeMode > 32768) throw "まだMSB=0しか受け付けません";
		this.format = smfData.format;
		this.timeMode = smfData.timeMode;
		haxe.Log.trace("timeMode=" + this.timeMode,{ fileName : "Tune.hx", lineNumber : 135, className : "org.jinjor.webmidi.Tune", methodName : "refresh"});
		var that = this;
		this.tracks = smfData.tracks.map(function(events) {
			var deltaSum = 0;
			var messages = events.map(function(e) {
				deltaSum += e[0];
				return [deltaSum,e[1],e[2],e[3]];
			});
			return new org.jinjor.webmidi.Track("_",synth,1,null,messages);
		});
	}
	,__class__: org.jinjor.webmidi.Tune
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
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
org.jinjor.synth.SynthDef.GMPlayer = new org.jinjor.synth.SynthDef("GMPlayer","http://www.g200kg.com/en/docs/gmplayer/","g200kg",{ '1' : { number : 1, description : ""}, '2' : { number : 2, description : ""}, '3' : { number : 3, description : ""}, '4' : { number : 4, description : ""}, '5' : { number : 5, description : ""}, '6' : { number : 6, description : ""}, '7' : { number : 7, description : ""}, '8' : { number : 8, description : ""}, '9' : { number : 9, description : ""}, '10' : { number : 10, description : ""}});
org.jinjor.synth.SynthDef.WebBeeper = new org.jinjor.synth.SynthDef("WebBeeper","http://www.g200kg.com/en/docs/webbeeper/","g200kg",{ '1' : { number : 1, description : ""}, '2' : { number : 2, description : ""}, '3' : { number : 3, description : ""}, '4' : { number : 4, description : ""}, '5' : { number : 5, description : ""}, '6' : { number : 6, description : ""}, '7' : { number : 7, description : ""}, '8' : { number : 8, description : ""}, '9' : { number : 9, description : ""}, '10' : { number : 10, description : ""}});
org.jinjor.synth.SynthDef.synthDefs = [org.jinjor.synth.SynthDef.GMPlayer,org.jinjor.synth.SynthDef.WebBeeper];
org.jinjor.webmidi.Track.trackId = 0;
org.jinjor.webmidi.Tune.pxPerMsModes = Lambda.array(Lambda.map([1,2,4,8,16,32],function(ratio) {
	return 1000 / 600000 * ratio;
}));
org.jinjor.webmidi.All.main();

//@ sourceMappingURL=webmidi.js.map