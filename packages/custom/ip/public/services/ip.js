'use strict';

angular.module('mean.ip').factory('Ip', ['$http', function($http) {
	
	return {
		http: $http,
		name: 'ip',
		postDataPacket: function($event){
			var dataPacket = this.recordSelection($event);
			this.http.post('http://intengopear.com/api/ip', dataPacket).success(function(resp, status, headers, config){
				console.log('success: ', resp);
			}).error(function(resp, status, headers, config){
				console.error('error: ', resp);
			});
		},	

		recordSelection: function($event){
			var dataPacket  		= {};
			dataPacket.survey_id 	= $($event.currentTarget).data('survey_id');
			dataPacket.question_id 	= $($event.currentTarget).data('question_id');
			dataPacket.answer_id 	= $($event.currentTarget).data('answer_id');
			dataPacket.user_id 		= $($event.currentTarget).data('user_id');

			
			return dataPacket;
		}
	}
}]);
