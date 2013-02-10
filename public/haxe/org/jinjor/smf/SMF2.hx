package org.jinjor.smf;

import js.Lib;

class SMF2 {
    static function main() {
        trace("Hello World !");
    }
}
class SmfData {
  public var format : Int;
  public var trackCount : Int;
  public var timeMode : Int;
  public var tracks : Array<Array<Array<Int>>>;
  private static function getVariableLength(buf, p : Int) : Array<Int> {
    var length = 0;
    var k = 1;
    while(k <= 4){
      var d = buf[p++];
      length = length*128 + d%128;
      if(d <= 127){
        break;
      }else if(k == 4){
        throw "4バイトを超えました";
      }
      k++;
    }
    return [length, k];
  }
  
  public function new(data) {
    var buf = Lib.eval("new Uint8Array(data)");
    //チャンクタイプ(4byte)
    var p = 0;
    if(!(buf[p++]==0x4d&&buf[p++]==0x54&&buf[p++]==0x68&&buf[p++]==0x64)){
      throw 'MIDIファイルではありません';
    }
    //データ長(4byte)
    p+=4;
    //フォーマット(2byte)
    this.format = buf[p++]*256 + buf[p++];
    //トラック数(2byte)
    var trackCount = buf[p++]*256 + buf[p++];
    //時間単位(2byte)
    this.timeMode = buf[p++]*256 + buf[p++];
    
    var tracks = [];
    for(i in 0...trackCount){

      var chunkType = [buf[p++], buf[p++], buf[p++], buf[p++]];
      if(!(chunkType[0]==0x4d&&chunkType[1]==0x54&&chunkType[2]==0x72&&chunkType[3]==0x6b)){
        throw 'チャンク名が不正です';
      }
      trace("Track start!");
      var dataLength = buf[p++]*256*256*256 + buf[p++]*256*256 + buf[p++]*256 + buf[p++];

      var end = p + dataLength;
      
      var events = [];

      var event = [];
      var prevEventFirst = null;
      while(p < end){
        var delta_incr = getVariableLength(buf, p);
        var delta = delta_incr[0];
        p += delta_incr[1];
        var eventFirst = buf[p++];
        var event = [delta, eventFirst];
        if(eventFirst == 0xff){//meta event（可変長）
          event.push(buf[p++]);//種類
          var metaLength_incr = getVariableLength(buf, p);
          var metaLength = metaLength_incr[0];
          p += metaLength_incr[1];
          for(k in 0...metaLength){
            event.push(buf[p++]);
          }
        }else if(eventFirst == 0xf7){//SystemExclusive（可変長）
          var sysxLength_incr = getVariableLength(buf, p);
          var sysxLength = sysxLength_incr[0];
          p += sysxLength_incr[1];
          for(k in 0...sysxLength){
            event.push(buf[p++]);
          }
        }else if(eventFirst == 0xf0){//SystemExclusive（可変長）
          while(true){
            var e = buf[p++];
            if(e == 0xf7){
              break;
            }else{
              event.push(e);
            }
          }
        }else if(eventFirst < 0xf0){//MidiEventまたはランニングステータス（MidiEventのみ）
          var firstData = null;
          if(eventFirst < 0x80){//running status
            var firstData = event.pop();
            if(prevEventFirst != null && (prevEventFirst < 0x80 || 0xf0 <= prevEventFirst)){
              throw '予期しないランニングステータス: ' + prevEventFirst;//一応
            }
            eventFirst = prevEventFirst;
            event.push(eventFirst);
          }else{
            var firstData = buf[p++];
          }
          if(eventFirst >= 0xc0){
            event.push(firstData);
          }else{
            event.push(firstData);
            event.push(buf[p++]);
          }
        }
        events.push(event);
        prevEventFirst = eventFirst;
      }
      tracks.push(events);
    }
    this.tracks = tracks;
    trace(tracks);
  }
}

class SMF3 {
  public var name : String;
  public var type : String;
  public var size : Int;
  public var smfData : SmfData;
  public function new(file, reader, onReady) {
    this.name = file.name;
    this.type = file.type;
    this.size = file.size;
    
    var that = this;
    reader.onload = function(event) {
      var data = event.target.result;
      that.smfData = new SmfData(data);
      onReady();
    };
    reader.readAsArrayBuffer(file);
  }
}