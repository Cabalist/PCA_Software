myApp.controller('BkprReimbursementsController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
    $scope.$emit("selectForm",4);

    $scope.canvId = $stateParams.canvId;
    $scope.canvassers = [];
    $scope.selectedCnvsr=false;
    
    var y = moment().format("YYYY");

    $scope.yearOptions = [y,String(y-1),String(y-2),String(y-3)];
    $scope.selectedYear = $stateParams.year;

    //handle case if year is previous, perioud should be last of the year
    var now = moment();
    if ($scope.selectedYear < now.year()){
	$scope.period=26;
    }else{
	var curWeek = now.week();
	$scope.period = null;
	

	//if odd, get start of previous week.
	if (curWeek%2!=0){
	    $scope.period = (curWeek-1)/2;
	}else {
	    $scope.period = curWeek/2;
	}
    }

    $scope.startOfPeriod = moment($scope.selectedYear+"-01-01").add($scope.period*14-1,'days').startOf('week');
    $scope.startOfPeriodStr = $scope.startOfPeriod.format("MMMM Do, YYYY");

    $scope.endOfPeriod = $scope.startOfPeriod.clone().add(14,'days').startOf('week');
    $scope.endOfPeriodStr = $scope.endOfPeriod.format("MMMM Do, YYYY");

    $scope.reimbValue=0;
    
    //TODO move this into the html
    $scope.getSaveClass = function(){
	if ($scope.reimbValue>0){
	    return "btn-primary";
	}else{
	    return "btn-default";
	}
    };
    

    //Why not just ui-sref?
    $scope.changeYear = function(year){
	$scope.selectedYear=String(year);
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

    $scope.saveReimbursement = function(){
	var myData = {'worker' : $scope.selectedCnvsr.userInfo.pk,
		    'year' : $scope.selectedYear,
		    'period' : $scope.period,
		    'startDate' : $scope.startOfPeriod,
		    'endDate' : $scope.endOfPeriod,
		    'value' : $scope.reimbValue }

	$http.post('/api/rest/reimbursements/'+$scope.orgId+"/"+$scope.selectedYear,JSON.stringify(myData)).then(function(data){
	    $log.log(data.data);
	});
	
    };
    $log.log("Hello from Bookkeeper Reimbursements controller");
}]);
