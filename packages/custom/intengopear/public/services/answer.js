'use strict';

angular.module('mean.intengopear').factory('Answer', ['$resource', 
	function($resource){
		var Answer = $resource('/api/answers', {},{ 
			'get':    {method:'GET'},
			'save':   {method:'POST'},
			'query':  {method:'GET', isArray:true},
			'remove': {method:'DELETE'},
			'delete': {method:'DELETE'}
		});

		return Answer;
	}
]);
