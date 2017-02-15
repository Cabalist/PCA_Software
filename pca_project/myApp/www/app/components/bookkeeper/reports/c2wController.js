myApp.controller('c2wController', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.$emit("selectReport",2);
    //Need to emit something else.
}]);
