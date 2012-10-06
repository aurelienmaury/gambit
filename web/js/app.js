'use strict';

var gambitModule = angular.module('gambit', [], function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'ng/home.html'
    });

    $routeProvider.when('/about', {
        templateUrl: 'ng/about.html'
    });

    $routeProvider.when('/contact', {
        templateUrl: 'ng/contact.html'
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

function ContactCtrl($scope, $route, $routeParams, $location, refdata) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.refdata = refdata;
}
