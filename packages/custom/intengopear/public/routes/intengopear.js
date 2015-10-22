'use strict';

angular.module('mean.intengopear').config(['$meanStateProvider', '$httpProvider', 'jwtInterceptorProvider', IntengoPearModule]);

function IntengoPearModule($meanStateProvider, $httpProvider, jwtInterceptorProvider) {    
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // Check if the user is not connected - should be called toLogOut
    var isLoggedIn = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
        deferred.resolve(user);
      });

      return deferred.promise;

    };

    // states for my app
    $meanStateProvider.state('home', {
      url: '/home',
      templateUrl: 'intengopear/views/index.html',
      controller: 'IntengopearController',
      resolve: {
        loggedin: isLoggedIn
      }
    });
}