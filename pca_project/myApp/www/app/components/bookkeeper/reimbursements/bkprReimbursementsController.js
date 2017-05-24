myApp.controller('BkprReimbursementsController', ['$scope','$http','$log','$stateParams','$state','uiGridConstants','$timeout', function($scope,$http,$log,$stateParams,$state,uiGridConstants,$timeout) {
    $scope.$emit("selectForm",4);

    $scope.canvId = $stateParams.canvId;

    $scope.selectedCnvsr=false;
    
    var y = moment().format("YYYY");
    $scope.yearOptions = [y,String(y-1),String(y-2),String(y-3)];
    $scope.selectedYear = $stateParams.year;

        
    $scope.gridData=[];

    //WHy not use ui-sref in HTML?
    $scope.changeYear = function(year){
	$state.go('bookkeeper.reimbursements',{'canvId':$scope.canvId,'year':String(year)});
    };

    $scope.changeCnvsr = function(cnvsrId){
	$state.go('bookkeeper.reimbursements',{'canvId':String(cnvsrId),'year':String($scope.selectedYear)});
    };

    function selectCanvsr(){
	for(var i=0; i<$scope.canvassers.length; i++){
	    if($scope.canvId==$scope.canvassers[i].userInfo.pk){
		$scope.selectedCnvsr=$scope.canvassers[i];
	    }
	}
    }

    //get canvassers list
    $http.get('/api/rest/orgWorkers/' + $scope.orgId).then(function(data){
	var cnvsrs = [{'userInfo':
		       {'pk':0,
			'first_name':"All",
			'last_name':""}}];
	
	for (var i=0;i<data.data.length;i++){
	    cnvsrs.push(data.data[i]);
	}
	
	$scope.canvassers = cnvsrs;

	//select canvasser
	selectCanvsr();
    });

    var reimbUrl = "/api/rest/reimbursementRequests/"+$scope.orgId+"/"+$scope.selectedYear+"/"+$scope.canvId;
    $log.log(reimbUrl);
    $http.get(reimbUrl).then(function(data){
	$log.log(data.data);

	//Need to sort responded from pending response.
    });

    
    $log.log("Hello from Bookkeeper Reimbursements controller");
}]);
