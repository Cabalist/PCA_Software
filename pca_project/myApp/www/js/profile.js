
var myApp = angular.module('userApp', ['ui.router','ui.bootstrap']);

myApp.config(function($stateProvider){
    $stateProvider
        .state('profile', {
	    url: "/",
	    templateUrl: '/www/partials/profile.html',
	    controller: 'ProfileController'
	})
        .state('bookkeeper',{
	    url:"/org/:orgId/bookkeeper",
	    templateUrl: '/www/partials/bookkeeper.html',
	    controller: 'BookkeeperController'
	})
        .state('bookkeeper.userMgmt',{
	    url:"/userMgmt",
	    templateUrl: '/www/partials/bookkeeper-userMgmt.html',
	    controller: 'BkprUsrMgmtController'
	})
        .state('manager',{
	    url:"/org/:orgId/manager",
	    templateUrl: '/www/partials/manager.html',
	    controller: 'ManagerController'
	})
        .state('manager.donors',{
	    url:"/donors",
	    templateUrl: '/www/partials/manager-donors.html',
	    controller: 'ManagerDonorsController'
	})
        .state('manager.form1',{
	    url:"/form1",
	    templateUrl: '/www/partials/forms/form1.html',
	    controller: 'Form1Controller'
	})
        .state('manager.form2',{
	    url:"/form2",
	    templateUrl: '/www/partials/forms/form2.html',
	    controller: 'Form2Controller'
	})
        .state('worker',{
	    url:"/org/:orgId/worker",
	    templateUrl: '/www/partials/worker.html',
	    controller: 'WorkerController'
	});
});

myApp.controller('mainController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.userId = document.getElementById('userId').value;
    $scope.userName = document.getElementById('userName').value;
    $scope.orgList = [];

    //TODO FIX THIS ... OrgList is used to populate org list dropdown in /profile ,
    //  Also this information used to get org name in org page...
    $http.get('/api/rest/orgList').then(function(data){
	$scope.orgList = data.data;
    });    
}]);

myApp.controller('ProfileController', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.profilePic = '/www/img/blank-profile-picture-973460_960_720.png';

    $scope.userOrgs = [];
    $scope.userPendingOrgs = [];
    
    $http.get('/api/rest/userRoles/' + $scope.userId).then(function(data){
	$scope.userOrgs = data.data.roles;
	$scope.userPendingOrgs = data.data.pending;
    });
    
    $scope.getRoleName=function(roleNum){
	if (roleNum==1){
	    return "Worker"
	}else if (roleNum==2){
	    return "Manager"
	}else if (roleNum==3){
	    return "Bookkeeper"
	}
    };

    function checkIfMember(orgId){
	for (var i = 0;i<$scope.userOrgs.length;i++){
	    if ($scope.userOrgs[i].organization.id == orgId){
		return true;
	    }
	}
	return false;
    }

    function checkIfMembershipPending(orgId){
	for (var i=0; i<$scope.userPendingOrgs.length;i++){
	    if($scope.userPendingOrgs[i].organization==orgId){
		return true;
	    }
	}
	
	return false;
    }
    
    $scope.joinClick = function(){
	var newOrgId = document.getElementById("orgList").value;

	if (checkIfMember(newOrgId)){
	    alert("Already a member");
	}else if(checkIfMembershipPending(newOrgId)){
	    alert("A request to join already exists");
	}else{
	    var newRequest = {'userId':$scope.userId,'orgId':newOrgId};
	    $http.post('/api/rest/orgUsers/'+newOrgId ,JSON.stringify(newRequest)).then(function(data){
		$scope.userPendingOrgs.push(data.data);
	    });
	}
    };

    $scope.getOrgName = function(orgId){
	for (var i = 0; i < $scope.orgList.length; i++){
	    var locationOrgs = $scope.orgList[i].orgs;
	    
	    for (var p = 0; p < locationOrgs.length; p++){
		var org = locationOrgs[p];
		if(org.id == orgId){
		    return org.name;
		}
	    }
	}
    }
}]);

myApp.controller('BookkeeperController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.orgId = $stateParams.orgId;
    $scope.orgName= null;
    //Set org name
    for(var i=0;i<$scope.orgList.length;i++){
	var locationList = $scope.orgList[i].orgs;
	for(var p=0;p<locationList.length;p++){
	    if (locationList[p].id==$scope.orgId){
		$scope.orgName=locationList[p].name;
	    }
	}
    }

    $log.log("hello from Bookkeeper controller");
}]);

myApp.controller('BkprUsrMgmtController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $log.log("Hello from Bookkeeper User Mgmt controller");

    $scope.bookkeepers = [];
    $scope.managers = [];
    $scope.workers = [];
    $scope.pending = [];
    
    //Areas: Bookkeepers, managers, workers, pending requests
    $scope.pendingRequests = [];
    $http.get('/api/rest/orgUsers/' + $scope.orgId).then(function(data){	
	for(var i=0;i<data.data.active.length ;i++){
	    var usrRole = data.data.active[i].role;
	    if (usrRole==1){
		$scope.workers.push(data.data.active[i]);
	    } else if (usrRole==2){
		$scope.managers.push(data.data.active[i]);
	    } else if (usrRole==3){
		$scope.bookkeepers.push(data.data.active[i]);
	    }
	}

	$scope.pending = data.data.pending;	
    });

    $scope.acceptUserRequest = function(indx){
	var request = $scope.pending[indx];	
	var reqUpdated = {'id':request.id,'user':request.userInfo.pk,'organization':request.organization,'status':1,'approvedOrRejectedBy':$scope.userId};
	
	$http.put('/api/rest/orgUsers/'+$scope.orgId ,JSON.stringify(reqUpdated)).then(function(data){
	    //Remove from Pending, add to Workers.
	    $scope.pending.splice(indx,1);
	    
	    $scope.workers.push(data.data);
	});	
    }
    
    $scope.rejectUserRequest = function(indx){
	$log.log("REJECT!");
    }

    $scope.isBookkeeper = function(userId){
	for(var i=0; i<$scope.bookkeepers.length; i++){
	    if ($scope.bookkeepers[i].userInfo.pk==userId){
		return true;
	    }
	}
	return false;
    }
    
    $scope.isManager = function(userId){
	for(var i=0; i<$scope.managers.length; i++){
	    if ($scope.managers[i].userInfo.pk==userId){
		return true;
	    }
	}
	return false;
    }

    $scope.addBookkeeperPermissions = function(index){
	var usr = $scope.workers[index];
	var data = {'userId':usr.userInfo.pk,
		    'orgId':$scope.orgId,
		    'role':3,
		    'acceptedBy':$scope.userId,
		   };
	
	$http.post('/api/rest/userRoles/'+usr.userInfo.pk,JSON.stringify(data)).then(function(data){
	    $scope.bookkeepers.push(data.data);
	});
    }
    
    $scope.addManagerPermissions = function(index){
	var usr = $scope.workers[index];
	var data = {'userId':usr.userInfo.pk,
		    'orgId':$scope.orgId,
		    'role':2,
		    'acceptedBy':$scope.userId,
		   };
	
	$http.post('/api/rest/userRoles/'+usr.userInfo.pk,JSON.stringify(data)).then(function(data){
	    $scope.managers.push(data.data);
	});
	
    }
}]);

myApp.controller('ManagerController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.orgId = $stateParams.orgId;
    $scope.orgName= null;
    $scope.selectedForm = null;
    $scope.isFormActive = function(formIndex){	
	if ( $scope.selectedForm == formIndex){
	    return "active";
	}
    };
  
    $scope.$on("selectForm",function(event,formIndex){
	$scope.selectedForm = formIndex;
    });

    //Set org name
    for(var i=0;i<$scope.orgList.length;i++){
	var locationList = $scope.orgList[i].orgs;
	for(var p=0;p<locationList.length;p++){
	    if (locationList[p].id==$scope.orgId){
		$scope.orgName=locationList[p].name;
	    }
	}
    }    
}]);


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
    $scope.donationValue = 0 ;

    
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
	    $scope.donationValue = 0 ;
	    //cc specific
	    $scope.nameOnCard=null;
	    $scope.cardLast4=null;
	    $scope.cardExp=null;
	    $scope.cardRecurring=0;  
	    //check specific
	    $scope.checkNum=null;
	    $scope.checkDt = new Date(); //Maybe refresh formDate as well?
	});
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

myApp.controller('Form1Controller', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",2);
    
    $scope.canvassHours=4;
    $scope.trf="";
    $scope.donations = [];
    $scope.chk = "";
    $scope.cc = "";
    $scope.money = 0.0;
    $scope.form1 = null;
    $scope.submitHistory=[];

    //validators
    $scope.isMoneyNumber = function(){
	var mon = !isNaN($scope.money);
	return mon;
    }
    
    //datepicker things
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
    
    //get only history. No unfinished forms are stored.
    $http.get('/api/rest/form1/' + $scope.userId+'/'+$scope.orgId).then(function(data){
	$scope.submitHistory = data.data.history;
    });
    
    $scope.addDonation = function(){
	//No need for this... form1 gets created on 'submitClick'
	//if form1 is null, need to create it first
	/*
	var form1 = $scope.form1;
	if (form1==null){
	    var date = moment($scope.dt).format('MM-DD-YYYY');
	    
	    form1 = {'userId':$scope.userId,'date':date,'orgId':$scope.orgId,'canvassHours':$scope.canvassHours,'trf':$scope.trf};
	}else{
	    form1 = $scope.form1.id;
	}
	*/
	var donation = {'chk': $scope.chk,'cc':$scope.cc,'money':$scope.money};
	$scope.donations.push(donation);
	
	//TODO REMOVE THIS API CALL
	/*$http.post('/api/rest/donation',JSON.stringify(donation)).then(function(data){
	    //need to set $scope.form1
	    if($scope.form1==null){
		$scope.form1 = form1;
		$scope.form1.id=data.data.form;		
	    }
	});
	*/
	
	//clear values
	$scope.chk = "";
	$scope.cc ="";
	$scope.money = "";
    };
    
    $scope.submitClick=function(){
	var date = moment($scope.dt).format('MM-DD-YYYY');
	var form1 = {'userId':$scope.userId,'date':date,'orgId':$scope.orgId,'canvassHours':$scope.canvassHours,'trf':$scope.trf};
	var form1Data = {"form1":form1,"donations":$scope.donations}
	//var formId = $scope.form1.id;
	//var update = {'id':formId,'status':1};

	//TODO REMOVE PUT FROM API...
	/*
	$http.put('/api/rest/form1/'+$scope.userId,JSON.stringify()).then(function(data){
	    $scope.submitHistory.push(data.data);
	});
	*/

	$http.post('/api/rest/form1/'+$scope.userId,JSON.stringify(form1Data)).then(function(data){
	    $scope.submitHistory.push(data.data);

	    $scope.donations=[];
	});
    };
}]);

myApp.controller('Form2Controller', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",3);
}]);


myApp.controller('WorkerController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $log.log("Hello from Worker Controller");
}]);
