'use strict';

/* jshint -W098 */
angular.module('mean.settings').controller('SettingsController', ['$scope', 'Global', 'Settings', settingsController]);

function settingsController($scope, Global, Settings){
	$scope.global = Global;
	
	$scope.updateAppSettings = function(evt){
		evt.preventDefault();
		debugger;
	}
}