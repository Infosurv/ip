'use strict';

//Public facing app


/* jshint -W098 */
angular.module('mean.ip').controller('IpController', ['$scope', '$resource', 'Global', 'Project', 'Ip', function($scope, $resource, Global, Project, Ip) {
	$scope.global 	= Global;
    $scope.package 	= {
      name: 'ip'
    };
	$scope.App 		= {};
	$scope.Ip 		= Ip;

	//Get the values from the url first if present, else get it from localStorage,
    var survey_id 	= (localStorage.getItem('survey_id')) ? localStorage.getItem('survey_id') : survey_id;
    var question_id = (localStorage.getItem('question_id')) ? localStorage.getItem('question_id') : question_id;

 	$scope.App.data			= Project.Resources.Project.get({ survey_id: survey_id, uid: 2 });
 	$scope.App.data.$promise.then(function(resp){
 		resp.questions		= Project.Resources.Question.get({question_id: question_id});
		resp.answers		= Project.Resources.Answer.get({question_id: question_id});
		resp.question_id 	= question_id; 
 	});

	window.App 		= $scope.App;
 }]);
