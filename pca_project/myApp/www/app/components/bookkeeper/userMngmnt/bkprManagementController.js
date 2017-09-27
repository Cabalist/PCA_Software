myApp.controller('BkprUsrManagementController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",1);

    $scope.unassignedWorkers = [];
    $scope.selectedUnassignedWorker = null;
    $scope.selectedUnassignedWorkerIndex = null;

    $scope.rawManagers =[]; //This is used to store managers and full worker history, including those that have been unassigned.
    $scope.managers = []; // this is used to show only those that haven't been unassigned.
    $scope.assigningWorkerToMgr = []; //[managerId,workerId,startDate]
    $scope.unassigningWorker = []; // [managerId,workerId,endDate]

    $scope.popup1 = {
	opened: false
    };

    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };    
    
    $http.get('/api/rest/workerManagement/' + $scope.orgId).then(function(data){
	$scope.unassignedWorkers = data.data.unassigned;

	$scope.rawManagers = data.data.managers;

	//filter out workers that have been unassigned.
	for (var i=0;i<data.data.managers.length;i++){
	    var m = data.data.managers[i];
	    var tmp = { 'first_name': m.first_name,
			'last_name': m.last_name,
			'pk':m.pk,
			'username':m.username,
			'workers':[]}
	    for (var y=0; y< m.workers.length; y++){
		
		if(m.workers[y].endDate == null){
		    tmp.workers.push(m.workers[y]);
		}
	    }
	    
	    $scope.managers.push(tmp);
	}
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
	$scope.assigningWorkerToMgr = [managerId,$scope.selectedUnassignedWorker.pk, new Date()]; //[managerId,workerId,startDate]
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
    };

    $scope.unassignWorker = function(managerId,workerId){
	$scope.unassigningWorker = [managerId, workerId, new Date()];	
    };

    $scope.cancelUnassignment = function(){
	$scope.unassigningWorker = [];
    };
    
    $scope.saveUnassignment = function(relId,managerId,workerId){
	var endDate = moment($scope.unassigningWorker[2]).format('YYYY-MM-DD') ;
	
	var data = {'relId': relId,
		    'workerId':workerId,
		    'managerId':managerId,
		    'endDate':endDate }; 
	
	$http.put('/api/rest/workerManagement/' + $scope.orgId + '/' + relId ,JSON.stringify(data)).then(function(data){

	    //remove worker from managers list, remove unassignment box.
	    for (var i=0; i< $scope.managers.length;i++){ //find mana
		if ($scope.managers[i].pk == managerId){
		    for (var n=0;n<$scope.managers[i].workers.length;n++){
			if ($scope.managers[i].workers[n].workerInfo.pk == workerId){
			 
			    $scope.unassigningWorker = [];

			    $scope.managers[i].workers.splice(n,1) ;
			}
		    }
		}
	    };

	    //add worker to unassigned workers list.
	    $scope.unassignedWorkers.push(data.data);
	    
	});
	

    };
    

	
    $log.log("Hello from Bookkeeper Management  controller");
    
}]);


