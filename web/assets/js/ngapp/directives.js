var gambitDirectivesModule = angular.module('gambit.directives', []);

gambitDirectivesModule.directive('tabs', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'ng/directives/tabs.html',        
        replace: true,
        scope: {},
        controller: function($scope, $element) {
            var panes = $scope.panes = [];
         
            $scope.select = function(pane) {
                angular.forEach(panes, function(pane) { pane.selected = false; });
                pane.selected = true;
            }
         
            this.addTab = function(pane) {
                if (panes.length == 0) {
                    $scope.select(pane);
                }
                panes.push(pane);
            }

            this.select = $scope.select;
        }
    };
});

gambitDirectivesModule.directive('tab', function() {
    return {
        require: '^tabs',
        restrict: 'E',
        selected: false,
        scope: { title: '@', target: '@'},
        link: function($scope, element, attrs, tabsCtrl) {
            tabsCtrl.addTab($scope);
            $scope.select = tabsCtrl.select;
        },
        template: '<li ng-class="{active:selected}"><a href="{{target}}" ng-click="select(this)">{{title}}</a></li>',
        replace: true
    };
});