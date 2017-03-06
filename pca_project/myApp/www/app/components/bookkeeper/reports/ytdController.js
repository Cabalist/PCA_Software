// This filter Simply formats the inputs as decimal ands adds %.
myApp.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
	return $filter('number')(input, decimals) + '%';
    };
}]);

myApp.controller('ytdController', ['$scope','$http','$log','uiGridConstants', function($scope,$http,$log,uiGridConstants) {
    $scope.$emit("selectReport",1);
    $scope.rawData = [];
    $scope.myData = [];

    $scope.labels = [];
    $scope.chartData = [];
    $scope.chartOptions = {legend:{display:true }};

    $scope.sharesData =[];
    $scope.sharesSumTotal = 0;

    var y = moment().format("YYYY");
    $scope.yearOptions = [y,y-1,y-2,y-3];
    $scope.selectedYear = $scope.yearOptions[0];
    $scope.showSpinner=true;
    
    $scope.gridOptions={
	showColumnFooter:true,
	enableGridMenu: true,
	exporterCsvFilename: 'ytdData.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	columnDefs:[{field:'canvasser',
		     aggregationType: uiGridConstants.aggregationTypes.count ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >Count: {{col.getAggregationValue()}}</div>',
		     width:'18%'},
		    {name:"Donor",
		     field:'donor',
		     width:'15%'},
		    {name:"Date", field:'date', width:'11%' },
		    {name:"Value",
		     cellFilter:'currency',
		     field:'value',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'10%' },
		    {name:"Type", field:"type",width:'10%'},
		    {name:'Cnvsr. %', cellFilter:'percentage',field:"canvasserPrcnt", width:'10%' },
		    {name:'Cnvsr. Take',
		     cellFilter:'currency',
		     field:"canvasserTake",
		     aggregationType: uiGridConstants.aggregationTypes.sum,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'10%' },
		    {name:'Org Take',
		     cellFilter:'currency',
		     field:"orgTake",
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'10%' }
		   ],
	onRegisterApi: function(gridApi){  // this is for exposing api to other controllers...
	    $scope.gridApi = gridApi; //Don't use it...
	}
    };

    //init spinner
    var target = document.getElementById('spinner')
    var spinner = new Spinner().spin(target);

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

	    if (d.donationType==1){
		dRow["type"] = "Cash";
	    } 
	    else if (d.donationType==2){
		dRow["type"] = "CC";
	    }else if (d.donationType==3){
		dRow["type"] = "Check";
	    }		

	    
	    $scope.myData.push(dRow);
	    addUserShares(d.user,dRow["canvasserTake"],dRow["orgTake"]);

	    $scope.showSpinner=false;
	}

    };
    
    $scope.loadYear = function(year){
	$scope.gridOptions.data=[];
	$scope.rawData = [];
	$scope.myData = [];
	$scope.labels = [];
	$scope.chartData = [];
	$scope.sharesData =[];
	$scope.sharesSumTotal = 0;
	
	$http.get('/api/rest/orgYTDDonations/' + $scope.orgId+'/'+year).then(function(data){
	    $scope.rawData = data.data;
	    addYTDDataToGrid(data.data);

	    $scope.gridOptions.data = $scope.myData;
	    //refresh grid data
	    if(typeof($scope.gridApi)!='undefined'){
		
		$scope.gridApi.core.refresh();
	    }
	
	    parsePayTermsData();
	});
    }

    $scope.loadYear($scope.selectedYear);
    
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
