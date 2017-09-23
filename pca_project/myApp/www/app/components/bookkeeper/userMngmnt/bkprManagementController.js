myApp.controller('BkprUsrManagementController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",1);

    $scope.unassignedWorkers = [];
    $scope.selectedUnassignedWorkerId = null;
    $scope.selectedUnassignedWorkerIndex = null;
    
    $http.get('/api/rest/workerManagement/' + $scope.orgId).then(function(data){
	$scope.unassignedWorkers = data.data.unassigned;
    });

    $scope.selectUnassignedWorker = function(index){
	$scope.selectedUnassignedWorkerId = $scope.unassignedWorkers[index];
	$scope.selectedUnassignedWorkerIndex = index;
    };

    $scope.getUnassignedWorkerClass = function(index){
	if ($scope.selectedUnassignedWorkerIndex == index){
	    return "active";
	}
    };
    
    $log.log("Hello from Bookkeeper Management  controller");    
}]);
