'use strict';

/* jshint -W098 */
angular.module('mean.settings').controller('SettingsController', ['$scope', 'Global', 'Settings', settingsController]);

function settingsController($scope, Global, Settings){
    //console.log('settingsController');
    
	$scope.global           = Global;
    $scope.settings         = {};
    $scope.settings.status  = 'hidden';

	var settingsPromise = Settings.init();
    settingsPromise.then(function(settings){
        var settings            = settings[0]; 
    	$scope.settings         = settings;
        $scope.settings.status  = 'hidden';

    	$scope.$applyAsync();
    });

	$scope.updateAppSettings 	= function(evt){
		evt.preventDefault();
		var settings 			= (typeof $scope.settings !== 'undefined') ? $scope.settings : {};
		settings.appHost        = $scope.settings.appHost;

        if(typeof settings._id == 'undefined'){
            //console.log('saving');
    		Settings.AppSettings.save(settings).$promise.then(function(resp){
                $scope.settings = resp;
                Settings.updateUIStatus(resp.$promise.$$state, $scope);
    			//console.log(resp);
    		});
        } else {
            //console.log('updating');
            Settings.AppSettings.update(settings).$promise.then(function(resp){
                Settings.updateUIStatus(resp.$promise.$$state, $scope);                
                //console.log(resp);
            });
        }
	}
}