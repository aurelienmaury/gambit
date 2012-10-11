var FileStatus = {
    SELECTED:1,
    UPLOADING:2,
    FINISHED:3,
};

function RootCtrl($scope, $route, $routeParams, $location, eventbus) {
    
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.FileStatus = FileStatus;

    $scope.chatHistory = [];
    $scope.uploadFileList = [];
}

function HomeCtrl() {
}

function UploadCtrl($scope, $location, uploader) {

  $scope.removeFile = function(index) {
    $scope.uploadFileList.splice(index, 1);
  };

  $scope.sendAll = function () {
    angular.forEach($scope.uploadFileList, function(fileDesc) {
        if (fileDesc.status == FileStatus.SELECTED) {
            uploader.send(fileDesc, function() {
                if ($location.path() == '/upload-board') {
                    $scope.$apply();
                }
            });
        } 
    });
  }


  $scope.onDrop = function(file) {
    $scope.uploadFileList.push({name:file.name, status: FileStatus.SELECTED, file: file});
    $scope.$apply();
  };
}

function ContactCtrl($scope, eventbus, channelsInit) {
    
    $scope.chatInput = '';
    $scope.nick = eventbus.nick;

    eventbus.handle('gambit.chat', function(evt) {
        $scope.chatHistory.push({txt: evt.message, nick: evt.nick});
        $scope.$apply();
    });
    
    $scope.send = function() {
        eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
        $scope.$apply();
    }
}
