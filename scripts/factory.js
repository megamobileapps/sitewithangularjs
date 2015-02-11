utswApp.factory("SimpleFactory", ['$http', '$rootScope', '$templateCache',function($http, $scope, $templateCache){

    var myCart = new ShoppingCart("utswStore");
    myCart.addCheckoutParameters("Paypal", {serviceName:"Paypal", merchantID:"goel74@gmail.com", options:{}});
    myCart.addCheckoutParameters("Facebook", {serviceName:"Facebook", options:{}});
    
	var factory = {};
	var srvc=this; 

    factory.getStoreData = function(refresh) {
		return $http({method: "GET", 
				url: newSitePath+"mobile/getops.php?useraction=showpricelist&printed=1", 
				cache: true});
    }
    factory.getTopics = function(subId) {
		return $http({method: "GET",
				url: newSitePath+"mobile/getops.php?useraction=showtopiclist&subid="+subId, 
				cache: true});
	}
   
    factory.getFreeWs = function(gradeId, subId) {
		return $http({method: "GET",
				url: newSitePath+"mobile/getops.php?useraction=listfreews&gradeid="+gradeId+"&subid="+subId, 
				cache: true});
	}
    
	factory.getSubWs = function(subId) {
		return $http({method: "GET",
				url: newSitePath+"mobile/getops.php?useraction=listws&subid="+subId, 
				cache: true});
	}

	factory.getPayhistory=function(){
		return $http({method: "GET",
				url: newSitePath+"mobile/getops.php?useraction=getprofile", 
				cache: true});
		
	}
    
    factory.getCart = function() {
        return myCart;
    }
    
    return factory;

}]);

