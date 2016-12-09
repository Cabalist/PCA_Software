
var myApp = angular.module('userApp', ['ui.router','ui.bootstrap']);

myApp.config(function($stateProvider){
    $stateProvider
        .state('profile', {
	    url: "/",
	    templateUrl: '/www/partials/profile.html',
	    controller: 'ProfileController'
	});
});


myApp.controller('ProfileController', ['$scope', function($scope) {
    $scope.profilePic = '/www/img/blank-profile-picture-973460_960_720.png';
}]);
