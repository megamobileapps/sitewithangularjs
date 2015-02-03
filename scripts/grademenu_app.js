var grademenuApp = angular.module("grademenuApp", ['ui.router'] );

grademenuApp.run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }   
  ]
);

grademenuApp.factory("SimpleFactory", function(){
    var grades=['UKG', 'LKG'];
    var subjects=[
        { 
            gradeid:'UKG', 
            subjects:[
            {
                id:'GUKGE',
                detail:'english detail'
            }
        
            ]
        },
        { 
            gradeid:'LKG', 
            subjects:[
            {
                id:'GLKGE',
                detail:'english detail'
            }
        
            ]
        }
    ];
    
    var topics = [
        {
            subjectid:'GUKGE',
            topics:[
                {id:'grammer2',
                 detail:'grammer detail'
                },
                {id:'grammer2',
                 detail:'grammer2 detail'
                }
            ]
        }
    ];
    
    var worksheets = [
        {
            topicid:'grammer2',
            worksheets:[{
                id:1,
                detail:'worksheet detail',
                content:'worksheet content'
            },
            {
                id:2,
                detail:'worksheet detail',
                content:'worksheet content'
            }]
        }
    ];
    
    var factory={};
    factory.getGrades=function getGrades() {
        return grades;
    }
    
    factory.getSubjects=function getSubjects(gradeid) {
        angular.forEach(subjects, function(subjectdata){
            if(subjectdata.gradeid === gradeid ) {
                return subjectdata.subjects;
            }
        });
        return {};
    }
    factory.getTopics=function getTopics(gradeid, subjectid) {
        angular.forEach(topics, function(topicdata){
            if(topicdata.subjectid === subjectid ) {
                return topicdata.topics;
            }
        });
        return {};
    }
    
    factory.getWorksheets=function(gradeid, subjectid, topicid) {
       angular.forEach(worksheets, function(worksheetdata){
            if(worksheetdata.topicid === topicid ) {
                return worksheetdata;
            }
        });
        return {};
    }
    
    factory.getWorksheetContent=function(gradeid, subjectid, topicid, worksheetid) {
        
        angular.forEach(worksheets, function(data){
            if(data.topicid === topicid ) {
                angular.forEach(data.worksheets, function (worksheetdata){
                    if(worksheetdata.id === worksheetid ) {
                        return worksheetdata;
                    }
                });
            }
        });
        return {};
    }
    
    return factory;
});
var controllers = {};
controllers.SimpleController=function ($scope, SimpleFactory) {
    
    $scope.items=[];
   
    init();
    function init() {
        $scope.items = SimpleFactory.getGrades();
    }
   
};
grademenuApp.controller(controllers);


grademenuApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/grade");
  //
  // Now set up the states
  $stateProvider
    .state('grade', {
      url: "/grade",
      templateUrl: "views/ui-route-views/grade.html",
      controller: function($scope, SimpleFactory) {
        $scope.items = SimpleFactory.getGrades();
      }
    })
    .state('grade.subject', {
      url: "/:gradeid",
      templateUrl: "views/ui-route-views/grade.subject.html",
      controller: ['$scope', '$stateParams', function($scope, $stateParams) {
          console.dir("grade-subject"+$stateParams.gradeid);
          $scope.gradeid = $stateParams.gradeid;
          //$scope.items = SimpleFactory.getSubjects($stateParams.gradeid);
      }]
    })
  .state('grade.subject.topic', {
      url: "/:subjectid",
      templateUrl: "views/ui-route-views/grade.subject.topic.html",
      controller: function($scope, SimpleFactory) {
        $scope.items = SimpleFactory.getSubjects($stateParams.gradeid,$stateParams.subjectid);
      }
    })
  .state('grade.subject.topic.worksheet', {
      url: "/worksheet",
      templateUrl: "views/ui-route-views/grade.subject.topic.worksheet.html",
      controller: function($scope, SimpleFactory) {
        $scope.items = ["A", "List", "Of", "worksheets"];
      }
    })
  .state('grade.subject.topic.worksheet.show', {
      url: "/show",
      templateUrl: "views/ui-route-views/grade.subject.topic.worksheet.show.html",
      controller: function($scope, SimpleFactory) {
        $scope.items = [{content:"Worksheet content"}];
      }
    })
    ;
});