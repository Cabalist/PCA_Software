myApp.controller('ytdController', ['$scope','$http','$log','uiGridConstants', function($scope,$http,$log,uiGridConstants) {
    $scope.$emit("selectReport",1);
    $scope.rawData = [];
    $scope.myData = [];   

    $scope.gridOptions={
	showColumnFooter:true,
	data: $scope.myData,
	columnDefs:[{field:'canvasser', width:'20%'},
		    {name:"Donor",field:'donor',aggregationType: uiGridConstants.aggregationTypes.count ,width:'20%'},
		    {name:"Date", field:'date', width:'15%' },
		    {name:"$", field:'value',aggregationType: uiGridConstants.aggregationTypes.sum ,width:'12%' },
		    {name:'Cnvsr. %', field:"canvasserPrcnt", width:'12%' },
		    {name:'Cnvsr. Take',field:"canvasserTake",aggregationType: uiGridConstants.aggregationTypes.sum, width:'10%' },
		    {name:'Org Take', field:"orgTake",aggregationType: uiGridConstants.aggregationTypes.sum ,width:'10%' } ],
	onRegisterApi: function(gridApi){  // this is for exposing api to other controllers...
	    $scope.gridApi = gridApi; //Don't use it...
	}
    };
    
    function addYTDDataToGrid(donations){
	for(var i = 0;i<donations.length;i++){
	    var d = donations[i];
	    var dRow = {}
	    dRow["canvasser"] = d.user.first_name+" "+d.user.last_name;
	    dRow["donor"] =d.donor.name;
	    dRow["date"] = d.formDate;
	    dRow["value"]=d.value;

	    if (d.payTerms != null){
		dRow["canvasserPrcnt"] = d.payTerms.percent;
	    }else{
		dRow["canvasserPrcnt"] = 0;
	    }

	    if (d.payTerms!=null){
		dRow["canvasserTake"] = (d.value * (d.payTerms.percent/100)).toFixed(2);
	    }else{
		dRow["canvasserTake"] = 0;
	    }

	    if (d.payTerms!=null){
		dRow["orgTake"] = (d.value - (d.value * (d.payTerms.percent/100)).toFixed(2)).toFixed(2);
				              
	    }else{
		dRow["orgTake"] = d.value;
	    }

	    $scope.myData.push(dRow);
	}
    };
    
    $http.get('/api/rest/orgYTDDonations/' + $scope.orgId+'/'+moment().year()).then(function(data){
	$scope.rawData = data.data;
	addYTDDataToGrid(data.data);
    });

}]);
