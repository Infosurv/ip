'use strict';

//Define the module
var Intengopear = angular.module('mean.intengopear');
var data;

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$rootScope', '$scope', 'Global', 'Project', 'Settings', '$state', '$stateParams', 'loggedin', IntengopearController]);	

//Controller Definitions
function IntengopearController ($rootScope, $scope, Global, Project, Settings, $state, $stateParams, loggedin){
    $scope.settings         = {};
    $scope.settings.status  = 'hidden';
    
    var sid                 = $stateParams.survey_id;
    $scope.survey_id        = sid;

    if(loggedin === "0") {
        window.location.href = 'http://intengopear.com/#/auth/login';
        return;
    }

    var settingsPromise = Settings.init(sid);
    settingsPromise.then(function(settings){
        var settings    = settings[0];
        $scope.settings = settings;
        $scope.settings.status  = 'hidden';

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
        
        $scope.settings.questionSizing = questionSizing;
    }

    $scope.updateProjectSettings    = function(evt){
        evt.preventDefault();
        var settings                = (typeof $scope.settings[0] == 'undefined') ? $scope.settings : $scope.settings[0];
        var sid                     = $scope.survey_id;
        settings.survey_id          = sid;

        if(typeof $scope.settings.characterLimit !== 'undefined') settings.characterLimit = $scope.settings.characterLimit;
        
        if(typeof settings._id == 'undefined'){
            console.log('saving');
            Settings.ProjectSettings.save({survey_id: sid}, settings).$promise.then(function(resp){
                $scope.settings = resp;
                
                angular.element('.hidden').text('Your settings have been saved.');
                $scope.settings.status = 'success';

                console.log(resp);
            });
        } else {
            console.log('updating');
            Settings.ProjectSettings.update({survey_id: sid}, settings).$promise.then(function(resp){
                $scope.settings = resp;
                
                Settings.updateUIStatus(resp.$promise.$$state, $scope);                
                console.log(resp);
            });
        }
    }
}