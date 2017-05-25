myApp.controller('BkprReimbursementsController', ['$scope','$http','$log','$stateParams','$state','uiGridConstants','$timeout','uiGridConstants', function($scope,$http,$log,$stateParams,$state,uiGridConstants,$timeout,uiGridConstants) {
    $scope.$emit("selectForm",4);

    $scope.canvId = $stateParams.canvId;

    $scope.selectedCnvsr=false;
    
    var y = moment().format("YYYY");
    $scope.yearOptions = [y,String(y-1),String(y-2),String(y-3)];
    $scope.selectedYear = $stateParams.year;

    $scope.incomingRequests = [];
    $scope.reimbursementsHistory = [];
    $scope.showSpinner=true;
    
    
    //WHy not use ui-sref in HTML?
    $scope.changeYear = function(year){
	$state.go('bookkeeper.reimbursements',{'canvId':$scope.canvId,'year':String(year)});
    };

    $scope.changeCnvsr = function(cnvsrId){
	$state.go('bookkeeper.reimbursements',{'canvId':String(cnvsrId),'year':String($scope.selectedYear)});
    };

    //init spinner
    var target = document.getElementById('spinner')
    var spinner = new Spinner().spin(target);

    
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

	var revs = [];
	for (var i=0;i<data.data.length;i++){
	    cnvsrs.push(data.data[i]);
	    revs.push(data.data[i]);
	}
	$scope.reviewers = revs;
	$scope.canvassers = cnvsrs;

	//select canvasser
	selectCanvsr();
    });

    function prepareIncomingRequest(request){	
	var temp = request;
	temp["reviewer"] = null;
	temp["requestedOn"] = moment(new Date(temp.requestedOn)).format("YYYY-MM-DD");
	temp["reviewedOn"] = new Date();
	temp["opened"] = false;
	temp["status"] = 1;
	return temp;	
    };

    function prepareRequestHistory(request){
	temp = {};

	temp.worker = request.worker.first_name+" " + request.worker.last_name;
	temp.date = request.date;
	temp.payee = request.payee;
	temp.purpose = request.purpose;
	temp.amount = request.amount;
	temp.requestedBy = request.requester.first_name+" " + request.requester.last_name;
	temp.requestedOn = moment(request.requestedOn).format("YYYY-MM-DD");
	temp.reviewer = request.response.reviewer.first_name + ' '+ request.response.reviewer.last_name;
	temp.reviewedOn = request.response.reviewedOn;
	temp.responder = request.response.responder.first_name + " " + request.response.responder.last_name;
	temp.respondedOn = moment(request.response.respondedOn).format("YYYY-MM-DD");

	if (request.response.status==2){
	    temp.status = "approved";
	}else if (request.response.status==3){
	    temp.status = "rejected";
	}
	
	return temp;
    };
    function sortRequests(data){
	//sort requests, appending them to either grid to show processed requests, or to incomig list if there is no resposne.
	for(var i =0;i<data.length;i++){
	    if (data[i].response==null){
		var temp = prepareIncomingRequest(data[i]);
		$scope.incomingRequests.push(temp);
	    }else{
		var temp = prepareRequestHistory(data[i]);
		$scope.reimbursementsHistory.push(temp);
	    }
	}
    };
    
    $scope.setRejectBtn = function(index){
	if ($scope.incomingRequests[index].status==3){
	    return "btn-danger";
	}else{
	    return "btn-default";
	}
    };
    
    $scope.setApproveBtn = function(index){	
	if ($scope.incomingRequests[index].status==2){
	    return "btn-success";
	}else{
	    return "btn-default";
	}
    };
    
    $scope.approveRequest = function(index){
	$scope.incomingRequests[index].status=2;
    };
    
    $scope.rejectRequest = function(index){
	$scope.incomingRequests[index].status=3;
    };
    
    $scope.open = function(index){
	$scope.incomingRequests[index].opened=true;
    };

    function validateResponse(index){
	var simpleDate = moment($scope.incomingRequests[index].reviewedOn).format("YYYY-MM-DD");

	var response = {'isValid':1,'request':$scope.incomingRequests[index],'simpleDate':simpleDate};

	if($scope.incomingRequests[index].reviewer==null){
	    response.isValid=0;
	    response.errorMsg = "Must pick a reviewer";
	}
	
	if($scope.incomingRequests[index].status==1){
	    response.isValid=0;
	    response.errorMsg = "Must approve or reject ";
	}

	return response;
    };
    
    $scope.saveBtnClass = function(index){
	var response = validateResponse(index);
	if (response.isValid){
	    return "btn-primary";
	}else{
	    return "btn-default";
	}
    }
    
    var reimbUrl = "/api/rest/reimbursementRequests/"+$scope.orgId+"/"+$scope.selectedYear+"/"+$scope.canvId;
    $http.get(reimbUrl).then(function(data){
	sortRequests(data.data);
	$scope.showSpinner=false;
	$scope.gridOptions.data=$scope.reimbursementsHistory;
	//possibly need to refresh.
    });
    
    $scope.saveRequestResponse = function(index){
	var response = validateResponse(index);
	if (response.isValid){
	    $http.post('/api/rest/reimbursementResponses/'+response.request.id,JSON.stringify(response)).then(function(data){
		sortRequests([data.data]);
		$scope.incomingRequests.splice(index,1);
	    });
	}
    };
    
    $scope.gridOptions={
	showColumnFooter:true,
	enableGridMenu: true,
	exporterCsvFilename: 'reimbursements.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	columnDefs:[{field:'worker',
		     name:'Worker',
		     width:'14%'},
		    {field:"date",
		     name:'Date',
		     width:'11%' },
		    {field:'payee',
		     name:'Payee',
		     width:'10%'},
		    {field:'purpose',
		     name:'Purpose',
		     width:'14%'},
		    {field:'amount',
		     cellFilter:'currency',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     name:'Amount',
		     width:'10%'},
		    {field:'requestedBy',
		     name:'Requested By',
		     width:'12%'},
		    {field:'requestedOn',
		     name:'Request Date',
		     width:'12%'},
		    {field:'reviewer',
		     name:'Reviewer',
		     width:'12%'},
		    {field:'reviewedOn',
		     name:'Review Date',
		     width:'12%'},
		    {field:'responder',
		     name:"Responder",
		     width:'11%'},
		    {field:'status',
		     name:"Status",
		     width:"9%"}
		   ],
	onRegisterApi: function(gridApi){  // this is for exposing api to other controllers...
	    $scope.gridApi = gridApi; //Don't use it...
	}
    };
    
    $log.log("Hello from Bookkeeper Reimbursements controller");
}]);
