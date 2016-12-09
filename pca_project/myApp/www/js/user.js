
var myApp = angular.module('userApp', ['ui.router','ui.bootstrap']);

myApp.config(function($stateProvider){
    $stateProvider
        .state('home', {
	    url: "/",
	    templateUrl: '/www/partials/users.home.html'
	});
});
