myApp.controller('BkprReimbursementsController', ['$scope','$http','$log','$stateParams','$state','uiGridConstants','$timeout', function($scope,$http,$log,$stateParams,$state,uiGridConstants,$timeout) {
    $scope.$emit("selectForm",4);

    $scope.canvId = $stateParams.canvId;

    $scope.selectedCnvsr=false;
    
    var y = moment().format("YYYY");
    $scope.yearOptions = [y,String(y-1),String(y-2),String(y-3)];
    $scope.selectedYear = $stateParams.year;

    $scope.incomingRequests = [];
    $scope.gridData = [];
    
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

    function sortRequests(data){
	//sort requests, appending them to either grid to show processed requests, or to incomig list if there is no resposne.
	for(var i =0;i<data.length;i++){
	    if (data[i].response==null){
		var temp = data[i];
		temp["reviewer"] = null;
		temp["requestedOn"] = moment(new Date(temp.requestedOn)).format("YYYY-MM-DD");
		temp["reviewedOn"] = new Date();
		temp["opened"] = false;
		temp["status"] = 1;

		$scope.incomingRequests.push(temp);
	    }else{
		$log.log("request with response found!");
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

    
    
    $log.log("Hello from Bookkeeper Reimbursements controller");
}]);
