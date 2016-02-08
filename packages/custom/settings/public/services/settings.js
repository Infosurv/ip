'use strict';

angular.module('mean.settings').factory('Settings', ['$resource', Settings]);


function Settings($resource) {
	var Settings 				= {};
 
	Settings.AppSettings 		= $resource('/api/settings/app', {}, { 
	    'get':    {method:'GET', isArray: true },
	    'save':   {method:'POST'},
	    'update': {method: 'PUT'},
	    'query':  {method:'GET'}
  });


	Settings.ProjectSettings 	= $resource('/api/settings/survey/:survey_id', {survey_id: '@survey_id'}, { 
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