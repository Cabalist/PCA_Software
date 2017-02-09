myApp.config(function($stateProvider){
    $stateProvider
        .state('profile', {
	    url: "/",
	    templateUrl: '/www/partials/profile.html',
	    controller: 'ProfileController'
	})
        .state('bookkeeper',{
	    url:"/org/:orgId/bookkeeper",
	    templateUrl: '/www/partials/bookkeeper.html',
	    controller: 'BookkeeperController'
	})
        .state('bookkeeper.userMgmt',{
	    url:"/userMgmt",
	    templateUrl: '/www/partials/bookkeeper-userMgmt.html',
	    controller: 'BkprUsrMgmtController'
	})
        .state('bookkeeper.payterms',{
	    url:"/payterms",
	    templateUrl: '/www/partials/bookkeeper-payterms.html',
	    controller: 'BkprPaytermsController'
	})
        .state('manager',{
	    url:"/org/:orgId/manager",
	    templateUrl: '/www/partials/manager.html',
	    controller: 'ManagerController'
	})
        .state('manager.donors',{
	    url:"/donors",
	    templateUrl: '/www/partials/manager-donors.html',
	    controller: 'ManagerDonorsController'
	})
        .state('manager.hours',{
	    url:"/hours",
	    templateUrl: '/www/partials/manager-hours.html',
	    controller: 'ManagerHoursController'
	})
        .state('worker',{
	    url:"/org/:orgId/worker",
	    templateUrl: '/www/partials/worker.html',
	    controller: 'WorkerController'
	});
});
