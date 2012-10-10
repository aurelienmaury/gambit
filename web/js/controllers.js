var FileStatus = {
    SELECTED:1,
    UPLOADING:2,
    FINISHED:3,
};

function RootCtrl($scope, $route, $routeParams, $location, eventbus) {
    
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.chatHistory = [];
    $scope.uploadFileList = [];
}

function HomeCtrl() {
}

function UploadCtrl($scope) {

    $scope.upload = function(file) {
      var xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
              var percentage = Math.round((e.loaded * 100) / e.total);
              console.log('ok:'+percentage+'%');
            }
          }, false);
       
      xhr.upload.addEventListener("load", function(e){
              console.log('finished');
              
          }, false);
      xhr.open("PUT", "/upload?filename=customName");
      
      xhr.send(file); 
    };



    var dropzone = document.getElementById("dropzone");
    dropzone.ondragover = dropzone.ondragenter = function(event) {
      event.stopPropagation();
      event.preventDefault();
    }

    dropzone.ondrop = function(event) {
      event.stopPropagation();
      event.preventDefault();

      var filesArray = event.dataTransfer.files;
      for (var i=0; i<filesArray.length; i++) {
          upload(filesArray[i]);
      }
    } 
}

function ContactCtrl($scope, eventbus, channelsInit) {
    
    $scope.chatInput = '';

    channelsInit['gambit.chat'] = function(evt) {
        $scope.chatHistory.push({txt: evt.message, nick: evt.nick});
        $scope.$apply();
    };
    
    $scope.send = function() {
        
        eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
    }
}
