var FileStatus = {
    SELECTED:1,
    UPLOADING:2,
    FINISHED:3
};

gambitModule.value('uploadFileList', []);
gambitModule.value('chatHistory', []);


function RootCtrl($scope, $route, $routeParams, $location, eventbus) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.FileStatus = FileStatus;

    $scope.availableFiles = [];

    $scope.refresh = function (scope) {
        if (!scope.refreshTimer) {
            scope.refreshTimer = setTimeout(function () {
                scope.$apply();
                scope.refreshTimer = null;
            }, 200);
        }
    }
}

function HomeCtrl($scope, fileStore) {
    fileStore.list(function (reply) {
        $scope.availableFiles = reply;
        $scope.refresh($scope);
    });
}

function UploadCtrl($scope, $location, uploader, uploadFileList) {

    $scope.uploadFileList = uploadFileList;

    $scope.removeFile = function (index) {
        uploadFileList.splice(index, 1);
    };


    $scope.refresh = function () {
        if (!$scope.refreshTimer) {
            $scope.refreshTimer = setTimeout(function () {
                $scope.$apply();
                $scope.refreshTimer = null;
            }, 500);
        }
    }


    $scope.sendAll = function () {
        uploader.send($scope.uploadFileList,
            // progress callback
            $scope.refresh, 0);
    };

    $scope.clear = function () {
        $scope.uploadFileList.push({name:'file.name', status:FileStatus.SELECTED});
    };

    $scope.onDrop = function (file) {
        $scope.$apply(function () {
            $scope.uploadFileList.push({name:file.name, status:FileStatus.SELECTED, file:file});
        });
    };
}

function ContactCtrl($scope, eventbus, channelsInit, chatHistory) {

    $scope.chatHistory = chatHistory;
    $scope.chatInput = '';
    eventbus.getNick(function(nick) {
        $scope.nick = nick;
        $scope.refresh($scope);
    });

    $scope.$on('MyEvent', function() {
        $scope.$apply();
    });

    $scope.send = function () {
        eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
    }
}
