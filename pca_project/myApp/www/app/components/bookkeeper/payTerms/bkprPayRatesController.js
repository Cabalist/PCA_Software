myApp.controller('BkprPayratesController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",2);

    $scope.canvassing = [] ; // [ rate, startDate ]
    $scope.admin = [] ;
    $scope.travel = [] ;
    $scope.special = [] ;

    $http.get('/api/rest/payRates/' + $scope.orgId).then(function(data){
	for(var i = 0; i < data.data.length; i++){
	    var rate = data.data[i];
	    //maybe check that date is not in the future...?
	    
	    if(rate.hoursType == 1){
		$scope.canvassing = [rate.rate, moment(rate.startDate).toDate() ]; 
	    }
	    if (rate.hoursType==2){		
		$scope.admin  = [rate.rate, moment(rate.startDate).toDate() ] ;
	    }
	    if (rate.hoursType==3){
		$scope.travel = [rate.rate, moment(rate.startDate).toDate() ]; 
	    }
	    if (rate.hoursType==4){
		$scope.special = [rate.rate, moment(rate.startDate).toDate() ];
	    }
	}

    });


    //
    $scope.canvassingChange = function(){
	$scope.canvassing[1] = new Date();
	$scope.canvassingChanged = true ;
    }

    $scope.adminChange = function(){
	$scope.admin[1] = new Date();
	$scope.adminChanged = true ;
    }
    
    $scope.travelChange = function(){
	$scope.travel[1] = new Date();
	$scope.travelChanged = true ;
    }

    $scope.specialChange = function(){
	$scope.special[1] = new Date();
	$scope.specialChanged = true ;
    }
    
    $scope.saveNewRate = function(hType){
	var rate = 0.0 ;
	var date = null;
	if(hType==1){
	    rate = $scope.canvassing[0];
	    date = $scope.canvassing[1];
	}
	if(hType==2){
	    rate = $scope.admin[0];
	    date = $scope.admin[1];
	}
	if(hType==3){
	    rate = $scope.travel[0];
	    date = $scope.travel[1];
	}
	if(hType==4){
	    rate = $scope.special[0];
	    date = $scope.special[1];
	}
	
	var data= {"hoursType":hType,
		   "rate": rate,
		   "startDate": moment(date).format('YYYY-MM-DD')};
	
	$http.post('/api/rest/payRates/' + $scope.orgId,JSON.stringify(data)).then(function(data){
	    if(hType==1){
		$scope.canvassingChanged = false;
	    }
	    
	    if(hType==2){
		$scope.adminChanged = false;
	    }

	    if(hType==3){
		$scope.travelChanged = false;
	    }
	    
	    if(hType==4){
		$scope.specialChanged = false;
	    }
	});
	
    };
    
    $scope.popup1 = {
	opened: false
    };

    $scope.open1 = function() {
	$scope.popup1.opened = true;
    }

    $scope.popup2 = {
	opened: false
    };

    $scope.open2 = function() {
	$scope.popup2.opened = true;
    }

    $scope.popup3 = {
	opened: false
    };

    $scope.open3 = function() {
	$scope.popup3.opened = true;
    }

    $scope.popup4 = {
	opened: false
    };

    $scope.open4 = function() {
	$scope.popup4.opened = true;
    }
    
    $log.log("Hello from Bookkeeper Payterms  controller");
}]);
