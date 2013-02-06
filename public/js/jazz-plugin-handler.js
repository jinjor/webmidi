
var JazzPlugin = {
  attachTo: function(module){
    module.factory('jazz', function($rootScope) {
      var $scope = $rootScope;
      var midiProc = function(t,a,b,c){};
      var Jazz;
      var active_element;
      //// Connect/disconnect
      var connectMidiIn = function(){
        Jazz.MidiInOpen($scope.currentMidiIn, midiProc);
      };
      var disconnectMidiIn = function(){
        Jazz.MidiInClose();
        $scope.currentMidiIn = 'Not connected';
      };
      
      $scope.currentMidiIn = 'Not connected';
      $scope.changeMidiIn = function(newMidiIn){
        try{
          if(newMidiIn == 'Not connected'){
           Jazz.MidiInClose();
          } else {
           Jazz.MidiInOpen(newMidiIn, midiProc);
          }
         }catch(e){
          console.log(e);
         }
      };
      
      $scope.midiIns = ['Not connected'];
      
      $(document).ready(function(){
        Jazz = document.getElementById('Jazz1');
        if(!Jazz || !Jazz.isJazz) {
          Jazz = document.getElementById('Jazz2');
        }
        $scope.currentMidiIn = Jazz.MidiInOpen ? Jazz.MidiInOpen(0, midiProc) : "";
        
        $scope.midiIns = Jazz.MidiInList ? Jazz.MidiInList() : [];
        $scope.midiIns.unshift('Not connected');

        if(navigator.appName == 'Microsoft Internet Explorer'){
          document.onfocusin = function(){
           active_element = document.activeElement;
           connectMidiIn();
          };
          document.onfocusout = function(){
           if(active_element != document.activeElement){
             active_element = document.activeElement;
             return;
           }
           disconnectMidiIn();
          };
        }else{
          window.onfocus = connectMidiIn;
          //window.onblur = disconnectMidiIn;
        }
      });
      
      return {
        onMessage: function(f){
          midiProc = f;
        }
      };
    });
  }
};
