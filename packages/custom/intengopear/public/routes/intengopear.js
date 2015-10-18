'use strict';

console.log('intengopear routes file')

angular.module('mean.intengopear').config(['$meanStateProvider', '$httpProvider', 'jwtInterceptorProvider', IntengoPearModule]);

function IntengoPearModule($meanStateProvider, $httpProvider, jwtInterceptorProvider) {    
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // Check if the user is not connected - should be called toLogOut
    var isLoggedIn = function($q, $timeout, $http, $location) {
      console.log('intengopear:isLoggedIn');

      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
        console.log('Authenticated status: ', user);
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