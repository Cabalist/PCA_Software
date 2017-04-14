#!/usr/bin/env bash
`npm bin`/uglifyjs2 ./app/app.js  \
	 ./app/routes.js \
         ./app/shared/mainController.js \
	 ./app/components/bookkeeper/bookkeeperController.js \
	 ./app/components/bookkeeper/payTerms/bkprPayTermsController.js \
	 ./app/components/bookkeeper/userMngmnt/bkprUsrMgmtController.js \
	  ./app/components/bookkeeper/adjustments/bkprAdjustmentsController.js \
	 ./app/components/bookkeeper/reports/reportsController.js \
	 ./app/components/bookkeeper/reports/ytdController.js \
	 ./app/components/bookkeeper/reports/c2wController.js \
	 ./app/components/manager/managerController.js  \
	 ./app/components/manager/donors/managerDonorsController.js  \
	 ./app/components/manager/hours/managerHoursController.js  \
	 ./app/components/profile/profileController.js  \
	 ./app/components/worker/workerController.js  -o ./js/profile.min.js
