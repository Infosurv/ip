'use strict';

/* jshint -W098 */
angular.module('mean.answers').controller('AnswersController', ['$scope', 'Global', 'Answers',
  function($scope, Global, Answers) {
    $scope.global = Global;
    $scope.package = {
      name: 'answers'
    };
  }
]);
