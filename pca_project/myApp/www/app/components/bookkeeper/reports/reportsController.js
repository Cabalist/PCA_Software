myApp.controller('reportsController', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.$emit("selectForm",4); // this sets "reports" button as selected
    $scope.selectedReport = null;

    $scope.isReportActive = function(index){
	if ($scope.selectedReport == index){
	    return "btn-primary";
	}else{
	    return "btn-default";
	}
    };
    
    $scope.$on("selectReport",function(event,index){
	$scope.selectedReport=index;
    });

    $log.log("hello from reports controller");    
}]);



myApp.controller('r3Controller', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.$emit("selectReport",3);
}]);

myApp.controller('r4Controller', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.$emit("selectReport",4);
}]);
    
