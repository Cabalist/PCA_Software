
var myApp = angular.module('userApp', ['ui.router','ui.bootstrap']);

myApp.config(function($stateProvider){
    $stateProvider
        .state('profile', {
	    url: "/",
	    templateUrl: '/www/partials/profile.html',
	    controller: 'ProfileController'
	})
        .state('admin',{
	    url:"/org/:orgId/admin",
	    templateUrl: '/www/partials/admin.html',
	    controller: 'AdminController'
	})
        .state('canvasser',{
	    url:"/org/:orgId/canvasser",
	    templateUrl: '/www/partials/canvasser.html',
	    controller: 'CanvasserController'
	})
        .state('canvasser.form1',{
	    url:"/org/:orgId/canvasser/form1",
	    templateUrl: '/www/partials/forms/form1.html',
	    controller: 'Form1Controller'
	})
        .state('canvasser.form2',{
	    url:"/org/:orgId/canvasser/form2",
	    templateUrl: '/www/partials/forms/form2.html',
	    controller: 'Form2Controller'
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
	    return "Admin"
	}else if (roleNum==2){
	    return "Canvasser"
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
	    $http.post('/api/rest/joinOrgRequest/'+newOrgId ,JSON.stringify(newRequest)).then(function(data){
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


myApp.controller('AdminController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    var orgId = $stateParams.orgId;
    $scope.pendingRequests = [];    
    
    $http.get('/api/rest/joinOrgRequest/' + orgId).then(function(data){
	$scope.pendingRequests = data.data;
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
	
	$http.put('/api/rest/joinOrgRequest/'+orgId ,JSON.stringify(reqUpdated)).then(function(data){
	    $log.log("OK!");
	});
    }

    $scope.rejectUserRequest = function(reqId){
	$log.log(reqId);
	$log.log("REJECT!");
    }
    
}]);


myApp.controller('CanvasserController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
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
    $scope.currentDate = moment().format("MM-DD-YYYY");
    $scope.canvassHours=4;
    $scope.trf="";
    $scope.donations = [];
    $scope.chk = "";
    $scope.cc = "";
    $scope.money = "";
    $scope.form1 = null;
    
    $scope.addDonation = function(){
	//if form1 is null, need to create it first
	if ($scope.form1==null){
	    var newForm1 = {'userId':$scope.userId,'date':$scope.currentDate,'orgId':$scope.orgId,'canvassHours':$scope.canvassHours,'trf':$scope.trf};
	    $http.post('/api/rest/form1',JSON.stringify(newForm1)).then(function(data){
		$scope.form1 = data.data;
	    });
	};

	$scope.donations.push({'chk':$scope.chk,'cc': $scope.cc ,'money': $scope.money});
	
	//clear values
	$scope.chk = "";
	$scope.cc ="";
	$scope.money = "";
    };

    
    $scope.submitClick=function(){
	//put call
	$log.log("got it");
    };
}]);

myApp.controller('Form2Controller', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",2);
}]);
