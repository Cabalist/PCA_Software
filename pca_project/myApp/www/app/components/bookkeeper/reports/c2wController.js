myApp.controller('c2wIndexController', ['$scope','$http','$log','$state',function($scope,$http,$log,$state) {
    $scope.$emit("selectReport",2);


    //This controller should figure out latest week and change to that state.
    //current week
    var now = moment();
    var curWeek = now.week();

    var cur = null;
    var start = null;
    
    //if odd, get start of previous week.
    if (curWeek%2!=0){
	cur = (curWeek-1)/2;
    }else {
	cur = curWeek/2;
    }

    $state.go("bookkeeper.reports.c2w",{ 'year': now.format("YYYY"), 'period':cur });
    
}]);


myApp.controller('c2wController', ['$scope','$http','$log','$state','$stateParams',function($scope,$http,$log,$state,$stateParams) {
    //probably need to emit something to set year and period in parent scope...
    $scope.year = $stateParams.year;
    $scope.period = $stateParams.period;
    
    //figure out start of period...    
    $scope.startOfPeriod = moment($scope.year+"-01-01").add($scope.period*14-1,'days').startOf('week');
    $scope.startOfPeriodStr = $scope.startOfPeriod.format("MMMM Do, YYYY");

    $scope.endOfPeriod = $scope.startOfPeriod.add(14,'days').startOf('week');
    $scope.endOfPeriodStr = $scope.endOfPeriod.format("MMMM Do, YYYY");

    $scope.showNext = function(){
	var now = moment();
	if ($scope.endOfPeriod > now){
	    return false;
	    
	}else{
	    return true;
	}
    };

    $scope.goToPrev = function(){
	if ($scope.period > 1){
	    $scope.period--;
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period });
	}else{
	    $scope.year--;
	    $scope.period= 26;
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period });
	}
    };


    $scope.goToNext = function(){
	if ($scope.endOfPeriod.format("YYYY") > $scope.startOfPeriod.format("YYYY")){
	    $scope.period =1 ;
	    $scope.year++;
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period });
	}else{
	    $scope.period++;
	    $state.go("bookkeeper.reports.c2w",{ 'year': $scope.year, 'period':$scope.period });
	}
    };
    
    $log.log("Hello from c2wController");
    
}]);
