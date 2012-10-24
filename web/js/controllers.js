var FileStatus = {
    SELECTED:1,
    UPLOADING:2,
    FINISHED:3
};

gambitModule.value('uploadFileList', []);
gambitModule.value('chatHistory', []);


function RootCtrl($rootScope, $scope, $route, $routeParams, $location, eventbus) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.FileStatus = FileStatus;

    $scope.availableFiles = [];

    $scope.doLogin = function(username, password) {
        eventbus.login(username, password, function(reply) {
           console.log('reply is '+reply);
        });
    };

    $rootScope.refresh = function () {
        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        } else {
            if (!$rootScope.refreshTimer) {
                $rootScope.refreshTimer = setTimeout(function () {
                    $rootScope.refresh();
                    $rootScope.refreshTimer = null;
                }, 500);
            }
        }
    }
}

function HomeCtrl($scope, fileStore) {
    fileStore.list(function (reply) {
        $scope.availableFiles = reply;
        $scope.refresh($scope);
    });
}

function SearchCtrl($scope, fileStore) {
    fileStore.list(function (reply) {
        $scope.availableFiles = reply;
        $scope.refresh($scope);
    });
}

function UploadCtrl($rootScope, $scope, $location, uploader, uploadFileList) {

    $scope.uploadFileList = uploadFileList;

    $scope.removeFile = function (index) {
        uploadFileList.splice(index, 1);
    };

    $scope.sendAll = function () {
        uploader.send($scope.uploadFileList, 0);
    };

    $scope.onDrop = function (file) {
        uploadFileList.push({name:file.name, status:FileStatus.SELECTED, file:file});
        $rootScope.refresh();
    };
}

function ContactCtrl($rootScope, $scope, eventbus, channelsInit, chatHistory) {

    $scope.chatHistory = chatHistory;
    $scope.chatInput = '';

    eventbus.getNick(function (nick) {
        $scope.$apply(function () {
            $scope.nick = nick;
        });
    });

    $scope.$on('gambit.chat', function (angEvt, evt) {
        chatHistory.push({txt:evt.message, nick:evt.nick});
        $rootScope.refresh();
    });

    $scope.send = function () {
        eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
    }
}
