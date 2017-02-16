myApp.controller('ytdController', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.$emit("selectReport",1);

    $scope.myData = [];    
    
    $http.get('/api/rest/orgYTDDonations/' + $scope.orgId+'/'+moment().year()).then(function(data){
	$scope.myData = data.data;

    });

}]);
