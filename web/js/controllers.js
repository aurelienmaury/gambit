var FileStatus = {
    SELECTED:1,
    UPLOADING:2,
    FINISHED:3
};

gambitModule.value('uploadFileList', []);

function RootCtrl($scope, $route, $routeParams, $location, eventbus) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.FileStatus = FileStatus;

    $scope.chatHistory = [];
}

function HomeCtrl($scope, fileStore) {

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
                console.log('refreshTimer done');
                $scope.refreshTimer = null;
            }, 700);
            console.log('refreshTimer set');
        }
    }


    $scope.sendAll = function () {
        angular.forEach($scope.uploadFileList, function (fileDesc) {
            if (fileDesc.status == FileStatus.SELECTED) {
                uploader.send(fileDesc,
                    // init callback
                    function () {
                        fileDesc.progress = 0;
                        fileDesc.status = FileStatus.UPLOADING;
                        $scope.refresh();
                    },
                    // progress callback
                    function (e) {
                        if (e.lengthComputable) {

                                fileDesc.progress = Math.round((e.loaded * 100) / e.total);
                            $scope.refresh();
                        }
                    },
                    // end callback
                    function (e) {

                            fileDesc.progress = 100;
                            fileDesc.status = FileStatus.FINISHED;
                        $scope.refresh();
                    });
            }
        });
    };

    $scope.addMock = function () {
        $scope.$apply(function () {
            $scope.uploadFileList.push({name:'file.name', status:FileStatus.SELECTED});
            console.log('addMock');
        });
    };

    $scope.onDrop = function (file) {
        $scope.$apply(function () {
            $scope.uploadFileList.push({name:file.name, status:FileStatus.SELECTED, file:file});
        });
    };
}

function ContactCtrl($scope, eventbus, channelsInit) {

    $scope.chatInput = '';
    $scope.nick = eventbus.nick;

    eventbus.handle('gambit.chat', function (evt) {
        $scope.$apply(function () {
            $scope.chatHistory.push({txt:evt.message, nick:evt.nick});
        });
    });

    $scope.send = function () {
        eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
    }
}
