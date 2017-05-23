myApp.controller('ManagerReimbursementsController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
    $scope.$emit("selectForm",3);

    $scope.selectedYear = $stateParams.year;
    $scope.canvId = $stateParams.canvId;
    $scope.workers = [];
    
    $scope.dt= new Date();

    var y = moment().format("YYYY");
    $scope.yearOptions = [y,y-1,y-2,y-3];

    $scope.typeOptions = [ {'name':"Personal Expenditure for Reimbursement",'id':1},
			 ];
    $scope.selectedType = $scope.typeOptions[0];
    
    $scope.popup1 = {
	opened: false
    };
    
    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };
    $scope.payee = null;
    $scope.amount = 0.0;
    
    function selectWorker(){
	for(var i=0; i<$scope.workers.length; i++){
	    if($scope.canvId==$scope.workers[i].userInfo.pk){
		$scope.selectedWorker=$scope.workers[i];
	    }
	}
    }
    
    //Get org workers list.
    $http.get('/api/rest/orgWorkers/' + $scope.orgId).then(function(data){
	var cnvsrs = [{'userInfo':
		       {'pk':0,
			'first_name':"All",
			'last_name':""}}];

	for (var i=0;i<data.data.length;i++){
	    cnvsrs.push(data.data[i]);
	}
	
	$scope.workers = cnvsrs;
	selectWorker();
    });


    function validateForm(){
	var form = {'status':1};
	
	if ($scope.canvId!=0){
	    form.worker = $scope.canvId;
	}else{
	    form.status = 0;
	    form.errorMsg = "Must select worker.";
	}
	
	if ($scope.payee != null){
	    form.payee = $scope.payee;
	}else{
	    form.status = 0;
	    form.errorMsg = "Must specify Contributor/Payee.";
	}

	if ($scope.amount>0){
	    form.amount=$scope.amount;
	}else{
	    form.status = 0;
	    form.errorMsg = "Amount must be greater than 0";
	}
	return form;
    };
    
    $scope.addRequest = function(){
	var form = validateForm();
	if (form.status){
	    $http.post("/api/rest/reimbursements/",JSON.stringify(form)).then(function(data){
		
		$scope.errorMsg = null;
	    });
	}else{
	    //set message here...
	    $scope.errorMsg = form.errorMsg;
	    $log.log(form.errorMsg);
	}
    };

    //Why not do ui-sref in http?
    $scope.workerChange = function(userId){
	$state.go("manager.reimbursements",{'canvId':String(userId),'year':String($scope.selectedYear)});
    };

    $scope.addRequestClass = function(){
	//This checks if 'add request' button should be active
	if (validateForm().status){
	    return "btn-primary";
	}else{
	    return "btn-default";
	}
    }

    $log.log("Hello from Manager Reimbursements Controller");
}]);
