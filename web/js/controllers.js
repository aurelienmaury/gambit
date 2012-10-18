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

function UploadCtrl($rootScope, $scope, $location, uploader, uploadFileList) {

    $scope.uploadFileList = uploadFileList;

    $scope.removeFile = function (index) {
        uploadFileList.splice(index, 1);
    };

    $scope.sendAll = function () {
        uploader.send($scope.uploadFileList, 0);
    };

    $scope.clear = function () {
        uploadFileList = uploadFileList.filter(function (fileDesc) {
            return fileDesc.status == FileStatus.UPLOADING || fileDesc.status == FileStatus.SELECTED;
        });
        $scope.uploadFileList = uploadFileList;
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

    eventbus.getNick(function (nick) {
        $scope.$apply(function () {
            $scope.nick = nick;
        });
    });

    $scope.$on('gambit.chat', function (angEvt, evt) {
        $scope.$apply(function () {
            chatHistory.push({txt:evt.message, nick:evt.nick});
        });
    });

    $scope.send = function () {
        eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
    }
}
