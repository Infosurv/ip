'use strict';

angular.module('mean.settings').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('app settings', {
      url: '/settings',
      templateUrl: 'settings/views/index.html'
    });
  }
]);
