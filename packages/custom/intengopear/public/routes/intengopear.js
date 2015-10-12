'use strict';

//Override the home routes
//Setting up route
angular.module('mean.system').config(['$meanStateProvider', '$urlRouterProvider', function($meanStateProvider, $urlRouterProvider){

var checkLoggedOut = function(){
  console.log('Checking global auth status: ');
  if(app.$scope.global.authenticated == false) window.location = '//intengopear.com/#/auth/login';
  return false;
}

$meanStateProvider.state('index', {
    url: '/home',
    templateUrl: 'intengopear/views/index.html',
    resolve: {
      loggedin: checkLoggedOut
    }
  });
}

]).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });
  }
]);


//Setting up route
// angular.module('mean.users').config(['$meanStateProvider', function($meanStateProvider) {
//   $meanStateProvider.state('admin', {
//     url: '/admin',
//     templateUrl: 'intengopear/views/admin.html'
//   }); 

//   //http://intengopear.com/#/20/questions
//   $meanStateProvider.state('questions', {
//     url: '/:survey_id/questions',
//     templateUrl: 'intengopear/views/home.html'
//   })
//   .state('questions.edit', {
//     url: '/:id/edit',
//     templateUrl: 'intengopear/views/edit.html'
//   });
// }]);
