'use strict';

/* jshint -W098 */
angular.module('mean.ip').controller('IpController', ['$scope', 'Global', 'Ip',
  function($scope, Global, Ip) {
    $scope.global = Global;
    $scope.package = {
      name: 'ip'
    };
  }
]);
