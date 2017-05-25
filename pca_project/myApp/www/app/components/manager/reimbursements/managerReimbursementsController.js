myApp.controller('ManagerReimbursementsController', ['$scope','$http','$log','$stateParams','$state','uiGridConstants', function($scope,$http,$log,$stateParams,$state,uiGridConstants) {
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
    $scope.purpose = null;
    $scope.amount = 0.0;

    $scope.showSpinner = true;
    $scope.reimbursementsHistory = [];
    
    function selectWorker(){
	for(var i=0; i<$scope.workers.length; i++){
	    if($scope.canvId==$scope.workers[i].userInfo.pk){
		$scope.selectedWorker=$scope.workers[i];
	    }
	}
    }

    //init spinner
    var target = document.getElementById('spinner')
    var spinner = new Spinner().spin(target);

    
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

    function sortRequests(data){
	//There is no sorting... all requests are history...
	for(var i =0;i<data.length;i++){
	    var row = {};
	    
	    row.worker = data[i].worker.first_name +' '+ data[i].worker.last_name;
	    row.date = data[i].date;
	    row.payee= data[i].payee;
	    row.amount =data[i].amount;
	    row.requestedBy = data[i].requester.first_name + ' ' + data[i].requester.last_name;

	    row.requestedOn = moment(data[i].requestedOn).format("YYYY-MM-DD");
	    
	    
	    if (data[i].response==null){		
		row.reviewer="";
		row.reviewedOn="";
		row.responder ="";
		row.respondedOn ="";
		row.status="pending";		
	    }else{		
		row.reviewer = data[i].response.reviewer.first_name+' '+data[i].response.reviewer.last_name;
		row.reviewedOn = data[i].response.reviewedOn;
		row.responder = data[i].response.responder.first_name+' '+data[i].response.responder.last_name;
		row.respondedOn = moment(data[i].response.respondedOn).format("YYYY-MM-DD");
		if (data[i].response.status==2){
		    row.status="approved";
		}else if (data[i].response.status==3){
		    row.status="rejected";
		}
	    }
	    
	    $scope.reimbursementsHistory.push(row);
	}
    };
    
    //Get reimbursement History
    var reimbUrl = "/api/rest/reimbursementRequests/"+$scope.orgId+"/"+$scope.selectedYear+"/"+$scope.canvId;
    $http.get(reimbUrl).then(function(data){
	sortRequests(data.data);
	$scope.showSpinner=false;
	$scope.gridOptions.data=$scope.reimbursementsHistory;
    });
        

    function validateForm(){
	var form = {'status':1};
	
	if ($scope.canvId!=0){
	    form.worker = $scope.canvId;
	}else{
	    form.status = 0;
	    form.errorMsg = "Must select worker.";
	}

	//TODO..validate date
	form.date=moment($scope.dt).format("YYYY-MM-DD");

	form.type = $scope.selectedType.id;
	
	if ($scope.payee != null){
	    form.payee = $scope.payee;
	}else{
	    form.status = 0;
	    form.errorMsg = "Must specify Contributor/Payee.";
	}

	if ($scope.purpose !=null){
	    form.purpose = $scope.purpose;
	}else{
	    form.status=0;
	    form.erroMsg = "Must specify purpose";
	}
	
	if ($scope.amount>0){
	    form.amount=$scope.amount;
	    if ($scope.amount>9999){
		form.status = 0;
		form.errorMsg = "Amount can not be over $9999.";
	    }
	}else {
	    form.status = 0;
	    form.errorMsg = "Amount must be greater than 0";
	}
	return form;
    };
    
    $scope.addRequest = function(){
	var form = validateForm();
	if (form.status){
	    var url = "/api/rest/reimbursementRequests/"+$scope.orgId+"/"+$scope.selectedYear+"/"+$scope.canvId;
	    
	    $http.post(url,JSON.stringify(form)).then(function(data){
		sortRequests([data.data]);
		
		//refresh grid data
		if(typeof($scope.gridApi)!='undefined'){
		    $scope.gridApi.core.refresh();
		}

		//unset all the items
		$scope.payee = null;
		$scope.purpose = null;
		$scope.amount = 0.0;
		
	    });
	}else{
	    //set message here...
	    $scope.errorMsg = form.errorMsg;
	}
    };

    //Why not do ui-sref in http?
    $scope.workerChange = function(userId){
	$state.go("manager.reimbursements",{'canvId':String(userId),'year':String($scope.selectedYear)});
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
		     width:'10%' },
		    {field:'payee',
		     name:'Payee',
		     width:'10%'},
		    {field:'amount',
		     cellFilter:'currency',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     name:'Amount',
		     width:'10%'},
		    {field:'requestedBy',
		     name:'Requested By',
		     width:'11%'},
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
		     width:'10%'},
		    {field:'status',
		     name:"Status",
		     width:"8%"}
		   ],
	onRegisterApi: function(gridApi){  // this is for exposing api to other controllers...
	    $scope.gridApi = gridApi; //Don't use it...
	}
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
