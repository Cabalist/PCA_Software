myApp.controller('ytdController', ['$scope','$http','$log','uiGridConstants', function($scope,$http,$log,uiGridConstants) {
    $scope.$emit("selectReport",1);
    $scope.rawData = [];
    $scope.myData = [];

    $scope.labels = [];
    $scope.chartData = [];
    $scope.chartOptions = {legend:{display:true }};

    $scope.sharesData =[];
    $scope.sharesSumTotal = 0;
    
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

    function parsePayTermsData(){
	if($scope.sharesData.length>1){
	    $scope.chartData.push($scope.sharesData[0].shareVal); // Add org share, always stored in 1st index.
	    $scope.labels.push($scope.orgName);

	    $scope.sharesSumTotal+= $scope.sharesData[0].shareVal ;
	    
	    for(var i=1;i<$scope.sharesData.length;i++){
		$scope.chartData.push($scope.sharesData[i].shareVal);
		$scope.labels.push($scope.sharesData[i].user.username);
		$scope.sharesSumTotal+= $scope.sharesData[i].shareVal ;
	    }	    
	}
    }
    
    function addUserShares(user,userShare,orgShare){
	var found = false;
	for (var i =0;i<$scope.sharesData.length;i++){
	    if ($scope.sharesData[i].user.pk == user.pk){
		$scope.sharesData[i].shareVal+=parseFloat(userShare);

		//add orgShare
		$scope.sharesData[0].shareVal+=parseFloat(orgShare);
		
		found=true;
	    }
	}

	if(!found){
	    if(!$scope.sharesData.length){ //need to add initial share for org
		$scope.sharesData.push({user:$scope.orgName,shareVal:parseFloat(orgShare)});;
	    }
	    
	    $scope.sharesData.push({user:user,shareVal:parseFloat(userShare)})
	}
    }
    
    function addYTDDataToGrid(donations){
	for(var i = 0;i<donations.length;i++){
	    var d = donations[i];
	    var dRow = {}
	    dRow["canvasser"] = d.user.first_name+" "+d.user.last_name;
	    dRow["donor"] =d.donor.name;
	    dRow["date"] = d.formDate;
	    dRow["value"]=d.value;

	    dRow["canvasserPrcnt"]=0;
	    dRow["canvasserTake"]=0;
	    dRow["orgTake"]=0;
	    
	    if (d.payTerms != null){
		dRow["canvasserPrcnt"] = d.payTerms.percent;
	    }
	    

	    if (d.payTerms!=null){
		dRow["canvasserTake"] = (d.value * (d.payTerms.percent/100)).toFixed(2);
	    }
	    

	    if (d.payTerms!=null){
		dRow["orgTake"] = (d.value - (d.value * (d.payTerms.percent/100)).toFixed(2)).toFixed(2);
				              
	    }else{
		dRow["orgTake"] = d.value;
	    }

	    $scope.myData.push(dRow);
	    addUserShares(d.user,dRow["canvasserTake"],dRow["orgTake"]);
	}

    };
    
    $http.get('/api/rest/orgYTDDonations/' + $scope.orgId+'/'+moment().year()).then(function(data){
	$scope.rawData = data.data;
	addYTDDataToGrid(data.data);
	parsePayTermsData();
    });

    $scope.getShareHolderName = function(index){
	if (index==0){
	    return $scope.sharesData[0].user;
	}else{
	    return $scope.sharesData[index].user.username;
	}
    };

    $scope.getSharePercent = function(index){
	var x = $scope.sharesData[index].shareVal;
	return ((x /$scope.sharesSumTotal)*100).toFixed(2);
	
    };
}]);
