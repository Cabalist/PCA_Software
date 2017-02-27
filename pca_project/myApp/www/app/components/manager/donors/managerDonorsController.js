myApp.controller('ManagerDonorsController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",1);
    $scope.dt = new Date();
    $scope.checkDt = new Date();
    $scope.donorName=null;
    $scope.donorAddr=null;
    $scope.donorCity=null;
    $scope.donorState=null;
    $scope.donorZip=null;
    $scope.donorEmail=null;
    $scope.donorPhone=null;
    $scope.donationType=1;
    $scope.nameOnCard=null;
    $scope.cardLast4=null;
    $scope.cardExp=null;
    $scope.cardRecurring=0;
    $scope.checkNum=null;
    $scope.selectedWorker = null;
    $scope.donorOver18 = "1";
    $scope.donationValue = 1.0 ;

    //history section
    $scope.history = [];

    $scope.oneAtAtime=true; //thid doesn't work?
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

    //datepicker things
    $scope.today = function() {
	$scope.dt = new Date();
	$scope.checkDt = new Date();
    };
    
    $scope.today();
    $scope.popup1 = {
	opened: false
    };

    $scope.popup2 = {
	opened: false
    };
    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };

    $scope.open2 = function() {
	$scope.popup2.opened = true;
    };

    //Get org workers list.
    $scope.workers = [];
    $http.get('/api/rest/orgWorkers/' + $scope.orgId).then(function(data){
	$scope.workers = data.data;
    });
    
    $scope.submitClick = function(){
	if($scope.dForm.$valid){
	    var donor = { 'user': $scope.selectedWorker.userInfo.pk,
			  'org': $scope.orgId,
			  'name': $scope.donorName,
			  'addr': $scope.donorAddr,
			  'city': $scope.donorCity,
			  'state': $scope.donorState,
			  'zip': $scope.donorZip,
			  'email': $scope.donorEmail,
			  'phone': $scope.donorPhone,
			  'over18': $scope.donorOver18};
	    
	    var donation = null;
	    if ($scope.donationType==1){ //cash donation
		donation = {'user': $scope.selectedWorker.userInfo.pk,
			    'org': $scope.orgId,
			    'donationType' : $scope.donationType,
			    'date': moment($scope.dt).format("YYYY MM DD"),
			    'value': $scope.donationValue
			   };
	    }else if ($scope.donationType==2){ //Credit Card
		donation = {'user': $scope.selectedWorker.userInfo.pk,
			    'org': $scope.orgId,
			    'donationType' : $scope.donationType,
			    'date': moment($scope.dt).format("YYYY MM DD"),
			    'value': $scope.donationValue,
			    //Credid Card specific
			    'nameOnCard': $scope.nameOnCard,
			    'cardLast4' : $scope.cardLast4,
			    'cardExp'   : $scope.cardExp,
			    'cardRecurring': $scope.cardRecurring,
			   };
		$log.log(donation);
		
	    }else if ($scope.donationType==3){ //check
		donation = {'user': $scope.selectedWorker.userInfo.pk,
			    'org': $scope.orgId,
			    'donationType' : $scope.donationType,
			    'date': moment($scope.dt).format("YYYY MM DD"),
			    'value': $scope.donationValue,
			    //Check specific
			    'checkNum':$scope.checkNum,
			    'checkDate':moment($scope.checDt).format("YYYY MM DD"),
			   };
	    }
	    
	    var data = {'donor':donor,'donation':donation};
	    $http.post('/api/rest/donation',JSON.stringify(data)).then(function(data){
		//Add new entry to history.
		addDonations([data.data]);
		
		//clear form
		$scope.donorName=null;
		$scope.donorAddr=null;
		$scope.donorCity=null;
		$scope.donorState=null;
		$scope.donorZip=null;
		$scope.donorEmail=null;
		$scope.donorPhone=null;
		$scope.donorOver18 = "1";
		$scope.donationValue = 1.0 ;
		//cc specific
		$scope.nameOnCard=null;
		$scope.cardLast4=null;
		$scope.cardExp=null;
		$scope.cardRecurring=0;
		//check specific
		$scope.checkNum=null;
		$scope.checkDt = new Date(); //Maybe refresh formDate as well?
	    });
	    
	}


	//set pristine
	$scope.dForm.value.$setPristine();
    };

    function getDateIndex(date){
	for(var i=0;i<$scope.history.length;i++){
	    if($scope.history[i].formDate==date){
		return i;
	    }
	}

	return -1;
    };

    function addDonations(donLi){
	//Adds a list of donations to $schope.history
	for (var i=0;i<donLi.length;i++){
	    var donation = donLi[i]
	    var dateIndex = getDateIndex(donation.formDate);
	    if (dateIndex==-1){ //if date doesn't exist in hist, create it.
		$scope.history.push({'formDate':donation.formDate,'donations':[donation]});
	    }else{ //if date exists, need to append to donations for that day.
		$scope.history[dateIndex].donations.push(donation);
	    }
	}
    }

    $scope.recruiterChange = function(userId){
	//get user donation history for past 30 days
	$http.get('/api/rest/donationHist/' + userId+'/'+$scope.orgId).then(function(data){
	    $scope.history=[];
	    var donations = data.data;
	    addDonations(donations);//Add donations to history format...
	});
    };

    $scope.donationTypeStr = function(type){
	if (type=='1'){
	    return "Cash";
	}else if (type=='2'){
	    return "Credit Card";
	}else if (type=='3'){
	    return "Check";
	}
    };

    $scope.dayTotal = function(dayIndx){
	var day = $scope.history[dayIndx];
	var sum = 0;
	for(var i = 0;i<day.donations.length;i++){
	    sum += day.donations[i].value;
	}
	return sum;
    };

}]);
