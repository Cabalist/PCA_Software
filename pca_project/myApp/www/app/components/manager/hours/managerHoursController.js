myApp.controller('ManagerHoursController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",2);

    $scope.dt = new Date();
    $scope.workers = [];
    $scope.selectedWorker=null;
    $scope.hoursType="1";
    $scope.hours=4;
    $scope.history = [];
    //init status for each item in history...
    $scope.histStatus = {'isOpen':[]};
    $scope.initHist = function(){

	for (var i =0;i< $scope.history.length;i++){
	    $scope.histStatus[i]=false;
	};
	if ($scope.history.length){
	    $scope.histStatus.isOpen[0]=true;
	}
    };

    //date stuff
    $scope.today = function() {
	$scope.dt = new Date();
    };
    $scope.today();
    $scope.popup1 = {
	opened: false
    };

    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };

    //Get org workers list.
    $http.get('/api/rest/orgWorkers/' + $scope.orgId).then(function(data){
	$scope.workers = data.data;
    });

    function validateHours(){
	var date = moment($scope.dt).format('YYYY-MM-DD');
	var hoursNum = $scope.hours + parseFloat("0."+document.getElementById("minutes").value);
	//$log.log(hoursNum);
	var hours = {'userId':$scope.selectedWorker.userInfo.pk,'date':date,'type': $scope.hoursType, 'orgId':$scope.orgId,'hours':$scope.hours,'addedBy':$scope.userId};


	//check if hours is integer
	var reg = new RegExp(/^\d+$/);

	if (!reg.test($scope.hours)){
	    return {'status':0,'errorMsg':'Hours must be an integer'};
	}

	//check if minutes is valid..
	var min = document.getElementById("minutes").value;
	if (["0","25","50","75"].includes(min)){
	    var h = parseInt($scope.hours) + parseFloat("0."+min);
	    hours['hours'] = h ;
	} else {
	    return {'status':0,'errorMsg':"Couldn't prase minutes"};
	}

	return {'status':1,'hours':hours};
    };

    $scope.addHours = function(){
	var validatedHours = validateHours();
	if (validatedHours.status){
	    $http.post("/api/rest/hours/"+$scope.selectedWorker.userInfo.pk+"/"+$scope.orgId,JSON.stringify(validatedHours.hours)).then(function(data){
		addHours([data.data]);
		$scope.errorMsg = null;
	    });
	}else{
	    //set message here...
	    $scope.errorMsg = validatedHours.errorMsg;
	}
    }

    function getDateIndex(date){
	for(var i=0;i<$scope.history.length;i++){
	    if($scope.history[i].date==date){
		return i;
	    }
	}

	return -1;
    };

    //NAMING IS CONFUSING
    //$scope.addHours adds hours by POST request
    //This addHours process data and adss it to $scope.history
    function addHours(hoursLi){
	//Adds a list of donations to $schope.history
	for (var i=0;i<hoursLi.length;i++){
	    var day = hoursLi[i]
	    var dateIndex = getDateIndex(day.date);
	    if (dateIndex==-1){ //if date doesn't exist in hist, create it.
		$scope.history.push({'date':day.date,'hours':[day]});
	    }else{ //if date exists, need to append to donations for that day.
		$scope.history[dateIndex].hours.push(day);
	    }
	}
    }

    $scope.workerChange = function(userId){
	//get user donation history for past 30 days
	$http.get('/api/rest/hours/' + userId+'/'+$scope.orgId).then(function(data){
	    $scope.history=[];
	    addHours(data.data);//Add hours to history format...
	});
    };

    $scope.dayTotal = function(index){
	var day = $scope.history[index];
	var sum = 0;
	for(var i = 0;i<day.hours.length;i++){
	    sum += day.hours[i].hours;
	}
	return sum;

    };

    $scope.hoursTypeStr = function(type){
	if (type=='1'){
	    return "Canvassing";
	}else if (type=='2'){
	    return "Admin";
	}else if (type=='3'){
	    return "Travel";
	}
    };

}]);
