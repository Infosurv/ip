'use strict';

angular.module('mean.questions').config(['$meanStateProvider', '$httpProvider', 'jwtInterceptorProvider', questionsRoutes]);

function questionsRoutes($meanStateProvider, $httpProvider, jwtInterceptorProvider) {
	$meanStateProvider.state('questions', {
	    url: '/:survey_id/questions',
	    controller: 'QuestionController',
	    templateUrl: 'intengopear/views/home.html'
  	})
  	.state('questions.edit', {
	    url: '/:id/edit',
	    controller: 'QuestionController',
	    templateUrl: 'intengopear/views/edit.html'
  	});
 }