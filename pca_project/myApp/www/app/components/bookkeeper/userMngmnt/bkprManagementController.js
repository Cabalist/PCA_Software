myApp.controller('BkprUsrManagementController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",1);

    $scope.unassignedWorkers = [];
    $scope.selectedUnassignedWorker = null;
    $scope.selectedUnassignedWorkerIndex = null;
    $scope.managers = [];
    $scope.assigningWorkerToMgr = []; //[managerId,workerId,startDate]
    $scope.workerAssignDate = new Date();

    $scope.popup1 = {
	opened: false
    };

    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };    
    
    $http.get('/api/rest/workerManagement/' + $scope.orgId).then(function(data){
	$scope.unassignedWorkers = data.data.unassigned;
	$scope.managers = data.data.managers;
    });

    $scope.selectUnassignedWorker = function(index){
	$scope.selectedUnassignedWorker = $scope.unassignedWorkers[index];
	$scope.selectedUnassignedWorkerIndex = index;
	$scope.assigningWorkerToMgr = [];
    };
    
    $scope.getUnassignedWorkerClass = function(index){
	if ($scope.selectedUnassignedWorkerIndex == index){
	    return "active";
	}
    };

    $scope.assignWorkerToManager = function(managerId){
	$scope.assigningWorkerToMgr = [managerId,$scope.selectedUnassignedWorker.pk, $scope.workerAssignDate]; //[managerId,workerId,startDate]
    };

    $scope.saveAssignment = function(){
	var data = {'manager':$scope.assigningWorkerToMgr[0],
		    'org': $scope.orgId,
		    'worker': $scope.assigningWorkerToMgr[1],
		    'startDate': moment($scope.assigningWorkerToMgr[2]).format('YYYY-MM-DD') };
	
	$http.post('/api/rest/workerManagement/' + $scope.orgId,JSON.stringify(data)).then(function(data){
	    //clear selected worker from unassigned list	    
	    $scope.unassignedWorkers.splice($scope.selectedUnassignedWorkerIndex,1);
	    $scope.selectedUnassignedWorker = null;
	    $scope.selectedUnassignedWorkerIndex =null;

	    //add new data to selected manager.
	    for (var i=0; i<$scope.managers.length; i++){
		if ($scope.managers[i].pk == $scope.assigningWorkerToMgr[0]){
		    $scope.managers[i].workers.push(data.data);
		    break;
		}
	    }

	    //exit 'assignment mode'
	    $scope.assigningWorkerToMgr=[];
	});
    };

    $scope.cancelAssignment = function(){
	$scope.assigningWorkerToMgr = [];
    }
    $log.log("Hello from Bookkeeper Management  controller");    
}]);
