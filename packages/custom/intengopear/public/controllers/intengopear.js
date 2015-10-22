'use strict';

//Define the module
var Intengopear = angular.module('mean.intengopear');

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$rootScope', '$scope', 'Global', 'Project', '$state', '$stateParams', 'loggedin', IntengopearController]);	

//Controller Definitions
function IntengopearController ($rootScope, $scope, Global, Project, $state, $stateParams, loggedin){
    Project.init($scope, Global);
    
    if(loggedin === "0") {
        window.location.href = 'http://intengopear.com/#/auth/login';
        return;
    }    

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