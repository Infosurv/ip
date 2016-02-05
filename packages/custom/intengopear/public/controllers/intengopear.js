'use strict';

//Define the module
var Intengopear = angular.module('mean.intengopear');
var data;

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$rootScope', '$scope', 'Global', 'Project', 'Settings', '$state', '$stateParams', 'loggedin', IntengopearController]);	

//Controller Definitions
function IntengopearController ($rootScope, $scope, Global, Project, Settings, $state, $stateParams, loggedin){
    $scope.settings     = {};
    $scope.settings.app = {};

    if(loggedin === "0") {
        window.location.href = 'http://intengopear.com/#/auth/login';
        return;
    }

    var settingsPromise = Settings.init();
    settingsPromise.then(function(settings){
        $scope.settings.app.characterLimit = 2000;

        angular.element('input').focus();

        Global.survey_id   = $stateParams.survey_id;
        var projectPromise = Project.init($scope, Global);

        //Main Routine
        projectPromise.then(function(data){
            app.$scope.surveys  = data.surveys;
            $scope.$applyAsync();
        });
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