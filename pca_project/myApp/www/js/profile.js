
var myApp = angular.module('userApp', ['ui.router','ui.bootstrap']);

myApp.config(function($stateProvider){
    $stateProvider
        .state('profile', {
	    url: "/",
	    templateUrl: '/www/partials/profile.html',
	    controller: 'ProfileController'
	});
});


myApp.controller('ProfileController', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.profilePic = '/www/img/blank-profile-picture-973460_960_720.png';

    $scope.userId = document.getElementById('userId').value;
    $scope.userOrgs = [];
    
    $http.get('/api/rest/userRoles/' + $scope.userId).then(function(data){
	$scope.userOrgs = data.data;
    });

    $scope.getRoleName=function(roleNum){
	if (roleNum==1){
	    return "Wizard"
	}else if (roleNum==2){
	    return "Canvasser"
	}
    };
    
}]);
