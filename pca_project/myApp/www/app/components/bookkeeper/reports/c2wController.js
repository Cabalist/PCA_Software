myApp.controller('c2wIndexController', ['$scope','$http','$log','$state',function($scope,$http,$log,$state) {
    $scope.$emit("selectReport",2);

    //This controller should figure out latest week and change to that state.
    //current week
    var now = moment();
    var curWeek = now.week();

    var cur = null;
    var start = null;
    
    //if odd, get start of previous week.
    if (curWeek%2!=0){
	cur = (curWeek-1)/2;
    }else {
	cur = curWeek/2;
    }

    $state.go("bookkeeper.reports.c2w",{ 'year': now.format("YYYY"), 'period':cur, 'canvId':0 });
    
}]);


myApp.controller('c2wController', ['$scope','$http','$log','$state','$stateParams','uiGridConstants','$timeout',function($scope,$http,$log,$state,$stateParams,uiGridConstants,$timeout) {
    //probably need to emit something to set year and period in parent scope...
    $scope.year = $stateParams.year;
    $scope.period = $stateParams.period;
    $scope.canvId = $stateParams.canvId;

    $scope.gridData = [];
    $scope.hoursGridData = [] ;
    
    //figure out start of period...    
    $scope.startOfPeriod = moment($scope.year+"-01-01").add($scope.period*14-1,'days').startOf('week');
    $scope.startOfPeriodStr = $scope.startOfPeriod.format("MMMM Do, YYYY");

    $scope.endOfPeriod = $scope.startOfPeriod.clone().add(14,'days').startOf('week');
    $scope.endOfPeriodStr = $scope.endOfPeriod.format("MMMM Do, YYYY");

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

    $scope.changeCnvsr = function(cnvsrId){
	$scope.canvId=cnvsrId;
	$state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period, 'canvId':cnvsrId });	
    }
    
    $scope.showNext = function(){
	var now = moment();
	if ($scope.endOfPeriod > now){
	    return false;
	    
	}else{
	    return true;
	}
    };
    
    $scope.goToPrev = function(){
	if ($scope.period > 1){
	    $scope.period--;
	    
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period, 'canvId':$scope.cavnId });
	}else{
	    $scope.year--;
	    $scope.period = 26;
	    
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period, 'canvId':$scope.canvId });
	}
    };

    $scope.goToNext = function(){
	if ($scope.endOfPeriod.format("YYYY") > $scope.startOfPeriod.format("YYYY")){
	    $scope.period = 1 ;
	    $scope.year++;
	
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period, 'canvId':$scope.canvId });
	}else{
	    $scope.period++;
	
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period, 'canvId':$scope.canvId });
	}
    };

    $scope.gridOptions={
	showColumnFooter:true,
	enableGridMenu: true,
	exporterCsvFilename: 'C2W-'+$scope.year+'-'+$scope.period+'-Data.csv',
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


    $scope.hoursGridOptions={
	showColumnFooter:true,
	enableGridMenu: true,
	exporterCsvFilename: 'C2WHours-'+$scope.year+'-'+$scope.period+'-Data.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	columnDefs:[{name:'Date',
		     field:'date',
		     width:'20%'},
		    {name:"Hours",
		     field:'canvassingHours',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() }} Hours</div>',
		     width:'12%'},
		    {name:"Admin",
		     field:'adminHours',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() }} Hours</div>',
		     width:'11%' },
		    {name:"Travel",
		     field:'travelHours',
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() }} Hours</div>',
		     width:'12%' },
		    {name:"Donations",
		     field:"donations",
		     width:'10%'},
		    {name:'Value',
		     cellFilter:'currency',
		     field:'value',	    
		     aggregationType: uiGridConstants.aggregationTypes.sum ,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'12%' },
		    {name:'Cnvsr Take',
		     cellFilter:'currency',
		     field:"canvasserTake",
		     aggregationType: uiGridConstants.aggregationTypes.sum,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'12%' },
		    {name:'Org Take',
		     cellFilter:'currency',
		     field:"orgTake",
		     aggregationType: uiGridConstants.aggregationTypes.sum,
		     footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
		     width:'11%'}
		   ],
	onRegisterApi: function(gridApi){  // this is for exposing api to other controllers...
	    $scope.hoursGridApi = gridApi; //Don't use it...
	}
    };
    
    function addDataToGrid(){
	for(var i =0;i<$scope.rawData.length; i++){
	    var d = $scope.rawData[i];
	    if ($scope.canvId==0 || $scope.canvId==d.user.pk){
		
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
		
		
		$scope.gridData.push(dRow);
	    }
	}	
    }

    function getHoursOnDate(date){
	//Input: date
	//Output: {admin:<float>,travel:<float>, canvassing:<float>}

	var canvassing = 0;
	var admin = 0;
	var travel = 0;
	
	for(var i=0;i<$scope.rawHours.length;i++){
	    var hoursDate = moment($scope.rawHours[i].date).format("YYYY-MM-DD");
	    if(hoursDate == date.format("YYYY-MM-DD")){
		if ($scope.rawHours[i].hoursType==1){
		    canvassing += $scope.rawHours[i].hours;
		}else if ($scope.rawHours[i].hoursType==2){
		    admin += $scope.rawHours[i].hours;
		}else if ($scope.rawHours[i].hoursType==3){
		    travel += $scope.rawHours[i].hours;
		}
	    }
	}

	return {'admin':admin,'travel':travel,'canvassing':canvassing};
    }

    function getDonationsOnDate(date){
	var donations = 0;
	var value = 0;
	var canvTake = 0;
	var orgTake = 0;

	for(var i= 0; i< $scope.gridData.length;i++){
	    var donationDate = moment($scope.gridData[i].date).format("YYYY-MM-DD");
	    	    
	    if (donationDate == date.format("YYYY-MM-DD")){
		donations+=1;
		value += parseFloat($scope.gridData[i].value);
		canvTake += parseFloat($scope.gridData[i].canvasserTake);
		orgTake += parseFloat($scope.gridData[i].orgTake);
	    }

	}

	return {'donations':donations,'value':value,'canvTake':canvTake,'orgTake':orgTake};
    }
    
    function addDataToHoursGrid(){
	for(var i =0;i<14; i++){
	    var date = $scope.startOfPeriod.clone().add(i,'days');

	    var hours = getHoursOnDate(date);

	    var donations = getDonationsOnDate(date);

	    if (hours.canvassing || hours.admin || hours.travel || donations.donations){
		var hRow = {'date': date.format("YYYY-MM-DD"),
			    'canvassingHours':hours.canvassing,
			    'adminHours':hours.admin,
			    'travelHours':hours.travel,
			    'donations': donations.donations,
			    'value' : donations.value,
			    'canvasserTake':donations.canvTake,
			    'orgTake':donations.orgTake};
		
		$scope.hoursGridData.push(hRow);
	    }
	    
	}
    }
    
    $scope.loadData = function(){
	$scope.gridData = [];
	$scope.hoursGridData = [];

	$http.get('/api/rest/c2wReport/'+$scope.orgId+'/'+$scope.startOfPeriod.format("YYYY-MM-DD")+"/"+$scope.endOfPeriod.format("YYYY-MM-DD")).then(function(data){
	    $scope.rawData= data.data.donations;
	    $scope.rawHours = data.data.hours;
	    
	    addDataToGrid();
	    addDataToHoursGrid();
	    
	    //refresh grid
	    $scope.gridOptions.data = $scope.gridData;
	    if(typeof($scope.gridApi)!='undefined'){
		$scope.gridApi.core.refresh();
	    }	    

	    $scope.hoursGridOptions.data = $scope.hoursGridData;

	    hoursRefresh();
	});
    }


    var hoursRefresh = function() {
	$scope.refresh = true;
	$timeout(function() {
	    if(typeof($scope.hoursGridApi)!='undefined'){
		$scope.hoursGridApi.core.refresh();
	    }	    
	    
	    $scope.refresh = false;
	}, 0);
    };
    
    $scope.loadData();
    
    $log.log("Hello from c2wController");
}]);
