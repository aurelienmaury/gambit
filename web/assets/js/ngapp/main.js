var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

var gambitModule = angular.module('gambit', ['gambit.directives'], function($routeProvider, $locationProvider) {

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

    $scope.sendMessage = function() {
        var message = this.text;
        if (message.length > 0) {
            eb.send('gambit.chat', {text: message});
            this.text = '';
        }
    };
}
    