'use strict';

angular.module('mean.intengopear').factory('Intengopear', [function() {
    return {
      name: 'Intengopear',
      isAuthed: function(opts){
      	return opts.authenticated;
      }
    };
  }
]);

angular.module('mean.intengopear').factory('Project', ['$resource', function($resource){
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
  

  var QuestionsResource = $resource('api/questions', {question_id: '@question_id' },{ 
    'get':    {method:'GET', isArray: true},
    'save':   {method:'POST'},
    'update': {method: 'PUT'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  });

  var AnswerResource = $resource('api/answers', {question_id: '@question_id' },{ 
    'get':    {method:'GET', isArray: true},
    'update': {method: 'PUT'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  });
  
  Project.Resources     = {
    'Question'  : QuestionsResource,
    'Project'   : ProjectResource,
    'Answer'    : AnswerResource  
  }
  return Project;
}]);
