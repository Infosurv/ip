'use strict';

angular.module('mean.intengopear').factory('Intengopear', [Intengopear]);
angular.module('mean.intengopear').factory('Settings', ['$resource', Settings]);
angular.module('mean.intengopear').factory('Project', ['$resource', '$q', 'Settings', ProjectService]);

function Intengopear(){
  return {
    name: 'Intengopear',
    isAuthed: function(opts){
      return opts.authenticated;
    }
  };
}

function Settings($resource) {
  var Settings        = {};
 
  Settings.AppSettings    = $resource('/api/settings/app', {}, { 
      'get':    {method:'GET', isArray: true },
      'save':   {method:'POST'},
      'update': {method: 'PUT'},
      'query':  {method:'GET'}
  });


  Settings.ProjectSettings  = $resource('/api/settings/survey/:survey_id', {survey_id: '@survey_id'}, { 
    'get':    {method:'GET', isArray: true},
    'save':   {method:'POST', params: {survey_id: '@survey_id', settins: '@settings'}},
    'update': {method: 'PUT'},
    'query':  {method:'GET'}
  });

  Settings.init = function(survey_id){
    var sid = (typeof survey_id !== 'undefined') ? survey_id : 0;

    if(sid == 0){
      //Fetch App Settings
      return Settings.AppSettings.get().$promise;
    } else {
      //Fetch survey settings
      return Settings.ProjectSettings.get({'survey_id' : sid }).$promise;
    }
  }

  Settings.updateUIStatus = function(promiseState, $scope){
    if(promiseState.status == 1){
        angular.element('.hidden').text('Your settings have been saved.');
        $scope.settings.status = 'success';
    } else {
        angular.element('.hidden').text('Oops, there was an error saving your settings.');
        $scope.settings.status = 'error';
    }
    window.setTimeout(function(){
      angular.element('.alert').fadeOut(500, function(){
        $(this).text('');
      });
    }, 4000);
  }

  return Settings;
}

function ProjectService($resource, $q, Settings){
  var ProjectResource, QuestionsResource, AnswerResource;
  window.app              = (typeof window.app !== 'undefined') ? window.app : {};
  app.AppPromise          = $q.defer();
  app.Project             = {
    'name' : 'ProjectService'
  };

  console.log('ProjectService Injected');

  //Fetch the App Settings
  Settings.init(0).then(function(settings){
    console.log('Settings.init : fetching global project settings');

    ProjectResource     = $resource(app.Project.getAppHost(settings) + ':survey_id/:uid', {survey_id:'@survey_id', uid:'@uid'},{ 
      'get':      {method:'GET'},
      'save':     {method:'POST'},
      'query':    {method:'GET'},
      'options':  {method:'GET'},
      'remove':   {method:'DELETE'},
      'delete':   {method:'DELETE'} 
    });

    QuestionsResource   = $resource('api/questions', {question_id: '@question_id' },{ 
      'get':    {method:'GET', isArray: true},
      'save':   {method:'POST'},
      'update': {method: 'PUT'},
      'query':  {method:'GET', isArray:true},
      'remove': {method:'DELETE'},
      'delete': {method:'DELETE'} 
    });

    AnswerResource      = $resource('api/answers', {question_id: '@question_id' },{ 
      'get':    {method:'GET', isArray: true},
      'update': {method: 'PUT'},
      'save':   {method:'POST'},
      'query':  {method:'GET', isArray:true},
      'remove': {method:'DELETE'},
      'delete': {method:'DELETE'} 
    });
  
    app.Project.Resources   = {
      'Question'  : QuestionsResource,
      'Project'   : ProjectResource,
      'Answer'    : AnswerResource  
    }
  });

  app.Project.init        = function($rootScope, Global){
    console.log('app.Project.init');

    var survey_id         = app.Project.getSurveyId($rootScope);
    
    Settings.init(survey_id).then(function(settings){
        console.log('app.Project.init Settings.init fetching data for project: ', survey_id);

        var settings        = settings[0];
        $rootScope.settings = settings;
        app.settings        = settings;
        app.host            = settings.appHost; 

        $rootScope.settings.status  = 'hidden';

        angular.element('input').focus();

        var uid             = 2;
        
        var projectPromise  = app.Project.Resources.Project.get({survey_id: survey_id, uid: uid}).$promise;
        projectPromise.then(function(resp){
          $rootScope.data       = resp;
          $rootScope.surveys    = resp.surveys;
          app.AppPromise.resolve(resp);
        });
    });

    return app.AppPromise.promise;
  };

  app.Project.getSurveyId = function($scope){
    if(typeof $scope.survey_id == 'undefined' ) return 0; //Initial Load on the home screen since no project is selected
    if(typeof $scope.survey_id !== 'undefined') return $scope.survey_id;
  }

  app.Project.getAppHost  = function(settings){
    var settings          = settings[0];
    return (typeof settings.appHost !== 'undefined') ? settings.appHost + '/api/pairwise/' : 'http://www.intengodev.com/api/pairwise/';
  };

  window.findById         = function(collection, id){
    var item;

    angular.forEach(collection, function(elem, idx){
      if(id === elem._id) item = collection[idx];
    });

    return item;
  }
  
  return app.Project;
}
