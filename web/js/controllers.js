function RootCtrl($scope, $route, $routeParams, $location, eventbus) {
    
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.chatHistory = [];
    $scope.eventbus = eventbus;
}

function HomeCtrl() {
}

function UploadCtrl() {    
}

function ContactCtrl($scope) {
    
    $scope.chatInput = '';

    $scope.eventbus.handle('gambit.chat', function(evt) {
        $scope.chatHistory.push({txt: evt.message, nick: evt.nick});
        $scope.$digest();
    });
    
    $scope.send = function() {
        $scope.eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
    }
}
