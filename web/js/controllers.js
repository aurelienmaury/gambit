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
    $scope.uploadFileList = [
      {name:'file 1', status: FileStatus.UPLOADING, progress: 60},
      {name:'file 2', status: FileStatus.SELECTED},
      {name:'file 3', status: FileStatus.FINISHED},
    ];
}

function HomeCtrl() {
}

function UploadCtrl($scope, uploader) {

  $scope.onDrop = function(file) {
    console.log('onDrop fired in controller'+file.name);
  };
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
