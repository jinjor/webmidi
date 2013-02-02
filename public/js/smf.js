(function(ns){
  
  var Track = function(events){
    console.log("イベント長: " + events.length);
    this.events = events;
  };
  
  var SmfFile = function(file, onReady){
    this.name = file.name;
    this.type = file.type;
    this.size = file.size;
    var reader = new FileReader();//TODO Html5?
    var that = this;
    reader.onload = function(event) {
      var data = event.target.result;
      that.smfData = new SmfData(data);
      onReady();
    };
    //reader.onerror = function(error) {
    //    console.log(error);
    //};
    reader.readAsArrayBuffer(file);
  };
  
  
  var getVariableLength = function(buf, p){
    var length = 0;
    var k = 1;
    for(; k <= 4; k++){
      var d = buf[p++];
      length = length*128 + d;
      if(d <= 127){
        break;
      }else if(k == 4){
        throw "4バイトを超えました"
      }
    }
    return [length, k];
  };
  
  var SmfData = function(data){
    var buf = new Uint8Array(data);
    //チャンクタイプ(4byte)
    var p = 0;
    if(!(buf[p++]==0x4d&&buf[p++]==0x54&&buf[p++]==0x68&&buf[p++]==0x64)){
      throw 'MIDIファイルではありません'
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
    for(var i = 0; i < trackCount; i++){
    //for(var i = 0; i < 1; i++){
      var chunkType = [buf[p++], buf[p++], buf[p++], buf[p++]];
      if(!(chunkType[0]==0x4d&&chunkType[1]==0x54&&chunkType[2]==0x72&&chunkType[3]==0x6b)){
        throw 'チャンク名が不正です'
      }
      console.log("Track start!");
      var dataLength = buf[p++]*256*256*256 + buf[p++]*256*256 + buf[p++]*256 + buf[p++];

      var end = p + dataLength;
      
      var events = [];

      var event = [];
      var prevEventFirst;
      while(p < end){
        var delta_incr = getVariableLength(buf, p);
        var delta = delta_incr[0];
        p += delta_incr[1];
        var eventFirst = buf[p++];
        var event　= [delta, eventFirst];
        if(eventFirst == 0xff){//meta event（可変長）
          event.push(buf[p++]);//種類
          var metaLength_incr = getVariableLength(buf, p);
          var metaLength = metaLength_incr[0];
          p += metaLength_incr[1];
          for(var k = 0; k < metaLength; k++){
            event.push(buf[p++]);
          }
        }else if(eventFirst == 0xf7){//SystemExclusive（可変長）
          var sysxLength_incr = getVariableLength(buf, p);
          var sysxLength = sysxLength_incr[0];
          p += sysxLength_incr[1];
          for(var k = 0; k < sysxLength; k++){
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
        }else if(0x80 <= eventFirst && eventFirst < 0xf0){//MidiEvent
          if(eventFirst >= 0xc0){
            event.push(buf[p++]);
          }else{
            event.push(buf[p++]);
            event.push(buf[p++]);
          }
        }else{//ランニングステータス（MIDIイベントのみ）
          var firstData = event.pop();
          eventFirst = prevEventFirst;
          event.push(eventFirst);

          if(0x80 <= eventFirst && eventFirst < 0xf0){//MidiEvent
            if(eventFirst >= 0xc0){
              event.push(firstData);
            }else{
              event.push(firstData);
              event.push(buf[p++]);
            }
          }else{
            throw '予期しないランニングステータスです'
          }
        }
        console.log(event);
        events.push(event);
        prevEventFirst = eventFirst;
      }

      tracks.push(new Track(events));
    }
    this.tracks = tracks;
    console.log(tracks);
  };
  
  if(!ns.org){org = {};}
  if(!org.jinjor){org.jinjor = {};}
  if(!org.jinjor.smf){org.jinjor.smf = {};}
  org.jinjor.smf.Track = Track;
  org.jinjor.smf.SmfFile = SmfFile;
  org.jinjor.smf.SmfData = SmfData;
  
})(this);

