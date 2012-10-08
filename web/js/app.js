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

gambitModule.factory('eventbus', function() {
    var eb = new vertx.EventBus(	window.location.protocol + '//' 
    							+ 	window.location.hostname + ':' 
    							+ 	window.location.port + '/eventbus');

    return {
        bus: eb,
        sendChat: function(chatMessage) {
            this.bus.publish('gambit.chat', {message: chatMessage});
        },
        handle: function(channel, handler) {
            var bus = this.bus;
            bus.onopen = function() {
                console.log('added handler on '+channel);
                bus.registerHandler(channel, handler);
            };
        }
    };
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

function ContactCtrl($scope, eventbus) {
    $scope.chatHistory = [];
    $scope.chatInput = '';

    eventbus.handle('gambit.chat', function(evt) {
        $scope.chatHistory.push({txt: evt.message, author:'evt.author'});
        $scope.$digest();
    });

    $scope.eventbus = eventbus;
    
    $scope.send = function() {
        console.log('number of chat history '+$scope.chatHistory.length);
        console.log('sending '+$scope.chatInput);
        $scope.eventbus.sendChat($scope.chatInput);
        $scope.chatInput = '';
    }
}
