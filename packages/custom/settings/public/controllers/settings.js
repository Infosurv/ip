'use strict';

/* jshint -W098 */
angular.module('mean.settings').controller('SettingsController', ['$scope', 'Global', 'Settings', settingsController]);

function settingsController($scope, Global, Settings){
	$scope.global = Global;
	
	var settingsPromise = Settings.init();
    settingsPromise.then(function(settings){
    	$scope.appHost = settings.host;
    	$scope.$applyAsync();
    });

	$scope.updateAppSettings 	= function(evt){
		evt.preventDefault();
		var settings 			= {};
		settings.appHost 		= $scope.appHost;

		Settings.AppSettings.save(settings).$promise.then(function(resp){
			console.log(resp);
		});
	}
}