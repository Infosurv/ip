'use strict';

//Override the home routes
//Setting up route
angular.module('mean.system').config(['$meanStateProvider', '$urlRouterProvider', function($meanStateProvider, $urlRouterProvider){
    //http://intengopear.com/
    $meanStateProvider.state('index', {
        url: '/',
        templateUrl: 'intengopear/views/index.html'
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
angular.module('mean.users').config(['$meanStateProvider', function($meanStateProvider) {
  $meanStateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'intengopear/views/admin.html'
  }); 

  //http://intengopear.com/#/20/questions
  $meanStateProvider.state('questions', {
    url: '/:survey_id/questions',
    templateUrl: 'intengopear/views/home.html'
  })
  .state('questions.edit', {
    url: '/:id/edit',
    templateUrl: 'intengopear/views/edit.html'
  });
}]);
