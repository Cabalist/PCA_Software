myApp.controller('mainController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.userId = document.getElementById('userId').value;
    $scope.userName = document.getElementById('userName').value;
    $scope.orgList = [];

    //TODO FIX THIS ... OrgList is used to populate org list dropdown in /profile ,
    //  Also this information used to get org name in org page...
    $http.get('/api/rest/orgList').then(function(data){
	$scope.orgList = data.data;
    });
}]);

