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

    $scope.selectedForm = null;
    $scope.isFormActive = function(formIndex){
	if ( $scope.selectedForm == formIndex){
	    return "active";
	}
    };

    $scope.$on("selectForm",function(event,formIndex){
	$scope.selectedForm = formIndex;
    });

    $log.log("hello from Bookkeeper controller");

}]);
