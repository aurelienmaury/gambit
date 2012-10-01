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