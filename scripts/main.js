var utswApp = angular.module("utswApp",['ngRoute', 'ngAnimate','ui.router','facebook']);
utswApp.run(
['$rootScope','$state', '$stateParams',
	function($rootScope, $state, $stateParams){
		$rootScope.$state = $state;
		$rootScope.stateParams = $stateParams;
	}
]
);
var newSitePath="http://localhost/in/";
