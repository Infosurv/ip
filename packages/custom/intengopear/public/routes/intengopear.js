'use strict';

//Override the home routes
//Setting up route
angular.module('mean.system').config(['$meanStateProvider', '$urlRouterProvider', function($meanStateProvider, $urlRouterProvider){
    //http://intengopear.com/
    $meanStateProvider.state('index', {
        url: '/',
        templateUrl: 'intengopear/views/index.html',
        resolve: {
          Project: 'Project'
        }
      });
    }
]).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });
  }
]);

//Override the users routes
angular.module('mean.users').factory('Project', ['$resource', function($resource){
 var survey_id = 20;
 var uid       = 2;

 var Project   = {
    'name' : 'ProjectService'
  }

  var ProjectResource   = $resource('http://dev.intengodev.com/api/pairwise/:survey_id/:uid', {survey_id:'@survey_id', uid:'@uid'},{ 
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET'},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  });
  var data              = ProjectResource.get({survey_id: survey_id, uid: uid});

  var QuestionsResource = $resource('api/questions', {question_id: '@question_id' },{ 
    'get':    {method:'GET', isArray: true},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  });

  var AnswerResource = $resource('api/answers', {question_id: '@question_id' },{ 
    'get':    {method:'GET', isArray: true},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  });
  
  Project.data          = data;
  Project.Resources     = {
    'Question'  : QuestionsResource,
    'Project'   : ProjectResource,
    'Answer'    : AnswerResource  
  }
  return Project;
}]);

//Setting up route
angular.module('mean.users').config(['$meanStateProvider', function($meanStateProvider) {
  $meanStateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'intengopear/views/admin.html',
    resolve: {
      Project: 'Project'
    }
  }); 

  //http://intengopear.com/#/20/questions
  $meanStateProvider.state('questions', {
    url: '/:survey_id/questions',
    templateUrl: 'intengopear/views/home.html',
    resolve: {
      Project: 'Project'
    }
  })
  .state('questions.edit', {
    url: '/:id/edit',
    templateUrl: 'intengopear/views/edit.html',
    resolve: {
      Project: 'Project'
    }
  });
}]);
