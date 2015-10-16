'use strict';

//Define the module
var Intengopear = angular.module('mean.intengopear');

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$scope', 'Global', 'Project', '$state', '$stateParams', 'loggedin', IntengopearController]);	

//Controller Definitions
function IntengopearController ($scope, Global, Project, $state, $stateParams, loggedin){
    console.log('Intengopear Controller');
	console.log('loggedin: ', loggedin);

	var survey_id = 20;
	var uid       = 2;
    

    window.app          = (typeof window.app !== 'undefined') ? window.app : {};
    app.Project         = Project;
    app.$scope          = $scope;
    app.$scope.global   = Global;
    app.$scope.data 	= Project.data = Project.Resources.Project.get({survey_id: survey_id, uid: uid});

    app.$scope.surveys  = app.$scope.data.surveys;
    
    $scope.package = {
      name: 'intengopear'
    };
}

//Global methods - maybe need to scope these to an app object or something
function findById(collection, id){
	var item;

	angular.forEach(collection, function(elem, idx){
		if(id === elem._id) item = collection[idx];
	});

	return item;
}