'use strict';

var Intengopear = angular.module('mean.intengopear');

Intengopear.controller('IpController', ['$scope', 'Project', 'Global', '$stateParams', 'Ip', '$sce', IpController ]);	
Intengopear.controller('IpAdminController', ['$scope', 'Global', 'Project', 'Intengopear', '$state', IpAdminController ]);	

function IpAdminController($scope, Global, Project, Intengopear, $state){
	$scope.global 		= Global;
}

function IpController($scope, Project, Global, $stateParams, Ip, $sce){
	Project.init($scope, Global);

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

	$scope.getStartTime = function(){
		return new Date().getTime();
	}

	$scope.init  	= function (){
		console.log('IpController:init');

		var startTime  		= $scope.getStartTime();
		$scope.answer1 		= $scope.pluckOne($scope.answers);
		$scope.answer1.text = $sce.trustAsHtml($scope.answer1.text);
		$scope.answer1.startTime = startTime;
		
		console.log('A1 startTime', startTime);
		$scope.answer1.placement = 'left';

		$scope.answer2 		= $scope.pluckOne($scope.answers);
		$scope.answer2.text = $sce.trustAsHtml($scope.answer2.text);
		$scope.answer2.startTime = startTime;

		console.log('A2 startTime', startTime);
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

		$scope.selection.end_time = $scope.getStartTime();
		console.log('selection: ', $scope.selection);

		delete $scope.selection.$binding;
	}

	$scope.repopulateQuestion = function(){
		$('.votebox.answers').fadeOut(100, function(){
			$scope.answer1 	= $scope.pluckOne($scope.answers);
			$scope.answer1.startTime = $scope.getStartTime();
			$scope.answer1.placement = 'left';

			$scope.answer2 	= $scope.pluckOne($scope.answers);
			$scope.answer2.startTime = $scope.getStartTime();
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