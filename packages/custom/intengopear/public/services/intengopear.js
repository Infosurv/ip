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
  };

  Project.init = function($scope, Global){
    var survey_id = Project.getSurveyId(Global);
    var uid       = 2;

    window.app          = (typeof window.app !== 'undefined') ? window.app : {};
    app.Project         = Project;

    app.$scope          = $scope;
    app.$scope.global   = Global;
    app.$scope.data     = Project.data = Project.Resources.Project.get({survey_id: survey_id, uid: uid});

    window.findById = function(collection, id){
      var item;

      angular.forEach(collection, function(elem, idx){
        if(id === elem._id) item = collection[idx];
      });

      return item;
    }
  };

  Project.getSurveyId = function(Global){
    if(typeof Global.survey_id == 'undefined' ) return 20; //Initial Load on the home screen since no project is selected
    if(typeof Global.survey_id !== 'undefined') return Global.survey_id;
  }

  var ProjectResource   = $resource('http://www.intengodev.com/api/pairwise/:survey_id/:uid', {survey_id:'@survey_id', uid:'@uid'},{ 
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
