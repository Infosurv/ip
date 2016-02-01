'use strict';

var Intengopear = angular.module('mean.intengopear');

Intengopear.controller('QuestionController', ['$scope', '$state', '$stateParams', 'Global', 'Project', '$http', QuestionController]);	

function QuestionController($scope, $state, $stateParams, Global, Project, $http){
	Global.survey_id 	= $stateParams.survey_id;
	var projectPromise 	= Project.init($scope, Global);
    
	var survey_name, survey_id = $stateParams.survey_id;
	$scope.stateParams  = $stateParams;
	Project.data 		= app.Project.data;
    $scope.data 		= Project.data;
    $scope.question_id  = $stateParams.id;

    if(typeof survey_id !== 'undefined') localStorage.setItem('survey_id', survey_id);
    if(window.location.href.indexOf('new') >= 0){ 
    	var open = window.location.href.split('?')[1];
    	if(open == 'new=true') {
    		jQuery('document').ready(function(){
    			window.setTimeout(function(){
		    		var $elem = jQuery('#addQuestion');
		    		$elem.click();
	    		}, 1000);
    		});
    	}
    }

	projectPromise.then(function(data){
		Project.data 			= data; 
		$scope.question 		= {};

		//Retrieve the cached the survey name and id for reload
	    survey_id 				= (localStorage.getItem('survey_id')   !== null && localStorage.getItem('survey_id')   !== 'undefined' && localStorage.getItem('survey_id').length > 0) ? localStorage.getItem('survey_id') : $stateParams.survey_id;
	    survey_name 			= (localStorage.getItem('survey_name') !== null && localStorage.getItem('survey_name') !== 'undefined' && localStorage.getItem('survey_name').length > 0) ? localStorage.getItem('survey_name') : data.survey.name;
	    
		$scope.data.survey 		= data.survey;
		$scope.survey_name  	= survey_name;

		var questionPromise = app.Project.Resources.Question.get({ survey_id: survey_id }).$promise;
		questionPromise.then(function(questions){
		   $scope.questions = window.questions = Project.questions = questions;
		   
		   Project.data.survey.questions = $scope.questions;

		    //Populates the values of the question to edit
			$scope.$watch('stateParams.id', function(newValue, oldValue){
			  if(typeof $stateParams.id == 'undefined' || typeof newValue === 'undefined') return;
			  $scope.question = findById(questions, $scope.stateParams.id);

			  if(typeof $scope.question.indecision_options == 'string') $scope.question.indecision_options = $scope.question.indecision_options.split(",").join("\n").trim();
			  
			  $scope.question.delay 				= $scope.delay = (typeof $scope.question.delay == 'undefined') ? 5000 : $scope.question.delay;  
			  $scope.question.secondaryDelay 		= $scope.secondaryDelay = (typeof $scope.question.secondaryDelay == 'undefined') ? 2500 : $scope.question.secondaryDelay;  
			});
		});
	});
	
	var $ 				= angular.element; //jQuery Alias

	$scope.iframeBase 	= ''

	$scope.selectQuestion = function(evt){
		$('#questions .selected').removeClass('selected');
		$(evt.currentTarget).parent().parent().parent().addClass('selected');
	}

	$scope.displayMessage = function(status, message){
		var klass = (status == 'success') ? 'alert-success' : 'alert-error';
		$('#msg').removeAttr('class');
		$('#msg').addClass(klass);

		$('#msg p').text(message);
		$('#msg').fadeIn(100);
	};

	//Publicly callable handlers from the dom
	$scope.toggleQuestionForm = function($event){
		$event.preventDefault();
		var $alert = $('#noQuestionsMessage');

		var button = $($event.currentTarget).find('span');
		if(button.hasClass('glyphicon-plus-sign')) {
			button.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
		} else {
			if(button.hasClass('glyphicon-minus-sign')) button.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
		}

		if($alert.is(':visible')){
			$alert.fadeToggle(100, function(){
				$('#questionForm').fadeToggle(100);
			});
		} else {
			$('#questionForm').fadeToggle(100);
		}
	};

	$scope.copyIframe = function($event, questionId){
		$event.preventDefault();
		var project_id 		= localStorage.getItem('survey_id');
		var question_id 	= questionId;
		// var iframeBaseUrl 	= 'http://intengopear.com/' + project_id + '/' + question_id;
		var iframeBaseUrl 	= 'http://cnn.com';
		var html 			= $('.tpl').html().trim();
		var iframe = document.createElement('iframe');
		iframe.src = iframeBaseUrl;
		
		$('.sandbox').html('').html(iframe);
		
		$('.sandbox').fadeIn(100, function(){
			//Finish this code
		});		
	};

	$scope.addQuestion = function($event){
		$event.preventDefault();
		var question = $scope.newQuestion;
		var li = $('<li />', {
			text: question.description,
			class: 'clearfix list-group-item'
		});
		$('#questions').append(li);

		createQuestion($http, $scope.newQuestion, $scope.data.survey.id);
	};

	$scope.deleteQuestion = function($event, question_id){
		console.log('deleteQuestion');
		$event.preventDefault();

		$http.delete('/api/questions/'+ question_id).then(function(){
			$($event.currentTarget).parent().parent().parent().remove();
		});
	};

	$scope.update = function($event, idx){
		if(typeof window.questionTimer !== 'undefined') {
			window.clearTimeout(window.questionTimer);
		}
		$scope.evt = $event;

		window.questionTimer = window.setTimeout(function(){
			var question;
			//text not updating for description. $scope value is incorrect

			if(typeof idx === 'undefined'){
				question = $scope.question;
				// var delay 				= Number(newQuestion.delay);
				// var secondaryDelay 		= Number(newQuestion.secondaryDelay);
				// var indecision_options  = $scope.question.indecision_options;

				// newQuestion.secondaryDelay = secondaryDelay;
				// newQuestion.delay = delay;
			} else {
				question = questions[idx];
			}

			var updatePromise = app.Project.Resources.Question.update(question).$promise;
			updatePromise.then(function(question){
				$scope.displayMessage('success', 'Your question has been updated!');
			});

		}, 1000);
		//var req = $http.post('/api/questions/' + question._id, question);
	}

	//Internal methods not exposed to the DOM
	function createQuestion($http, question, survey_id){
		question.survey_id = survey_id;

		var req = $http.post('/api/questions', question);
		return req;
	}
}
