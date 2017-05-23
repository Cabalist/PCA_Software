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
        .state('bookkeeper.adjustments',{
	    url:"/adjustments/:canvId/:year",
	    templateUrl: '/www/partials/bookkeeper-adjustments.html',
	    controller: 'BkprAdjustmentsController'
	})
        .state('bookkeeper.reimbursements',{
	    url:"/reimbursements/:canvId/:year",
	    templateUrl: '/www/partials/bookkeeper-reimbursements.html',
	    controller: 'BkprReimbursementsController'
	})
	.state('bookkeeper.reports',{
	    url:'/reports',
	    templateUrl: '/www/partials/bookkeeper-reports.html',
	    controller: 'reportsController'
	})
        .state('bookkeeper.reports.ytd',{
	    url:'/ytd',
	    templateUrl: '/www/partials/bookkeeper-reports-ytd.html',
	    controller: 'ytdController'
	})
        .state('bookkeeper.reports.c2wIndex',{ //Canvasser 2 week report Index
	    url:'/c2w',
	    controller: 'c2wIndexController'
	})
        .state('bookkeeper.reports.c2w',{ //Canvasser 2 week report
	    url:'/c2w/:year/:period/:canvId',
	    templateUrl: '/www/partials/bookkeeper-reports-c2w.html',
	    controller: 'c2wController'
	})
        .state('bookkeeper.reports.r3',{ 
	    url:'/r3',
	    templateUrl: '/www/partials/bookkeeper-reports-r3.html',
	    controller: 'r3Controller'
	})
        .state('bookkeeper.reports.r4',{ 
	    url:'/r4',
	    templateUrl: '/www/partials/bookkeeper-reports-r4.html',
	    controller: 'r4Controller'
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
        .state('manager.reimbursements',{
	    url:"/reimbursements/:year/:canvId",
	    templateUrl: '/www/partials/manager-reimbursements.html',
	    controller: 'ManagerReimbursementsController'
	})
        .state('worker',{
	    url:"/org/:orgId/worker",
	    templateUrl: '/www/partials/worker.html',
	    controller: 'WorkerController'
	});
});
