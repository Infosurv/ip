'use strict';

//Define the module
var Intengopear = angular.module('mean.intengopear', []);

//Controller Definitions
function IntengopearController ($scope, Global, Intengopear, $stateParams){
    $scope.global = Global;
    $scope.package = {
      name: 'intengopear'
    };
}

function IpAdminController($scope, Global, Project, Intengopear, $state){
	$scope.global 		= Global;
	$scope.data 		= Project.data;
	$scope.questions 	= Project.questions;

	function init(){
		$scope.loaded = true;
		$state.go('admin.questions');	
	}

	init();
}

function QuestionController($scope, Global, $http, $timeout, $location, Intengopear){
	var timeout			= null;
	var saveInProgress 	= false;

	var saveFinished 	= function() { saveInProgress = false; };
	var $ 				= angular.element;

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
			$(alert).fadeToggle(100, function(){
				$('#questionForm').fadeToggle(100);
			});
		} else {
			$('#questionForm').fadeToggle(100);
		}
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
		$event.preventDefault();

		$http.delete('/questions/'+ question_id).then(function(){
			$($event.currentTarget).parent().parent().parent().remove();
		});
	};

	//Internal methods not exposed to the DOM
	function createQuestion($http, question, survey_id){
		question.survey_id = survey_id;
		console.log('createQuestion', question);
		var req = $http.post('/questions', question);

		return req;
	}

	function updateQuestion($http, $event){
		var question = $scope.question;
		console.log('updating question ', question._id);

		var req = $http.post('/questions/' + question._id, question);

		return req;
	}

	//Watcher for input: handles saving the question after 1 sec after input change
	$scope.$watch('question.description', function(newValue, oldValue) {
	  if(typeof newValue === 'undefined' || typeof oldValue === 'undefined') return;

	  //If one time sequence has elapsed recalculate
	  if(typeof $scope.T1 === 'number' && typeof $scope.T2 === 'number') $scope.T1 = $scope.T2; 

	  //If there is no current timer then start one.
	  if(typeof $scope.T1 !== 'number') {
	  	$scope.T1 = (new Date().getSeconds()); //time in seconds
	  } else {
	  	$scope.T2 = (new Date().getSeconds()); //time in seconds for later time
	  	var secondsPassed = ($scope.T2 - $scope.T1);
	  	if(secondsPassed > 2) updateQuestion($http);
	  }
	});
}

function AnswerController($scope, $stateParams, Global, Answer, Project, Intengopear){
	var $ 			= window.jQuery;
	var self 		= this;
	self.Answer 	= Answer;
	$scope.answers 	= Answer.query({id: $stateParams.id});
	$scope.textarea = $('textarea');
	$scope.values 	= '';
	
	$scope.$stateParams = $stateParams;

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
		$scope.survey_id	= Project.data.survey.id;
		$scope.question_id	= $scope.$stateParams.id;
		var Answer 			= self.Answer;
		var data 			= [];

		/*
		Test answer 1 for question 1
		Test answer 2 for question 1
		*/
		angular.forEach(values, function(val, key){
			if(val.length === 0) return;
			data.push(new Answer({
				survey_id: Project.data.survey.id,
				text: val,
				question_id: $scope.question_id
			}));
		});

		appendToAnswersList(data, $('#answers.list-group'));
		Answer.save({'answers': data});
	};

}

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$scope', 'Global', 'Intengopear', '$stateParams', IntengopearController]);	
Intengopear.controller('IpAdminController', ['$scope', 'Global', 'Project', 'Intengopear', '$state', IpAdminController ]);	
Intengopear.controller('QuestionController', ['$scope', 'Global', '$http', '$timeout', '$location', 'Intengopear', QuestionController ]);	
Intengopear.controller('AnswerController', ['$scope', '$stateParams', 'Global', 'Answer', 'Project', 'Intengopear', AnswerController ]);	
