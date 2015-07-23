'use strict';

angular.module('mean.ip').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('ip', {
	    url: '/ip',
	    templateUrl: 'ip/views/index.html'
  	});
}]);
