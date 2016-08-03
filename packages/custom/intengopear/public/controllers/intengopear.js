'use strict';

//Define the module
var Intengopear = angular.module('mean.intengopear');
var data;

//Assign the controllers to the main module
Intengopear.controller('IntengopearController', ['$rootScope', '$scope', 'Global', 'Project', 'Settings', '$state', '$stateParams', 'loggedin', IntengopearController]);	

//Controller Definitions
function IntengopearController ($rootScope, $scope, Global, Project, Settings, $state, $stateParams, loggedin){
    console.log('IntengopearController');
    
    $rootScope.settings         = {};
    $rootScope.settings.status  = 'hidden';
    $rootScope.stateParams      = $stateParams;
    
    var sid                     = $stateParams.survey_id;
    $rootScope.survey_id        = sid;

    //Main Routine
    Project.init($rootScope, Global);
    
    $scope.toggleQuestionSizing     = function(evt){
        evt.preventDefault();
        var elem                    = angular.element(evt.target);
        var activeElem              = elem.parent().parent().find('.active a')[0];
        var questionSizing          = elem.text().toLowerCase();

        // elem.parent().parent().find('.active').removeClass('active');
        // elem.parent().addClass('active');

        // if(activeElem != evt.target) angular.element('.staticValues').slideToggle(100);
        
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