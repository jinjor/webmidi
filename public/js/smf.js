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
  
  var SmfData = function(data){
    var buf = new Uint8Array(data);
    //チャンクタイプ(4byte)
    var p = 0;
    if(!(buf[p++]==0x4d&&buf[p++]==0x54&&buf[p++]==0x68&&buf[p++]==0x64)){
      throw {
        id:'illegularFormat.notMidi',
        message:'MIDIファイルではありません'
      }
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
      var chunkType = [buf[p++], buf[p++], buf[p++], buf[p++]];
      if(!(chunkType[0]==0x4d&&chunkType[1]==0x54&&chunkType[2]==0x72&&chunkType[3]==0x6b)){
        throw {
          id:'illegularFormat.noknownChunkType',
          message:'チャンク名が不正です'
        }
      }
      var events = [];
      var dataLength = buf[p++]*256*256*256 + buf[p++]*256*256 + buf[p++]*256 + buf[p++];
      var event = [];
      for(var j = 0; j < dataLength; j++){
        var v = buf[p++];
        event.push(v);
        if(v <= 127){
          events.push(event);
          event = [];
        }
      }
      if(event.length > 0){
        throw {
          id:'illegularFormat',
          message:'余りがあります: ' + event
        }
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

