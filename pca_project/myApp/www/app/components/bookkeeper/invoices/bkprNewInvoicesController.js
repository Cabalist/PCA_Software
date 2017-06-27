myApp.controller('BkprNewInvoicesController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
    $scope.$emit("selectForm",5);

    $scope.dt = new Date();

    $scope.items = [];
    $scope.description= null;
    $scope.amount = 0.0;
    $scope.total = 0;
    
    $scope.popup1 = {
	opened: false
    };

    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };

    //Get org workers list.
    $http.get('/api/rest/nextInvoiceNum/' + $scope.orgId).then(function(data){
	$scope.invoiceNum = data.data.nextNum;
    });

    $scope.addItem = function(){
	$scope.total += $scope.amount;
	
	var item = {'description':$scope.description,
		    'amount': $scope.amount};


	$scope.items.push(item);

	//clear data
	$scope.description = '';
	$scope.amount = 0.0;
    }
    
    
    $log.log("Hello from Bookkeeper new invoices controller");
}]);
