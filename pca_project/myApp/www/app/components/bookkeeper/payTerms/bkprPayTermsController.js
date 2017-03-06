myApp.controller('BkprPaytermsController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",2);
    $scope.userTerms = [];
    $scope.editing = null;
    $scope.tempBaseRate = null;
    $scope.baseRateChanged=false;
    $scope.newTempRate = null;
    $scope.newcomerShare = null
    $scope.newcomerShareChanged = false;

    $scope.today = function() {
	$scope.dt = new Date();
	$scope.dt2 = new Date();
	$scope.dt2.setDate($scope.dt.getDate() + 7);

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

    $scope.startChanged = function(){
	$scope.dt2 = new Date()
	$scope.dt2.setDate($scope.dt.getDate()+7);
    };

    function getDateIndex(userId){
	for(var i=0;i<$scope.userTerms.length;i++){
	    if($scope.userTerms[i].userInfo.pk==userId){
		return i;
	    }
	}

	return -1;
    };

    function addToBase(term,usrIndex){
	//This function replaces base terms as needed.
	if ($scope.userTerms[usrIndex].terms.base.length==0){
	    $scope.userTerms[usrIndex].terms.base.push(term);
	}else{
	    if (term.id > $scope.userTerms[usrIndex].terms.base[0].id){ //replace if new item has higher id...
		$scope.userTerms[usrIndex].terms.base=[term];
	    }
	}

    }

    function addToTemp(term,usrIndex){
	//This function replaces temp terms as needed.

	//if THe date is in range...
	var today = moment().format("YYYY-MM-DD");
	
	if ((term.startDate <= today) && (today<term.endDate)){
	    //$log.log("OK, active...");
	    if ($scope.userTerms[usrIndex].terms.temp.length==0){
		$scope.userTerms[usrIndex].terms.temp.push(term);
	    }else{
		if (term.id > $scope.userTerms[usrIndex].terms.temp[0].id){ //replace if new item has higher id...
		    $scope.userTerms[usrIndex].terms.temp=[term];
		}
	    }
	}else{
	    //$log.log("NOT ACTIVE");
	}
	

    }

    function addTerms(termsLi){
	//Adds a list of user terms to $schope.userTerms
	for (var i=0;i<termsLi.length;i++){
	    var term = termsLi[i]
	    var usrIndex = getDateIndex(term.userInfo.pk);
	    if (usrIndex==-1){ //if user terms doesn't exist, create them.

		if (term.termsType==1){
		    $scope.userTerms.push({'userInfo':term.userInfo,'terms':{'base':[term],'temp':[]}  }  );
		}else if (term.termsType==2){
		    $scope.userTerms.push({'userInfo':term.userInfo,'terms':{'base':[],'temp':[term]} });
		}
	    }else{ //if user terms exist,
		//only store latest of each type.
		//NOPE, Only show active...
		if (term.termsType==1){
		    addToBase(term,usrIndex);
		}else if (term.termsType==2){
		    addToTemp(term,usrIndex);
		}
	    }
	}
    }

    $http.get('/api/rest/payTerms/' + $scope.orgId).then(function(data){
	$scope.userTerms=[];
	addTerms(data.data);
    });


    $http.get('/api/rest/newcomerShare/' + $scope.orgId).then(function(data){
	$scope.newcomerShare = data.data.newcomerShare;

    });

    $scope.editUserTerms = function(userIndx){
	$scope.editing = $scope.userTerms[userIndx];
	$scope.tempBaseRate = $scope.editing.terms.base[0].percent;

	if ($scope.editing.terms.temp.length){ //if temporary terms are active, load start and end date, and rate.
	    $scope.newTempRate = $scope.editing.terms.temp[0].percent;

	    var sdate  =  $scope.editing.terms.temp[0].startDate.split('-');
	    var edate  =  $scope.editing.terms.temp[0].endDate.split('-');
	    $scope.dt  = new Date(sdate);
	    $scope.dt2 = new Date(edate);

	}
    };

    $scope.saveNewBaseTerms = function(){
	var data = {'user':$scope.editing.userInfo.pk,
		    'org': $scope.orgId,
		    'termsType': 1,
		    'percent': $scope.tempBaseRate,
		    'addedBy': $scope.userId,
		   };

	$http.post('/api/rest/payTerms/'+$scope.orgId,JSON.stringify(data)).then(function(data){
	    addTerms([data.data]);	    
	});

	//hide button
	$scope.baseRateChanged=false;
    };

    $scope.saveNewTempTerms = function(){
	var data = {'user':$scope.editing.userInfo.pk,
		    'org': $scope.orgId,
		    'termsType': 2,
		    'percent': $scope.newTempRate,
		    'startDate' : moment($scope.dt).format('YYYY-MM-DD'),
		    'endDate': moment($scope.dt2).format('YYYY-MM-DD'),
		    'addedBy': $scope.userId,
		   };

	$http.post('/api/rest/payTerms/'+$scope.orgId,JSON.stringify(data)).then(function(data){
	    addTerms([data.data]);
	});
	//hide button
	$scope.tempRateChanged=false;
    };

    $scope.saveNewcomerShare = function(){
	var data = {'org': $scope.orgId,
		    'settingName': 'newcomerShare',
		    'settingValue': $scope.newcomerShare,
		    'addedBy': $scope.userId,
		   };

	$http.post('/api/rest/newcomerShare/'+$scope.orgId,JSON.stringify(data)).then(function(data){
	    //addTerms([data.data]);
	    $scope.newcomerShareChanged = false;
	    $scope.editNewcomerShare=false;
	});

    };

    $log.log("Hello from Bookkeeper Payterms  controller");
}]);
