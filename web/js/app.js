'use strict';

var gambitModule = angular.module('gambit', [], function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'ng/home.html'
    });

    $routeProvider.when('/upload-board', {
        templateUrl: 'ng/upload-board.html'
    });

    $routeProvider.when('/contact', {
        templateUrl: 'ng/contact.html'
    });

    $routeProvider.otherwise({redirectTo:'/'});
    
    $locationProvider.html5Mode(true);

    
});
