myApp.controller('BkprAdjustmentsController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",3);

    $scope.canvId = $stateParams.canvId;

    var y = moment().format("YYYY");
    $scope.yearOptions = [y,y-1,y-2,y-3];
    $scope.selectedYear = $stateParams.year;

    function selectCanvsr(){
	for(var i=0; i<$scope.canvassers.length; i++){
	    if($scope.canvId==$scope.canvassers[i].userInfo.pk){
		$scope.selectedCnvsr=$scope.canvassers[i];
	    }
	}
    }

    //get canvassers list
    $http.get('/api/rest/orgWorkers/' + $scope.orgId).then(function(data){
	$scope.canvassers =[{'userInfo':
			     {'pk':0,
			      'first_name':"All",
			      'last_name':""}}];

	//push
	for (var i=0;i<data.data.length;i++){
	    $scope.canvassers.push(data.data[i]);
	}

	//select canvasser
	selectCanvsr();
    });



    //get all credit card and check transactions for the year
    $http.get('/api/rest/orgAdjustments/' + $scope.orgId+"/"+ $scope.selectedYear).then(function(data){
	$log.log(data.data);

    });
    
    $log.log("CanvId:",$scope.canvId,"year:",$scope.selectedYear);    
    

    $log.log("Hello from Bookkeeper Adjustmentss  controller");
}]);
