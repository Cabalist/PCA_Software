myApp.controller('BkprInvoicesController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
    $scope.$emit("selectForm",5);
    $scope.invoices = [];
    
    $http.get('/api/rest/invoices/' + $scope.orgId).then(function(data){
	$scope.invoices = data.data;
    });

    $scope.sumOfItems = function(invoice){
	$log.log(invoice);
	var sum = 0.0;
	for(var i = 0;i<invoice.items.length;i++){
	    sum+= parseFloat(invoice.items[i].amount);
	}
	return sum;
    };
    
    $log.log("Hello from Bookkeeper invoices controller");
}]);
