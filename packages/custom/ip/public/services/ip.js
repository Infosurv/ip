'use strict';

angular.module('mean.ip').factory('Ip', ['$resource', '$stateParams', function($resource, $stateParams) {
	function getHost(){
		var host = (window.location.host.indexOf('dev') > -1 || window.location.host.indexOf('pear') > -1) ? 'http://intengopear.com' : 'http://ideas.intengoresearch.com';
	  	return host;
	}

	var IpResource   = $resource(getHost() + '/api/ip/:survey_id/:question_id', {survey_id:'@survey_id', question_id:'@question_id'},{ 
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET'},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  	});
	
	return {
		name: 'ip',
		http: IpResource,
		postDataPacket: function($event){
			var dataPacket = this.recordSelection($event);
			this.http.post(getHost() + '/api/ip', dataPacket).success(function(resp, status, headers, config){
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
