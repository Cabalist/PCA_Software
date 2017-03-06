myApp.controller('c2wController', ['$scope','$http','$log',function($scope,$http,$log) {
    $scope.$emit("selectReport",2);
    
    var y = moment().format("YYYY");
    $scope.yearOptions=[y,y-1,y-2,y-3]
    $scope.selectedYear = $scope.yearOptions[0];

    $scope.myData = [{'name':"2017 Test",'value':'$15'}];
    
    $scope.gridOptions={
	data: $scope.myData,
	onRegisterApi: function(gridApi){
	    $scope.gridApi = gridApi;
	}
    };

    $scope.changeYear=function(year){
	$log.log(year);
	if(year==2017){
	    $scope.gridOptions.data = $scope.myData ;
	}else if (year==2016){
	    $scope.gridOptions.data = [{'name':'2016 Test','value':'$5'}];
	}else {
	    $scope.gridOptions.data = [{'name':'Test','value':'$0'}];
	}

	if (typeof($scope.gridApi)!='undefined'){
	    $scope.gridApi.core.refresh();
	    $log.log("refresh");
	}
    };

    $scope.changeYear($scope.selectedYear);
}]);
