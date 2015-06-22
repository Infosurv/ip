'use strict';

//Override the home routes
//Setting up route
angular.module('mean.system').config(['$meanStateProvider', '$urlRouterProvider', function($meanStateProvider, $urlRouterProvider){
    $meanStateProvider
      .state('index', {
        url: '/',
        templateUrl: 'intengopear/views/index.html',
        resolve: {
          Project: 'Project'
        }
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

  
  Project.data          = data;
  Project.Resources     = {
    'Question'  : QuestionsResource,
    'Project'   : ProjectResource
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
    
  $meanStateProvider.state('questions', {
    url: '/questions',
    templateUrl: 'intengopear/views/home.html'
  })
  .state('questions.edit', {
    url: '/:id/edit',
    templateUrl: 'intengopear/views/edit.html'
  });
}
]);

angular.module('mean.intengopear').config(['$meanStateProvider', function($meanStateProvider) {
    
  }
]);
