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

function UploadCtrl($scope, uploader) {

  onDrop = function() {
    console.log('onDrop fired in controller');
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
