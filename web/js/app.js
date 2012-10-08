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

gambitModule.factory('event-bus', function() {
    var eb = new vertx.EventBus(	window.location.protocol + '//' 
    							+ 	window.location.hostname + ':' 
    							+ 	window.location.port + '/eventbus');

	eb.onopen = function() {    
    	eb.registerHandler('agora.out', function(body) { });
  	};


	eb.onclose = function() {
		eb = null;
	};

    return eb;
  });

function RootCtrl($scope, $route, $routeParams, $location, refdata) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.refdata = refdata;
}

function HomeCtrl() {
}

function AboutCtrl() {    
}

function ContactCtrl(event-bus) {
}
