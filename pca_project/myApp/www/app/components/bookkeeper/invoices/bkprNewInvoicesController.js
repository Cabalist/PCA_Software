myApp.controller('BkprNewInvoicesController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
    $scope.$emit("selectForm",5);

    $scope.dt = new Date();

    $scope.items = [];
    $scope.description = null;
    $scope.amount = 0.0;
    $scope.total = 0;
    $scope.billTo = null;
    $scope.addr = null;
    $scope.state = null;
    $scope.zip = null;
    $scope.popup1 = {
	opened: false
    };

    $scope.open1 = function() {
	$scope.popup1.opened = true;
    };

    //populate org name
    $scope.from = $scope.orgName;
    
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

    function validateInvoice(data){
	//TODO: check input...
	
	return {'valid':true};
    };
    
    $scope.saveInvoice = function(){
	var invoiceData = {'from':$scope.from,
			   'billTo':$scope.billTo,
			   'date': moment($scope.dt).format('YYYY-MM-DD'),
			   'items': $scope.items,
			   'addr': $scope.addr,
			   'state': $scope.state,
			   'zip': $scope.zip};
	


	var validate = validateInvoice(invoiceData);
	if (validate.valid){
	    $http.post("/api/rest/invoices/"+$scope.orgId,JSON.stringify(invoiceData)).then(function(data){
		
		$scope.errorMsg = null;

		//show success message...

		//wait a sec


		//go back
		$state.go('bookkeeper.invoices');
	    });
	    
	}else{
	    //set message here...
	    $scope.errorMsg = validate.errorMsg;
	}	
    }
    
    $log.log("Hello from Bookkeeper new invoices controller");
}]);
