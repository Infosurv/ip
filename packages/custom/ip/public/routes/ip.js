'use strict';

angular.module('mean.ip').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('ip', {
	    url: '/ip/:survey_id/:question_id',
	    templateUrl: 'ip/views/index.html'
  	});
}]);
