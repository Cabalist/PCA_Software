myApp.controller('BkprAdjustmentsController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",3);


    $log.log("Hello from Bookkeeper Adjustmentss  controller");
}]);
