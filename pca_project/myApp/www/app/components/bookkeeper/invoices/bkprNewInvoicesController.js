myApp.controller('BkprNewInvoicesController', ['$scope','$http','$log','$stateParams','$state', function($scope,$http,$log,$stateParams,$state) {
    $scope.$emit("selectForm",5);

    
    $log.log("Hello from Bookkeeper new invoices controller");
}]);
