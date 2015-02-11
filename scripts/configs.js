utswApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
		.state("home",
              {
				url:"/home",
                templateUrl:"views/viewmain.html",
                controller:"MainController"
            })
        .state("samples", 
              {
				url:"/samples",
                templateUrl:"views/viewsample.html"
               })
        .state("signin", 
              {
				url:"/signin",
                templateUrl:"views/signin.html",
                controller:"MainController"
               })
		.state("profile",
              {
				url:"/profile",
                templateUrl:"views/viewprofile.html",
                controller:"UserController"
            })
        .state("shopping", 
              {
				url:"/shopping",
                templateUrl:"templates/storeshelf-notab.html",
                controller:"SimpleController"
               })
         .state("shopping.subjectlist", 
              {
				url:"/:gradeName",
                templateUrl:"views/cartitemtab.html",
                controller:"SubjectController"
               })
         .state("shopping.subjectdetail",
              {
				url:"/:gradeName/:subjectName", 
                templateUrl:"views/cartitemdetail.html",
                controller:"ShowStoreItemDetailController"
               })
        .state("cart", 
              {
				url:"/cart",
                templateUrl:"views/showcart.html",
                controller:"SimpleController"
               });
});
utswApp.config(function(FacebookProvider) {
     // Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
     FacebookProvider.init('150225251769346');
  });

