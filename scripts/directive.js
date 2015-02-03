
//add router

// add controllers


utswApp.directive("cartItem",function() {
    
    return {
        restrict: 'E',
        scope:false,
        templateUrl: 'views/cartitem.html'
      };
});

utswApp.directive('showTab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
});

utswApp.directive("cartItemTabData",function() {
    
    return {
        restrict: 'E',
        scope:false,
        templateUrl: 'views/cartitemtab.html'
      };
});