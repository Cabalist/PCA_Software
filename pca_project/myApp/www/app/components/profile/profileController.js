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
