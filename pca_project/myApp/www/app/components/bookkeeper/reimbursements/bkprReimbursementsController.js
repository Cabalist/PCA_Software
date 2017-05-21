myApp.controller('BkprReimbursementsController', ['$scope','$http','$log','$stateParams','$state','uiGridConstants', function($scope,$http,$log,$stateParams,$state,uiGridConstants) {
    $scope.$emit("selectForm",4);

    $scope.canvId = $stateParams.canvId;
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
	    $scope.curPeriod = (curWeek-1)/2;
	}else {
	    $scope.period = curWeek/2;
	    $scope.curPeriod = curWeek/2;
	}
    }

    function calculatePeriod(){
	//Set start and end of period based on $scope.period
	$scope.startOfPeriod = moment($scope.selectedYear+"-01-01").add($scope.period*14-1,'days').startOf('week');
	$scope.startOfPeriodStr = $scope.startOfPeriod.format("MMMM Do, YYYY");
	
	$scope.endOfPeriod = $scope.startOfPeriod.clone().add(14,'days').startOf('week');
	$scope.endOfPeriodStr = $scope.endOfPeriod.format("MMMM Do, YYYY");
    }

    calculatePeriod();
    
    $scope.reimbValue=0;
    $scope.gridData=[];
    
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

    $scope.goToPrev = function(){
	$scope.period--;
	calculatePeriod();
    };


    $scope.goToNext = function(){
	$scope.period++;
	calculatePeriod();
    };
    
    $scope.gridOptions={
	showColumnFooter:true,
	enableGridMenu: true,
	exporterCsvFilename: 'C2W-'+$scope.year+'-'+$scope.period+'-Data.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	columnDefs:[{field:'worker',
		     width:'20%'},
		    {field:'year',
		     width:'16%'},
		    {field:'period',
		     width:'16%'},
		    {field:'startDate',
		     width:'16%'},
		    {name:"endDate",
		     field:'endDate',
		     width:'16%'},
		    {field:'value',
		     name:'$',
		     cellFilter:'currency',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'16%'}],
	onRegisterApi: function(gridApi){  // this is for exposing api to other controllers...
	    $scope.gridApi = gridApi; //Don't use it...
	}
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

    function filterReimbursements(reimbData){
	var results = [] ;
	for (var i=0;i<reimbData.length;i++){
	    if(($scope.selectedCnvsr.userInfo.pk == 0 )|| ($scope.selectedCnvsr.userInfo.pk==reimbData[i].user.pk)){
		var temp = reimbData[i];

		var worker = temp.user.first_name+" " +temp.user.last_name;

		temp.worker = worker;
		results.push(temp);
	    }
	}

	return results;
    };

    $http.get('/api/rest/reimbursements/' + $scope.orgId+"/"+$scope.selectedYear).then(function(data){
	$scope.gridData = filterReimbursements(data.data);
	
	$scope.gridOptions.data = $scope.gridData ;	
    });
    
    $scope.saveReimbursement = function(){
	var myData = {'worker' : $scope.selectedCnvsr.userInfo.pk,
		    'year' : $scope.selectedYear,
		    'period' : $scope.period,
		    'startDate' : $scope.startOfPeriod,
		    'endDate' : $scope.endOfPeriod,
		    'value' : $scope.reimbValue }

	$http.post('/api/rest/reimbursements/'+$scope.orgId+"/"+$scope.selectedYear,JSON.stringify(myData)).then(function(data){
	    //TODO:
	    var newData = filterReimbursements([data.data])
	    $scope.gridData.push(newData[0]);

	    //reset val
	    $scope.reimbValue=0;

	    //refresh grid;
	    if(typeof($scope.gridApi)!='undefined'){
		$scope.gridApi.core.refresh();
	    }
	});
    };
    
    $log.log("Hello from Bookkeeper Reimbursements controller");
}]);
