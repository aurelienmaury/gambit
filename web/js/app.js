'use strict';

var gambitModule = angular.module('gambit', [], function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'ng/home.html'
    });

    $routeProvider.when('/about', {
        templateUrl: 'ng/about.html'
    });

    $routeProvider.otherwise({redirectTo:'/'});
    
    $locationProvider.html5Mode(true);

    
});

gambitModule.value('refdata', {
		name: 'tata',
	    changeName: function(name) {
	      this.name = name;
	    }

	  });



function RouteCtrl($route) {

    var self = this;

    $route.when('/', {template:'ng/home.html'});

    $route.when('/outwards', {template:'ng/outwards.html'});

    $route.when('/inwards/:outwardId', {template:'ng/inwards.html'});

    $route.otherwise({redirectTo:'/'});
}

function HomeCtrl($scope, $route, $routeParams, $location, refdata) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.refdata = refdata;
}

function AboutCtrl($scope, $route, $routeParams, $location, refdata) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.refdata = refdata;
}
