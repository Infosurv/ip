'use strict';

angular.module('mean.users').config(['$meanStateProvider', '$httpProvider', 'jwtInterceptorProvider', usersModule]);

function usersModule($meanStateProvider, $httpProvider, jwtInterceptorProvider) {    
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // Check if the user is not connected - should be called toLogOut
    var checkLoggedOut = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
        deferred.resolve(user);
        if(user !== '0') window.location = 'http://intengopear.com/#/home';
      });

      return deferred.promise;
    };

    // states for my app
    $meanStateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: 'users/views/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'users/views/login.html',
        controller: 'AuthCtrl',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'users/views/register.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'users/views/forgot-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: 'users/views/reset-password.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'intengopear/views/admin.html'
      });
}