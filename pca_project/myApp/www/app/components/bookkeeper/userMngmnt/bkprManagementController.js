myApp.controller('BkprUsrManagementController', ['$scope','$http','$log','$stateParams', function($scope,$http,$log,$stateParams) {
    $scope.$emit("selectForm",1);

    $log.log("Hello from Bookkeeper Management  controller");

    
}]);
