'use strict';

angular.module('mean.settings').factory('Settings', ['$resource', Settings]);


function Settings($resource) {
	var Settings 				= {};
 
	Settings.AppSettings 		= $resource('/api/settings/app', {}, { 
	    'get':    {method:'GET'},
	    'save':   {method:'POST'},
	    'update': {method: 'PUT'},
	    'query':  {method:'GET'}
  	});

  	/*
	'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  	*/

  	Settings.ProjectSettings 	= $resource('/api/settings/survey/:survey_id', {survey_id: '@survey_id'}, { 
	    'get':    {method:'GET'},
	    'save':   {method:'POST'},
	    'update': {method: 'PUT'},
	    'query':  {method:'GET'}
  	});

  	Settings.init = function(survey_id){
  		var sid = (typeof survey_id == 'number') ? survey_id : 0;

  		if(sid == 0){
  			//Fetch App Settings
  			return Settings.AppSettings.get().$promise;
  		} else {
  			//Fetch survey settings
  			return Settings.ProjectSettings.get({'survey_id' : sid }).$promise;
  		}
  	}

	return Settings;
}