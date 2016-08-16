'use strict';

var Intengopear = angular.module('mean.intengopear');

Intengopear.controller('AnswerController', ['$scope', '$stateParams', '$http', 'Global', AnswerController ]);

function AnswerController($scope, $stateParams, $http, Global){
	//console.log('AnswerController');

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
		$scope.survey_id	= $scope.data.survey.id;
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
				survey_id: $scope.data.survey.id,
				text: val,
				question_id: $scope.question_id
			}));
		});

		appendToAnswersList(data, $('#answers.list-group'));
		var savedAnswers = Answer.save({'answers': data}).$promise.then(function(res){
			var r = res;
			if(r.status == 'saved'){
				$('#msg').find('p').text('Answers Added').parent().fadeIn(100, function(){
					$('#answersForm textarea:first').val('');
					setTimeout(function(){
						$('#msg').fadeOut(100, function(){
							$(this).find('p').text('');
						});
					}, 1500);
				});
			}
		});
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
