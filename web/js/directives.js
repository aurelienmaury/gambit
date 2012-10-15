gambitModule.directive('uploadbox', function () {
    return {
        restrict:'E',
        replace:true,
        transclude:true,
        scope:{onDrop:'&', monlien:'&'},
        templateUrl:'ng/directives/uploadbox.html',
        link:function (scope, element, attrs) {

            var behaviorOnOver = function (e) {
                e.stopPropagation();
                e.preventDefault();
                var elem = angular.element(element).children('#uploadbox-label');
                elem.addClass('label-warning');
                elem.removeClass('label-info');
            };

            var behaviorOnOut = function (e) {
                e.stopPropagation();
                e.preventDefault();
                var elem = angular.element(element).children('#uploadbox-label');
                elem.removeClass('label-warning');
                elem.addClass('label-info');
            };

            element.bind('dragover', behaviorOnOver);
            element.bind('dragenter', behaviorOnOver);
            element.bind('dragleave', behaviorOnOut);

            element.bind('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                scope.monlien();

            });

            element.bind('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var elem = angular.element(element).children('#uploadbox-label');
                elem.removeClass('label-warning');
                elem.addClass('label-info');
                angular.forEach(e.dataTransfer.files, function (droppedFile) {
                    scope.onDrop({file:droppedFile});
                });
            });


        }
    }
});

gambitModule.directive('uploadfile', function () {
    return {
        restrict:'E',
        replace:true,
        transclude:true,
        scope:true,
        templateUrl:'ng/directives/uploadfile.html'
    }
});