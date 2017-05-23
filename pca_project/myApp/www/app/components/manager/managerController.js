myApp.controller('ManagerController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
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

    $scope.goToReimbursements = function(){
	$state.go('manager.reimbursements',{'canvId':0,'year':moment().format("YYYY")});
    };

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
