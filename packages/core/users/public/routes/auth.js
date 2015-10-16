'use strict';


function usersModule($meanStateProvider, $httpProvider, jwtInterceptorProvider) {    
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    // Check if the user is not connected
    var checkLoggedOut = function($q, $timeout, $http, $location) {
      console.log('auth:checkLoggedOut');

      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
        console.log('Authenticated status: ', user);
        
        // Authenticated
        if (user !== '0') {
          console.log('user authenticated');
          $timeout(deferred.reject);
          //$location.url('/home');
        } else {
          console.log('user not authenticated');
          $location.url('/auth/login');
          // Not Authenticated
          $timeout(deferred.resolve);
        }
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
      .state('home', {
        url: '/home',
        templateUrl: 'intengopear/views/index.html',
        resolve: {
          loggedin: checkLoggedOut
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'intengopear/views/admin.html'
      })
      .state('questions', {
        url: '/:survey_id/questions',
        templateUrl: 'intengopear/views/home.html'
      })
      .state('questions.edit', {
        url: '/:id/edit',
        templateUrl: 'intengopear/views/edit.html'
      });
  }

//Setting up route
angular.module('mean.users').config(['$meanStateProvider', '$httpProvider', 'jwtInterceptorProvider', usersModule]);