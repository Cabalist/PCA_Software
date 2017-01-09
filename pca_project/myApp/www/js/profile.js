
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
}]);

myApp.controller('ProfileController', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.profilePic = '/www/img/blank-profile-picture-973460_960_720.png';

    $scope.userOrgs = [];
    $scope.userPendingOrgs = [];
    $scope.orgList = [];
    
    $http.get('/api/rest/userRoles/' + $scope.userId).then(function(data){
	$scope.userOrgs = data.data.roles;
	$scope.userPendingOrgs = data.data.pending;
    });

    $http.get('/api/rest/orgList').then(function(data){
	$scope.orgList = data.data;
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
		$log.log("got 1");
		$scope.workers.push(data.data.active[i]);
	    } else if (usrRole==2){
		$log.log("got 2");
		$scope.managers.push(data.data.active[i]);
	    } else if (usrRole==3){
		$log.log("got 3");
		$scope.bookkeepers.push(data.data.active[i]);
	    }
	}
	
	$scope.pending = data.data.pending;
	//$log.log("Workers:");
	//$log.log($scope.workers);
	
    });


    
    function getUserRequest(reqId){
	for (var i=0;i<$scope.pendingRequests.length; i++){
	    if ($scope.pendingRequests[i].id==reqId){
		return $scope.pendingRequests[i];
	    }
	}
    }
    
    $scope.acceptUserRequest = function(reqId){
	var request = getUserRequest(reqId);
	var reqUpdated = {'id':reqId,'user':request.user,'organization':request.organization,'status':1,'approvedOrRejectedBy':$scope.userId};
	
	$http.put('/api/rest/orgUsers/'+orgId ,JSON.stringify(reqUpdated)).then(function(data){
	    $log.log("OK!");
	});
    }

    $scope.rejectUserRequest = function(reqId){
	$log.log(reqId);
	$log.log("REJECT!");
    }

}]);

myApp.controller('ManagerController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.orgId = $stateParams.orgId;
    $scope.selectedForm = null;
    $scope.getFormClass = function(formIndex){	
	if ( $scope.selectedForm == formIndex){
	    return "active";
	}
    };
  
    $scope.$on("selectForm",function(event,formIndex){
	$scope.selectedForm = formIndex;
    });
}]);

myApp.controller('Form1Controller', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",1);
    
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
    $scope.$emit("selectForm",2);
}]);


myApp.controller('WorkerController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $log.log("Hello from Worker Controller");
}]);
