myApp.controller('BkprPayratesController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",2);

    $scope.userRates = [];
    

    $log.log("Hello from Bookkeeper Payterms  controller");
}]);
