myApp.controller('ytdController', ['$scope','$http','$log', function($scope,$http,$log) {
    $scope.$emit("selectReport",1);
    $scope.rawData = [];

    $scope.myData = [];    

    function addYTDDataToChart(donations){
	for(var i = 0;i<donations.length;i++){
	    var d = donations[i];
	    var dRow = {}
	    dRow["canvasser"] = d.user.first_name+" "+d.user.last_name;
	    dRow["donor"] =d.donor.name;
	    dRow["date"] = d.formDate;
	    dRow["value"]=d.value;
	    
	    if (d.payTerms != null){
		dRow["canvaser %"] = d.payTerms.percent;
	    }else{
		dRow["canvaser %"] = "Null";
	    }

	    if (d.payTerms!=null){
		dRow["canvasserTake"] = (d.value * (d.payTerms.percent/100)).toFixed(2);
	    }else{
		dRow["canvasserTake"] = 0;
	    }


	   
	    $scope.myData.push(dRow);
	}
    };
    
    $http.get('/api/rest/orgYTDDonations/' + $scope.orgId+'/'+moment().year()).then(function(data){
	$scope.rawData = data.data;
	addYTDDataToChart(data.data);

    });

}]);
