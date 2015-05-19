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

function IpAdminController($scope, Global, $timeout, $http, $location, Intengopear, $state){
	$scope.global 		= Global;
	$state.go('admin.home');	
	//if(! Global.isAdmin) $location.url('/logout');

	$scope.questions 	= [];
	var survey_id  		= 20;
	
	function init(){
		$http.get('http://dev.intengodev.com/api/pairwise/' + survey_id + '/3').then(function(res){
			$scope.data 		= res.data;
		}, 
		function(errorRes){
			console.error('Error while fetching data: ', errorRes);
		});

		$http.get('api/questions').then(function(res){
			$scope.questions = res.data;
			$timeout(function(){
				angular.element('.content').fadeIn(50);
			}, 500);
		}, 
		function(errorRes){
			console.error('Error while fetching data: ', errorRes);
		});
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

function AnswerController($scope, Global, Answer, $stateParams, $location, Intengopear){
	var $ 			= window.jQuery;
	var self 		= this;
	self.Answer 	= Answer;
	$scope.answers 	= Answer.query({});
	window.answers  = $scope.answers;
	$scope.textarea = $('textarea');
	$scope.values 	= '';
	$scope.loaded   = false;
	$scope.survey_id= 20;

	 function init(answers, targetToPopulate) {
	 	if($scope.loaded) return;
	 	console.log('init\'ing. ');
	 	$scope.loaded   = true;
	 	self.targetToPopulate = targetToPopulate;
	 	self.answers = answers;

	 	if(answers.length < 1) return;
	 	angular.forEach(answers, function(val, key){
	 		var _val 	= self.targetToPopulate.val();
	 		var newVal 	= _val + val.text + '\n';

	 		self.targetToPopulate.val(newVal);
	 	});
	 }  

	 $scope.$watch('answers.length', function(newValue, oldValue) {
	 	if(newValue === 0 || $scope.loaded) return;
 		if(! $scope.loaded) init($scope.answers, $scope.textarea);
	 });

	//Internal methods not exposed to the DOM
	$scope.createAnswer = function($event){
		$event.preventDefault();
		var values 		= $($event.currentTarget).parent().find('textarea').val().split('\n');
		var survey_id   = $($event.currentTarget).data('surveyid');
		var Answer 		= self.Answer;
		var data 		= [];
		console.log('data:', data);

		angular.forEach(values, function(val, key){
			data.push(new Answer({
				text: val
			}));
		});

		Answer.save({'answers': data});
	};

}

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$scope', 'Global', 'Intengopear', '$stateParams', IntengopearController]);	
Intengopear.controller('IpAdminController', ['$scope', 'Global', '$timeout', '$http', '$location', 'Intengopear', '$state', IpAdminController ]);	
Intengopear.controller('QuestionController', ['$scope', 'Global', '$http', '$timeout', '$location', 'Intengopear', QuestionController ]);	
Intengopear.controller('AnswerController', ['$scope', 'Global', 'Answer', '$stateParams', '$location', 'Intengopear', AnswerController ]);	
