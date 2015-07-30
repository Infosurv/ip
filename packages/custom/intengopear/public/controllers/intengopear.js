'use strict';

//Global methods - maybe need to scope these to an app object or something
function findById(collection, id){
	var item;

	angular.forEach(collection, function(elem, idx){
		if(id === elem._id) item = collection[idx];
	});

	return item;
}

//Define the module
var Intengopear = angular.module('mean.intengopear', []);

//Controller Definitions
function IntengopearController ($scope, Global, Project, $state, $stateParams){
	console.log('IntengopearController');
	var survey_id = 20;
	var uid       = 2;

	//if(! Intengopear.isAuthed(Global))  $location.url('/login'); //#TODO: finish this
    window.app          = {};
    app.Project         = Project;
    app.$scope          = $scope;
    app.$scope.global   = Global;
    app.$scope.data 	= Project.data = Project.Resources.Project.get({survey_id: survey_id, uid: uid});

    app.$scope.surveys  = app.$scope.data.surveys;
    
    $scope.package = {
      name: 'intengopear'
    };
}

function IpAdminController($scope, Global, Project, Intengopear, $state){
	$scope.global 		= Global;
}

function QuestionController($scope, $state, $stateParams, Global, Project, $http){
	var survey_name, survey_id = $stateParams.survey_id;
	$scope.stateParams  = $stateParams;

	Project.data 		= app.Project.data;
    $scope.data 		= Project.data;

    if(typeof survey_id !== 'undefined') localStorage.setItem('survey_id', survey_id);

	Project.data.$promise.then(function(data){
		$scope.question    	= {};
		console.log('QuestionController Loaded');
		//Retrieve the cached the survey name and id for reload
	    survey_id 		= (localStorage.getItem('survey_id')   !== null && localStorage.getItem('survey_id')   !== 'undefined' && localStorage.getItem('survey_id').length > 0) ? localStorage.getItem('survey_id') : $stateParams.survey_id;
	    survey_name 	= (localStorage.getItem('survey_name') !== null && localStorage.getItem('survey_name') !== 'undefined' && localStorage.getItem('survey_name').length > 0) ? localStorage.getItem('survey_name') : $scope.data.survey.name;

		$scope.survey_name  = survey_name;
		app.Project.Resources.Question.get({ survey_id: survey_id }).$promise.then(function(questions){
		   $scope.questions = window.questions = Project.questions = questions;
		   Project.data.survey.questions = $scope.questions;

		    //Populates the values of the question to edit
			$scope.$watch('stateParams.id', function(newValue, oldValue){
			  if(typeof $stateParams.id == 'undefined' || typeof newValue === 'undefined') return;
			  $scope.question = findById(questions, $scope.stateParams.id);
			  $scope.question.delay = $scope.delay = (typeof $scope.question.delay == 'undefined') ? 5000 : $scope.question.delay;  
			});
		});
	});
	
	var $ 				= angular.element; //jQuery Alias

	$scope.iframeBase 	= ''

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
		if(typeof window.questionTimer !== 'undefined') window.clearTimeout(window.questionTimer);
		$scope.evt = $event;

		window.questionTimer = window.setTimeout(function(){
			var newQuestion;

			if(typeof idx === 'undefined'){
				newQuestion = findById(questions, $scope.stateParams.id);
				var delay = Number($($scope.evt.currentTarget).parent().find('#questionDelay input').val());
				newQuestion.delay = delay;

			} else {
				newQuestion = questions[idx];
			}

			return app.Project.Resources.Question.update(newQuestion);
		}, 1000);
		//var req = $http.post('/api/questions/' + question._id, question);
	}

	//Internal methods not exposed to the DOM
	function createQuestion($http, question, survey_id){
		question.survey_id = survey_id;
		console.log('createQuestion', question);
		var req = $http.post('/api/questions', question);

		return req;
	}
}

function AnswerController($scope, $stateParams, $http, Global){
	console.log('AnswerController');

	var $ 				= window.jQuery;
	var self 			= this;
	self.Answer 		= app.Project.Resources.Answer;
	var Answer 			= self.Answer;
	$scope.answers 		= window.answers = Answer.query({id: $stateParams.id});
	$scope.stateParams 	= $stateParams;
	
	function appendToAnswersList(data, target){
		angular.forEach(data, function(val, key){
			var input = $('<input />', {
				value: val.text,
				class: 'answer',
				type: 'text'
			});

			input.attr('ng-model', 'answer.text');

			var li = $('<li />', {
				html: input,
				class: 'clearfix list-group-item'
			});
			
			//make an li
			target.append(li);
		});
	}

	//Public methods
	$scope.toggleAnswerForm = function($event){
		$event.preventDefault();
		var $alert = $('#noAnswerMessage');

		var button = $($event.currentTarget).find('span');
		if(button.hasClass('glyphicon-plus-sign')) {
			button.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
		} else {
			if(button.hasClass('glyphicon-minus-sign')) button.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
		}

		if($alert.is(':visible')){
			$(alert).fadeToggle(100, function(){
				$('#answersForm').fadeToggle(100);
			});
		} else {
			$('#answersForm').fadeToggle(100);
		}
	};

	$scope.createAnswer = function($event){
		$event.preventDefault();

		var values 			= $($event.currentTarget).parent().find('textarea').val().split('\n');
		$scope.survey_id	= app.Project.data.survey.id;
		$scope.question_id	= $scope.stateParams.id;
		var Answer 			= self.Answer;
		var data 			= [];

		/*
		Test answer 1 for question 1
		Test answer 2 for question 1
		*/
		angular.forEach(values, function(val, key){
			if(val.length === 0) return;
			data.push(new Answer({
				survey_id: app.Project.data.survey.id,
				text: val,
				question_id: $scope.question_id
			}));
		});

		appendToAnswersList(data, $('#answers.list-group'));
		Answer.save({'answers': data});
	};

	$scope.deleteAnswer = function($event, answer_id){
		$event.preventDefault();
		$($event.target).parent().parent().parent().parent().fadeOut(100, function(){
			$(this).remove();
			Answer.remove(answers[answer_id]);
		});
	}

	$scope.update = function(idx){
		if(typeof window.answerTimer !== 'undefined') window.clearTimeout(window.answerTimer);

		window.answerTimer = window.setTimeout(function(){
			var newAnswer  = answers[idx];
			return Answer.update(newAnswer);
		}, 1000);
	}
}

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$scope', 'Global', 'Project', '$state', '$stateParams', IntengopearController]);	
Intengopear.controller('IpAdminController', ['$scope', 'Global', 'Project', 'Intengopear', '$state', IpAdminController ]);	
Intengopear.controller('QuestionController', ['$scope', '$state', '$stateParams', 'Global', 'Project', '$http', QuestionController ]);	
Intengopear.controller('AnswerController', ['$scope', '$stateParams', '$http', 'Global', AnswerController ]);	
