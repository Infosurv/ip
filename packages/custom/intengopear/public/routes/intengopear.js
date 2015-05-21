'use strict';

angular.module('mean.users').factory('Project', ['$resource', function($resource){
 var survey_id = 20;
 var uid       = 3;

 var Project   = {
    'name' : 'ProjectService'
  }

  var ProjectResource   = $resource('http://dev.intengodev.com/api/pairwise/:survey_id/:uid', {survey_id:'@survey_id', uid:'@uid'},{ 
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  });
  var data              = ProjectResource.get({survey_id: 20,uid: 3});

  var QuestionsResource = $resource('api/questions', {},{ 
    'get':    {method:'GET', isArray: true},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  });
  var questions         = QuestionsResource.get();

  Project.data          = data;
  Project.questions     = questions;
  return Project;
}]);

//Setting up route
angular.module('mean.users').config(['$meanStateProvider', function($meanStateProvider) {
  $meanStateProvider.state('admin', {
    templateUrl: 'intengopear/views/admin.html',
    resolve: {
      Project: 'Project'
    }
  })
  .state('admin.questions', {
    url: '/admin',
    templateUrl: 'intengopear/views/home.html'
  })
  .state('admin.questions.edit', {
    url: '/:id/edit',
    templateUrl: 'intengopear/views/edit.html'
  });
}
]);

angular.module('mean.intengopear').config(['$meanStateProvider', function($meanStateProvider) {
    
  }
]);

