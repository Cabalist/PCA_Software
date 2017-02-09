myApp.controller('BkprUsrMgmtController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",1);
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
