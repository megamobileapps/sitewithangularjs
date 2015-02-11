var controllers = {};
controllers.MainController=function($rootScope, $scope, SimpleFactory, Facebook){
    $scope.cart;
	$scope.helpUrl="";
	$scope.user={};
	$scope.facebook_logged = false;
	init();

	function init(){
        $scope.cart=SimpleFactory.getCart();
	}
	 /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
	  var userIsConnected = false;
      
      Facebook.getLoginStatus(function(response) {
		console.log("response from login status"+JSON.stringify(response));
        if (response.status == 'connected') {
			$scope.user.accesstoken=response.authResponse.accessToken;
			$scope.user.userid=response.authResponse.userID;
            userIsConnected = true;
            $scope.facebook_logged = true;
            $scope.facebook_me();
        }
      });
    
	  
	$rootScope.onViewLoad = function(){
     	console.log('view changed');  
    };
	$scope.facebook_login = function() {
		console.log("facebook_login called");
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
        // Do something with response.
		console.log("Facebook login response:"+JSON.stringify(response));
		if (response.status == 'connected') {
            $scope.facebook_logged = true;
			$scope.user.accesstoken=response.authResponse.accessToken;
			$scope.user.userid=response.authResponse.userID;
            $scope.facebook_me();
        }
      });
    };

    /**
       * Logout
       */
      $scope.facebook_logout = function() {
        Facebook.logout(function() {
          $scope.$apply(function() {
            $scope.user   = {};
            $scope.facebook_logged = false;  
          });
        });
      }
      

    $scope.facebook_getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          $scope.loggedIn = true;
        } else {
          $scope.loggedIn = false;
        }
      });
    };

    $scope.facebook_me = function() {
      Facebook.api('/me', function(response) {
		console.log("me:user data:"+JSON.stringify(response));
        $scope.user=angular.extend($scope.user, response);

		$.ajax({
               type: "GET",
               url : newSitePath+"mobile/fb_login_processing.php?userid="+$scope.user.userid
					 +"&accesstoken="+$scope.user.accesstoken
        });

      });
    };
	$scope.logout=function() {
		$scope.facebook_logout();
	}
  };
controllers.SimpleController=function ($rootScope, $scope, SimpleFactory) {
    
    $scope.storeItems=[];
    $scope.cart;
	$scope.selectedSubject='';
	function call_back(data, status){
		$scope.storeItems=data;
		if(data){
			console.log("G0t data from server - SimpleController");
		} else {
			console.log("Couldn't get data from server - SimpleController");
		}
	}
    function init() {
        var myData = SimpleFactory.getStoreData(true); 
		myData.success(call_back); 
		myData.error(call_back); 

        $scope.cart=SimpleFactory.getCart();
		console.log("init for SimpleController called");
    }
    init();
	$scope.selectItem = function(selectedItem) {
		console.log("selectItem clicked in simplecontroller");
		angular.forEach($scope.storeItems,function(item) {
			item.isselected = 'notactive';
			if (selectedItem === item) {
				selectedItem.isselected = 'active';
			}
		});
	};
};
controllers.MenuController=function ($rootScope, $scope, SimpleFactory) {
    
    $scope.storeItems=[];
    $scope.cart={};
	function call_back(data, status){
		$scope.storeItems=data;
		if(data){
			console.log("G0t data from server - MenuController");
		} else {
			console.log("Couldn't get data from server - MenuController");
		}
	}
    //init();
    function init() {
        SimpleFactory.getStoreData(false)
		.success(call_back)
		.error(call_back);  
        $scope.cart=SimpleFactory.getCart();
    }
  	$scope.selectedMenu2='itemDetails1'; 
};

controllers.SubjectController = function($rootScope, $scope, $stateParams, SimpleFactory){
	$scope.data = {};
	$scope.cart;

	init();
	function call_back_data(data, status){
		$scope.data = data;
		processMe();
	}
	function init(){
		console.log("SubjectController called");
        SimpleFactory.getStoreData(false)
		.success(call_back_data)
		.error(call_back_data); 
	}
    function processMe() {
		console.log("stateparams:gradename:"+$stateParams.gradeName);
		$scope.storeItem=[];
        
        var sfound=false;
		var gradeId = -1;
        
		angular.forEach($scope.data,function(data){
            if(data.gradename === $stateParams.gradeName 
              && sfound === false ) {
				$scope.storeItem = data;
                sfound = true;
            }
        });
		console.log("End of for loop in SubjectController");
		//console.log("related subjects"+JSON.stringify($scope.relatedSubjects));
    }
};
controllers.ShowStoreItemDetailController = function($rootScope, $scope, $stateParams,SimpleFactory) {
 
    $scope.worksheetDetails=[];
    $scope.cart;
	function call_back(data, status){
		$scope.worksheetDetails=data;
		if(data){
			processMe();
		} else {
			console.log("Couldn't get data from server");
		}
	}
	function call_back_gettopics(data, status) {
		$scope.topics=data;
	}
	function call_back_getfree_ws(data, status) {
		$scope.freeWsList = data;
	}
	function call_back_getsubws(data, status) {
		$scope.wsList = data;
	}
    init();


	function getTopics(subId) {
				SimpleFactory.getTopics(subId)
				.success(call_back_gettopics)
				.error(call_back_gettopics);
	}
	
	function getFreeWs(gradeid, subId){
				SimpleFactory.getFreeWs(gradeid, subId)
				.success(call_back_getfree_ws)
				.error(call_back_getfree_ws);
	
	}
    
	function getSubWs(subId) {
				SimpleFactory.getSubWs(subId)
				.success(call_back_getsubws)
				.error(call_back_gettopics);
	}
	function init() {
        SimpleFactory.getStoreData(false)
		.success(call_back)
		.error(call_back);   
        $scope.cart=SimpleFactory.getCart();
		
	}
    function processMe() {
		$scope.currentSubjectListInGrade=[];
		$scope.relatedSubjects=[];
        $scope.currrentSubjectItem={};
        $scope.currrentSubjectItem.subjectName = $stateParams.subjectName;
        $scope.currrentSubjectItem.gradeName = $stateParams.gradeName;
        $scope.currentSubjectData=[];
        
        var sfound=false;
		var gradeId = -1;
        angular.forEach($scope.worksheetDetails,function(data){
            if(data.gradename === $stateParams.gradeName 
              && sfound === false ) {
                //search for subject in it
                //
				gradeId = data.name;
                console.log("Found grade "+$stateParams.gradeName);
				$scope.currentSubjectListInGrade = data.subjects;
                angular.forEach(data.subjects, function(subData) {
                    if(subData.name === $stateParams.subjectName ) {
                        $scope.currentSubjectData.push(subData);
                        console.log("Found subject "+$stateParams.subjectName);
                        sfound = true;
                    }else{
						$scope.relatedSubjects.push(subData);
					}
                });

            }
        });
		if(true == sfound ) {
			angular.forEach($scope.currentSubjectData, function(subData) {
        		var subId = "G"+subData.subjectid;
				getTopics(subId);
				getFreeWs(gradeId, subId);
				getSubWs(subId);
			});
		}
		//console.log("related subjects"+JSON.stringify($scope.relatedSubjects));
    }
 
};

controllers.UserController=function($rootScope, $scope, SimpleFactory, Facebook){
	$scope.user={};
	init();
	function call_back_user_payhistory(data, status) {
		console.log("payhistory:"+JSON.stringify(data));
		$scope.user.payhistory = data;
	}
	function init(){
		SimpleFactory.getPayhistory()
		.success(call_back_user_payhistory)
		.error(call_back_user_payhistory);
	}

};
// add multiple controller funcitons in controllers
// each one will be added as separate controllers and can be use
// in different divs.
utswApp.controller(controllers);
