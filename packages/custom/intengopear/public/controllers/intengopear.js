'use strict';

//Define the module
var Intengopear = angular.module('mean.intengopear');
var data;

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$rootScope', '$scope', 'Global', 'Project', '$state', '$stateParams', 'loggedin', IntengopearController]);	

//Controller Definitions
function IntengopearController ($rootScope, $scope, Global, Project, $state, $stateParams, loggedin){
    if(loggedin === "0") {
        window.location.href = 'http://intengopear.com/#/auth/login';
        return;
    }

    angular.element('input').focus();

	Global.survey_id   = $stateParams.survey_id;
    var projectPromise = Project.init($scope, Global);

    //Main Routine
    projectPromise.then(function(data){
        app.$scope.surveys  = data.surveys;
    });
    
    $scope.toggleQuestionSizing     = function(evt){
        evt.preventDefault();
        var elem                    = angular.element(evt.target);
        elem.parent().parent().find('.active').removeClass('active');
        elem.parent().addClass('active');
        var questionSizing          = elem.text().toLowerCase();

        $scope.projectSettings      = (typeof $scope.projectSettings == 'object') ? $scope.projectSettings : {};
        $scope.projectSettings.questionSizing = questionSizing;
    }

    $scope.updateProjectSettings    = function(evt){
        evt.preventDefault();
        debugger;
    }
}