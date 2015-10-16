'use strict';

/* TODOS:
increment a win number for each answer on selection
increment a loss number for each answer on selection
add a loser id to the response object
*/

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
function IntengopearController ($scope, Global, Project, $state, $stateParams, users, loggedin){
	//When logging in use the MeanUser authentication "filter" method to redirect if not authed.
	console.log('loggedin: ', loggedin);
	if(typeof app !== 'undefined' && app.$scope.global.authenticated == false) window.location = '//intengopear.com/#/auth/login';

	var survey_id = 20;
	var uid       = 2;

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

	Project.data.$promise.then(function(data){
		$scope.question    	= {};

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
				var delay 				= Number(newQuestion.delay);
				var secondaryDelay 		= Number(newQuestion.secondaryDelay);

				newQuestion.secondaryDelay = secondaryDelay;
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

function IpController($scope, $stateParams, Ip, $sce){
	//TODO: Test this post message functionality
	window.addEventListener('message',function(evt){
		 $scope.augmentScope(evt);
	}, false);

	var IpResource  = Ip.http;
	var ipResource  = IpResource.query({ survey_id: $stateParams.survey_id, question_id:$stateParams.question_id }).$promise;
	var Project 	= app.Project;
	$scope.animationSpeed = 350;

	$scope.App 		= {};
	$scope.Ip 		= IpResource;

	$scope.pluckOne = function(collection){
		var answer; 
		var itemIdx = Math.floor(Math.random()*collection.length);

		answer = collection[itemIdx];
		//collection.splice(itemIdx, 1)
		//$scope.collection = collection;
		return answer;
	}

	$scope.augmentScope = function(evt) {
		if(event.origin.indexOf('intengo') < 0) return;
		var user_id 	= evt.data.user_id;
		var next_page 	= evt.data.next_page;
		
		$scope.user_id 	 = user_id;
		$scope.next_page = next_page;
	}

	$scope.init  	= function (){
		var startTime  		= new Date().getTime();
		$scope.answer1 		= $scope.pluckOne($scope.answers);
		$scope.answer1.text = $sce.trustAsHtml($scope.answer1.text);
		$scope.answer1.startTime = startTime;
		$scope.answer1.placement = 'left';

		$scope.answer2 		= $scope.pluckOne($scope.answers);
		$scope.answer2.text = $sce.trustAsHtml($scope.answer2.text);
		$scope.answer2.startTime = startTime;
		$scope.answer2.placement = 'right';

		$scope.pair    		= [$scope.answer1, $scope.answer2];
	}

	$scope.showShade = function(callback){
		$('body').append($('<div />', {
			class: "shade"
		}));

		$('.shade').animate({
			'bottom': '0%'
		}, ($scope.animationSpeed - 150), 'swing', callback);
	}

	$scope.hideShade = function(callback){
		$('.shade').animate({
			'bottom': '-100%'
		}, $scope.animationSpeed, function(){
			$(this).remove();
			if(typeof callback !== 'undefined') callback();
		});
	}

	$scope.dismissModal = function($modal, callback){
		$modal.animate({
		   top: '-100%'
		}, $scope.animationSpeed, function(){
			$scope.hideShade(callback);
		});
	}

	$scope.toggleIndecisionOptions = function($event){
		if(typeof $event  !== 'undefined') $event.preventDefault();
		
		if($('.shade').length > 0){
			$scope.dismissModal($('#indecisionOptions'));
			return;
		}

		$scope.showShade($scope.showIndecisionOptions);
	}

	$scope.showIndecisionOptions = function(){
		window.setTimeout(function(){
			var $indecision_options = $('#indecisionOptions');
			$indecision_options.show();
			$indecision_options.animate({
				top: '30%'
			}, $scope.animationSpeed);
		}, 150);
	}

	$scope.recordSelection 	= function($event){
		var target 			= $event.currentTarget;
		var data 			= $(target).data();
		$scope.selection    = $.extend({}, data);

		//If placement isnt set then capture it manually 
		if(typeof $scope.selection.placement == 'undefined'){
			$scope.selection.placement = {};
			$scope.selection.placement[$('.votebox.answers li:first a').data('answer_id')]   = 'left';
			$scope.selection.placement[$('.votebox.answers li:eq("1") a').data('answer_id')] = 'right';
		}

		//Get the alternate li element
		var $next 			= $(target).parent().next();
		var $link 			= $next.find('a');
		var answer_id 		= $link.data('answer_id');

		if(typeof answer_id == 'undefined' || answer_id.length == 0) {
			$next 			= $(target).parent().prev();
			$link 			= $next.find('a');
			answer_id 		= $link.data('answer_id');
		}
		$scope.selection.losing_answer_id = answer_id;

		$scope.selection.end_time = new Date().getTime();

		delete $scope.selection.$binding;
	}

	$scope.repopulateQuestion = function(){
		$('.votebox.answers').fadeOut(100, function(){
			$scope.answer1 	= $scope.pluckOne($scope.answers);
			$scope.answer1.placement = 'left';

			$scope.answer2 	= $scope.pluckOne($scope.answers);
			$scope.answer2.placement = 'right';

			if(typeof $scope.answer1 !== 'undefined' && typeof $scope.answer1.text !== 'object') $scope.answer1.text = $sce.trustAsHtml($scope.answer1.text);
			if(typeof $scope.answer2 !== 'undefined' && typeof $scope.answer2.text !== 'object') $scope.answer2.text = $sce.trustAsHtml($scope.answer2.text);

			$scope.pair 	= [$scope.answer1, $scope.answer2];
			$scope.$apply();

			$(this).fadeIn(100);
		});
	}

	//Capture's record the value and then transition to next state of question
	$scope.captureAnswerSelection     = function($event){
		$event.preventDefault();
		
		if(typeof $scope.timers == 'undefined'){
			var ttr = (($scope.question.delay * 60) * 1000); 		//Translate minutes to milliseconds
			if(typeof app.dev == 'undefined' || app.dev == true) ttr = (1000 * 10);
			startPrimaryTimer(ttr);
		}

		$scope.recordSelection($event);

		postSelection($scope.selection).then(function(resp){
			if($scope.answers.length === 0){
				window.parent.postMessage({'hash': $scope.next_page}, '*');
				//$scope.cancelTimers();
				return;
			} else {
				// console.log('repopulating question', resp);
				$scope.repopulateQuestion();
			}
		});
	}

	$scope.captureIndecisionSelection = function($event){
		$event.preventDefault();
		$scope.recordSelection($event);

		postSelection($scope.selection).then(function(resp){
			$scope.toggleIndecisionOptions();
			//repopulate question
			$scope.repopulateQuestion();
		});
	},

	$scope.cancelTimers = function(){
		$('.votebox li').fadeOut(100, function(){
			$(this).remove();
			angular.forEach($scope.timers, function(timerId, timerName, list){
				window.clearTimeout(timerId);
				delete $scope.timers[timerName];
			});
		});
	}

	function postSelection(selection){
		return $scope.Ip.save(selection).$promise;
	}

	function startPrimaryTimer(timeToRun){
		$scope.timers = $scope.timers || {};
		$scope.timers.primaryTimer = window.setTimeout(function(){
			$scope.showShade(function(){
				$('#confirmation').show().animate({
					top: '25%'
				});

			});
		}, timeToRun);
	}

	function startSecondaryTimer(timeToRun){
		$scope.timers = $scope.timers || {};
		$scope.timers.secondaryTimer = window.setTimeout(function(){
			$scope.showShade(function(){
				$('#secondaryConfirmation').show().animate({
					top: '25%'
				});

			});
		}, timeToRun);
	}

	$scope.advance = function($event){
		$event.preventDefault();
		var text   = $event.target.innerHTML.toLowerCase().trim();
		var modal  = $($event.target).parent().parent();

		$scope.dismissModal(modal, function(){
			if(text == "this is fun! i’d like to see more") {
				//$scope.repopulateQuestion();
				var ttr = (($scope.question.secondaryDelay * 60) * 1000);
				if(typeof app.dev == 'undefined' || app.dev == true) ttr = (1000 * 30);
				//if(typeof $scope.timers.secondaryTimer == 'undefined') 
				startSecondaryTimer(ttr);
			}
			if(text == "i don’t care for fun, let’s wrap this up") {
				console.log('going to new location', $scope.next_page);
				window.parent.postMessage({'hash': $scope.next_page}, '*');
			}

		});
	}


	//Get the values from the url first if present, else get it from localStorage,
    var survey_id 	= (localStorage.getItem('survey_id')) ? localStorage.getItem('survey_id') : survey_id;
    var question_id = (localStorage.getItem('question_id')) ? localStorage.getItem('question_id') : question_id;

 	$scope.App.data			= Project.Resources.Project.get({ survey_id: survey_id, uid: 2 });
 	$scope.App.data.$promise.then(function(resp){
 		resp.questions		= Project.Resources.Question.get({question_id: question_id});
		resp.answers		= Project.Resources.Answer.get({question_id: question_id});
		resp.question_id 	= question_id; 
 	});

 	var IpResource = Ip.http;
	var ipResource = IpResource.query({ survey_id: $stateParams.survey_id, question_id:$stateParams.question_id }).$promise;
	
	//Onclick getRandom answers and pop the selection off of the scope's answers
	ipResource.then(function(resp){
		$scope.question = resp.question;
		$scope.answers  = resp.answers;
		$scope.init();

		$scope.indecision_options = (typeof $scope.question.indecision_options !== 'undefined') ? $scope.question.indecision_options.split("\n") : [];
	});

	window.App 		= $scope.App;
}	

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$scope', 'Global', 'Project', '$state', '$stateParams', IntengopearController]);	
Intengopear.controller('QuestionController', ['$scope', '$state', '$stateParams', 'Global', 'Project', '$http', QuestionController ]);	
Intengopear.controller('AnswerController', ['$scope', '$stateParams', '$http', 'Global', AnswerController ]);	
Intengopear.controller('IpController', ['$scope', '$stateParams', 'Ip', '$sce', IpController ]);	
Intengopear.controller('IpAdminController', ['$scope', 'Global', 'Project', 'Intengopear', '$state', IpAdminController ]);	