myApp.controller('BkprNewInvoicesController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
    $scope.$emit("selectForm",5);

    $scope.dt = new Date();

    $scope.popup1 = {
	opened: false
    };

    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };

    //Get org workers list.
    $http.get('/api/rest/nextInvoiceNum/' + $scope.orgId).then(function(data){
	$scope.invoiceNum = data.data.nextNum;
	$log.log(data.data);
    });
    
    
    $log.log("Hello from Bookkeeper new invoices controller");
}]);
