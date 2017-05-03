myApp.controller('BkprAdjustmentsController', ['$scope','$http','$log','$stateParams','uiGridConstants', function($scope,$http,$log,$stateParams,uiGridConstants) {
    $scope.$emit("selectForm",3);

    $scope.canvId = $stateParams.canvId;
    $scope.canvassers = [];
    
    var y = moment().format("YYYY");
    $scope.yearOptions = [y,y-1,y-2,y-3];
    $scope.selectedYear = $stateParams.year;

    $scope.rawAdjData = null;
    $scope.unproccessedCCs = [];
    
    $scope.recurringCCs = [];
    $scope.unproccessedCKs = [];

    $scope.proccessedDonations = [];

    $scope.fee = { value:1};
    
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

    function addUnproccessedCC(donation){
	var x = donation;
	x.adjustments.push({'status':null});
	$scope.unproccessedCCs.push(x);
    }

    function addUnproccessedCK(donation){
	var x = donation;
	x.adjustments.push({'status':null});
	$scope.unproccessedCKs.push(x);
    }

    function addProccessed(donation){
	var temp = donation;
	if (donation.donationType==3){
	    temp.donationType='Check';
	}else if (donation.donationType==2){
	    temp.donationType='CC';
	}

	if (donation.adjustments[0].status==1){
	    temp.adjustments[0].status="Approved";
	} else {
	    temp.adjustments[0].status="Declined";
	}

	if (temp.adjustments[0].fee==null) {
	    temp.adjustments[0].fee = parseFloat(0.00).toFixed(2);
	} else{
	    temp.adjustments[0].fee = parseFloat(donation.adjustments[0].fee).toFixed(2);
	}

	$scope.proccessedDonations.push(temp);
    }
    
    function sortRawAdjs(){
	for(var i=0;i<$scope.rawAdjData.length;i++){
	    var donation = $scope.rawAdjData[i];
	    if (donation.donationType==2){
		//check recurring

		//else 
		if (donation.adjustments.length==0){
		    addUnproccessedCC(donation);
		}else{
		    addProccessed(donation);
		}
	    } else if (donation.donationType==3){
		if (donation.adjustments.length==0){
		    addUnproccessedCK(donation);
		}else{
		    addProccessed(donation);	    
		}
	    }
	}
    }

    //get all credit card and check transactions for the year
    $http.get('/api/rest/orgAdjustments/' + $scope.orgId+"/"+ $scope.selectedYear).then(function(data){
	$scope.rawAdjData = data.data;
	
	sortRawAdjs();
	$scope.gridOptions.data = $scope.proccessedDonations;
    });

    $scope.saveCCAdjustment = function(index){
	var donation = $scope.unproccessedCCs[index];
	var fee= $scope.fee.value;

	//fee applies only when transaction aceepted
	if (donation.adjustments.status==0){
	    fee=null;
	}
	
	var data = {'donationId': donation.id,
		    'status': donation.adjustments.status,
		    'fee': fee};
	
	$http.post('/api/rest/orgAdjustments/',JSON.stringify(data)).then(function(data){
	    //addAdjustments([data.data]);
	    $scope.unproccessedCCs.splice(index,1);
	});
		
    }

    $scope.saveCKAdjustment = function(index){
	var donation = $scope.unproccessedCKs[index];
	
	var fee = $scope.fee.value;
	//fee applies only when transaction aceepted
	if (donation.adjustments.status==0){
	    fee=null;
	}
	
	var data = {'donationId': donation.id,
		    'status': donation.adjustments.status,
		    'fee': fee};
	
	$http.post('/api/rest/orgAdjustments/',JSON.stringify(data)).then(function(data){
	    $scope.unproccessedCKs.splice(index,1);
	});
    }
    
    $scope.gridOptions={
	showColumnFooter:true,
	enableGridMenu: true,
	exporterCsvFilename: 'ytdData.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	columnDefs:[{name:"Name",
		     field:'user.username',
		     aggregationType: uiGridConstants.aggregationTypes.count ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >Count: {{col.getAggregationValue()}}</div>',
		     width:'17%'},
		    {name:"Donor", field:'donor.name', width:'17%'},
		    {name:"Date", field:'formDate', width:'16%' },
		    {name:"Value",cellFilter:'currency', field:'value',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'14%' },
		    {name:"Type", field:"donationType",width:'12%'},
		    {name:"Status",field:"adjustments[0].status",width:'14%'},
		    {name:"Fee",field:"adjustments[0].fee",
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'8%'},
		   ],
	onRegisterApi: function(gridApi){  // this is for exposing api to other controllers...
	    $scope.gridApi = gridApi; //Don't use it...
	}
    }    
    
    $log.log("Hello from Bookkeeper Adjustmentss  controller");
}]);
