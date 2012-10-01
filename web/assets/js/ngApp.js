angular.module('gambit', [], function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'ng/home.html',
        controller: HomeCntl
    });

    $routeProvider.when('/about', {
        templateUrl: 'ng/about.html',
        controller: AboutCntl
    });

    $routeProvider.when('/contact', {
        templateUrl: 'ng/contact.html',
        controller: ContactCntl
    });
     
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
    }).directive('tabs', function() {
    return {
      restrict: 'E', // is html tag
      transclude: true, // has inner content
      templateUrl: 'ng/directives/tabs.html',        
      replace: true,
      scope: {},
      controller: function($scope, $element) {
            var panes = $scope.panes = [];
     
            $scope.select = function(pane) {
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
              pane.selected = true;
            }
     
            this.addTab = function(pane) {
                if (panes.length == 0) {
                    $scope.select(pane);
                }
                panes.push(pane);
            }
      }
    };
  }).
    directive('tab', function() {
        return {
            require: '^tabs',
            restrict: 'E',
            scope: { title: '@', target: '@' },
            link: function(scope, element, attrs, tabsCtrl) {
              tabsCtrl.addTab(scope);
            },
            template: '<li ng-class="{active:selected}"><a href="{{target}}">{{title}}</a></li>',
            replace: true
        };
    });

    function HomeCntl($scope, $route, $routeParams, $location) {
    	$scope.$route = $route;
    	$scope.$location = $location;
    	$scope.$routeParams = $routeParams;
    }
     
    function AboutCntl($scope, $routeParams) {
    	$scope.name = "AboutCntl";
    	$scope.params = $routeParams;
    }
     
    function ContactCntl($scope, $routeParams) {
    	$scope.name = "ContactCntl";
    	$scope.params = $routeParams;
    }