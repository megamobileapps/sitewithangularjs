var controllers = {};
controllers.MainController=function($rootScope, $scope){
	$scope.helpUrl="";
	$rootScope.onViewLoad = function(){
     	console.log('view changed');  
    };
}
controllers.SimpleController=function ($rootScope, $scope, SimpleFactory) {
    
    $scope.storeItems=[];
    $scope.cart;
	$scope.selectedItem='';
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

controllers.SubjectController = function($rootScope. $scope, $routeParams, SimpleFactory){
	$scope.data = {};
	$scope.cart;
	function call_back_data(data, status){
		$scope.data = data;
		processMe();
	}
	function init(){
        SimpleFactory.getStoreData(false)
		.success(call_back_data)
		.error(call_back_data); 
	}
    function processMe() {
		$scope.storeItem=[];
        
        var sfound=false;
		var gradeId = -1;
        
		angular.forEach($scope.data,function(data){
            if(data.gradename === $routeParams.gradeName 
              && sfound === false ) {
				$scope.storeItem = data;
                sfound = true;
            }
        });
		//console.log("related subjects"+JSON.stringify($scope.relatedSubjects));
    }
};
controllers.ShowStoreItemDetailController = function($rootScope, $scope, $routeParams,SimpleFactory) {
 
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
        $scope.currrentSubjectItem.subjectName = $routeParams.subjectName;
        $scope.currrentSubjectItem.gradeName = $routeParams.gradeName;
        $scope.currentSubjectData=[];
        
        var sfound=false;
		var gradeId = -1;
        angular.forEach($scope.worksheetDetails,function(data){
            if(data.gradename === $routeParams.gradeName 
              && sfound === false ) {
                //search for subject in it
                //
				gradeId = data.name;
                console.log("Found grade "+$routeParams.gradeName);
				$scope.currentSubjectListInGrade = data.subjects;
                angular.forEach(data.subjects, function(subData) {
                    if(subData.name === $routeParams.subjectName ) {
                        $scope.currentSubjectData.push(subData);
                        console.log("Found subject "+$routeParams.subjectName);
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
			});
		}
		//console.log("related subjects"+JSON.stringify($scope.relatedSubjects));
    }
 
};

// add multiple controller funcitons in controllers
// each one will be added as separate controllers and can be use
// in different divs.
utswApp.controller(controllers);
