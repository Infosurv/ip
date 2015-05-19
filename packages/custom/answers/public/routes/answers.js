'use strict';

angular.module('mean.answers').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('answers example page', {
      url: '/answers/example',
      templateUrl: 'answers/views/index.html'
    });
  }
]);
