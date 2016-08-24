'use strict';

var Intengopear = angular.module('mean.intengopear');

Intengopear.controller('IpController', ['$scope', 'Settings', 'Project', 'Global', '$stateParams', 'Ip', '$sce', IpController]);	
Intengopear.controller('IpAdminController', ['$scope', 'Global', 'Project', 'Intengopear', '$state', IpAdminController]);	

function IpAdminController($scope, Global, Project, Intengopear, $state){
	$scope.global 		= Global;
}

function IpController($scope, Settings, Project, Global, $stateParams, Ip, $sce){
	//console.log('IpController');

	if(typeof $stateParams.survey_id == 'undefined') return;
	$scope.survey_id = $stateParams.survey_id;
	
	//Using postMessage to communicate with the intengo core app
	window.addEventListener('message',function(evt){
		 $scope.augmentScope(evt);
	}, false);

	function getRandomItem(collection){
		var idx 	= Math.floor(Math.random() * collection.length);
		
		return idx;
	}

	$scope.pluckOne = function(collection){
		var answer; 
		var itemIdx = getRandomItem(collection);

		answer = collection[itemIdx];
		//collection.splice(itemIdx, 1)
		//$scope.collection = collection;
		return answer;
	}

	$scope.augmentScope  = function(evt) {
		if(evt.origin.indexOf('intengo') < 0) return;
		var data 		 = JSON.parse(evt.data);

		var user_id 	 = data.user_id;
		var next_page 	 = data.next_page;
		
		$scope.user_id 	 = user_id;
		$scope.next_page = next_page;

		console.log('user_id: ' + $scope.user_id);
		$scope.$apply();
	}

	$scope.getStartTime = function(){
		return new Date().getTime();
	}

	$scope.init  	= function (){
		var startTime  		= $scope.getStartTime();
		$scope.answer1 		= $scope.pluckOne($scope.answers);
		$scope.answer1.startTime = startTime;
		
		//console.log('A1 startTime', startTime);
		$scope.answer1.placement = 'left';
		// console.log('intial item id: ', $scope.answer1._id, ' placement: ', $scope.answer1.placement);

		$scope.answer2 		= $scope.pluckOne($scope.answers);
		$scope.answer2.startTime = startTime;

		//console.log('A2 startTime', startTime);
		$scope.answer2.placement = 'right';

		//Compare to make sure the 2 answers are different
		if($scope.answer1.text.toLowerCase() == $scope.answer2.text.toLowerCase()){
			$scope.answer2 = $scope.pluckOne($scope.answers);
		}

		// console.log('initial item id: ', $scope.answer2._id, ' placement: ', $scope.answer2.placement, "\n\n");
		$scope.answer1.text = $sce.trustAsHtml($scope.answer1.text);
		$scope.answer2.text = $sce.trustAsHtml($scope.answer2.text);

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

	//Capture's record the value and then transition to next state of question
	$scope.captureAnswerSelection     = function($event){
		$event.preventDefault();

		if(typeof $scope.timers == 'undefined'){
			var ttr = (($scope.question.delay * 60) * 1000); 		//In minutes: translates milliseconds to minutes
			startPrimaryTimer(ttr);
		}

		$scope.recordSelection($event);
		// console.log('selection after recordSelection: ', $scope.selection, "\n\n");
		$($event.target).blur();

		postSelection($scope.selection).then(function(resp){
			delete $scope.selection;
			if($scope.answers.length === 0){
				window.parent.postMessage($scope.next_page, '*');
				return;
			} else {
				$scope.repopulateQuestion();
			}
		});
	}

	$scope.recordSelection 	= function($event){
		var newSelection;
		var target 			= $event.currentTarget;

		// var data 			= $(target).data();
		var data 			= (typeof target.dataset !== 'undefined') ? target.dataset : $(target).data();
		newSelection    	= $.extend({}, data);

		//If placement isnt set then capture it manually - As in tie data
		if(typeof newSelection.placement == 'undefined'){
			newSelection.placement = {};
			newSelection.placement[$('.votebox.answers li:first a').data('answer_id')]   = 'left';
			newSelection.placement[$('.votebox.answers li:eq("1") a').data('answer_id')] = 'right';
		}



		//If its an indecision option grab that stuff else grab the placements
		if(typeof newSelection.indecision_option_id !== 'string') {
			//Get the alternate li element - aka the losing id
			var $next 			= $(target).parent().next();
			var $link 			= $next.find('a');

			var answer_id 		= (typeof $link[0].dataset !== 'undefined') ? $link[0].dataset.answer_id : $link.data('answer_id');

			if(typeof answer_id == 'undefined' || answer_id.length == 0) {
				$next 			= $(target).parent().prev();
				$link 			= $next.find('a');
				answer_id 		= (typeof $link[0].dataset !== 'undefined') ? $link[0].dataset.answer_id : $link.data('answer_id');
			}

			newSelection.losing_answer_id = answer_id;
			newSelection.end_time = $scope.getStartTime();
			// console.log('recordedSelection in newSelection: ', newSelection);
		}

		$scope.selection 	= newSelection; 
	}

	$scope.repopulateQuestion 	= function(){
		$('.votebox.answers').fadeOut(100, function(){
			delete $scope.answer1;
			delete $scope.answer2;

			$scope.answer1 			 = $scope.pluckOne($scope.answers);
			$scope.answer1.text 	 = $scope.answer1.text.toString();
			$scope.answer1.startTime = $scope.getStartTime();
			$scope.answer1.placement = 'left';
			// console.log('repopulated item1 id: ', $scope.answer1._id, ' placement: ', $scope.answer1.placement);

			$scope.answer2 			 = $scope.pluckOne($scope.answers);
			$scope.answer2.text 	 = $scope.answer2.text.toString();
			$scope.answer2.startTime = $scope.getStartTime();
			$scope.answer2.placement = 'right';
			// console.log('repopulated item2 id: ', $scope.answer2._id, ' placement: ', $scope.answer2.placement);


			if($scope.answer1.text.toLowerCase() == $scope.answer2.text.toLowerCase()){ 
				$scope.answer2 = $scope.pluckOne($scope.answers);
				$scope.answer2.text = $scope.answer2.text.toString();
			}
			
			if(typeof $scope.answer1 !== 'undefined' && typeof $scope.answer1.text !== 'object') $scope.answer1.text = $sce.trustAsHtml($scope.answer1.text);
			if(typeof $scope.answer2 !== 'undefined' && typeof $scope.answer2.text !== 'object') $scope.answer2.text = $sce.trustAsHtml($scope.answer2.text);

			$scope.pair 	= [$scope.answer1, $scope.answer2];
			$scope.$apply();

			$(this).fadeIn(100);
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
		// console.log('posting: ', selection, "\n\n");
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

	function pollForAssetLoad(asset, tryInterval, callback){
		var notLoaded = (typeof eval(asset) == 'undefined');

		if(! notLoaded) { 
			callback();
		} else {
			window.setTimeout(function(){
				pollForAssetLoad('app.Project.Resources', 500, callback);
			}, tryInterval);
		}
	}

	$scope.advance = function($event){
		$event.preventDefault();
		var text   = $event.target.innerHTML.toLowerCase().trim();
		var modal  = $($event.target).parent().parent();

		$scope.dismissModal(modal, function(){
			if(text == "this is fun! i’d like to see more") {
				var ttr = (($scope.question.secondaryDelay * 60) * 1000);
				//if(typeof app.dev == 'undefined' || app.dev == true) ttr = (1000 * 30);
				//if(typeof $scope.timers.secondaryTimer == 'undefined') 
				// console.log('secondary ttr: ', ttr);
				startSecondaryTimer(ttr);
			}
			if(text == "i don’t care for fun, let’s wrap this up") {
				// console.log('going to new location', $scope.next_page);
				window.parent.postMessage($scope.next_page, '*');
			}

		});
	}

	var IpResource  		= Ip.http;
	var ipResource  		= IpResource.query({ survey_id: $stateParams.survey_id, question_id:$stateParams.question_id }).$promise;
	var Project 			= app.Project;

	$scope.animationSpeed 	= 350;

	$scope.App 				= {};
	$scope.Ip 				= IpResource;

	pollForAssetLoad('app.Project.Resources', 500, function(){
		var projectPromise 	= Project.init($scope, Global, Settings);
		projectPromise.then(function(data){
			var btnStyle;
			if($scope.settings.questionSizing == 'static'){
				btnStyle = {'min-height': $scope.settings.minHeight + 'px'};
			} else {
				btnStyle = {};
			}
			$scope.btnStyle = btnStyle;

			//Get the values from the url first if present, else get it from localStorage,
		    var survey_id 	= (localStorage.getItem('survey_id')) ? localStorage.getItem('survey_id') : survey_id;
		    var question_id = (localStorage.getItem('question_id')) ? localStorage.getItem('question_id') : question_id;

		 	$scope.App.data			= data;
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
		});
	});
}