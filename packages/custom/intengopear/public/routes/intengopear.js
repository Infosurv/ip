'use strict';

//Setting up route
angular.module('mean.users').config(['$meanStateProvider', 
function($meanStateProvider) {
  $meanStateProvider.state('admin', {
    templateUrl: 'intengopear/views/admin.html'
  })
  .state('admin.home', {
    url: '/admin',
    templateUrl: 'intengopear/views/home.html'
  });
}
]);

angular.module('mean.intengopear').config(['$meanStateProvider', function($meanStateProvider) {
    $meanStateProvider
    .state('admin.edit', {
      url: '/:id/edit',
      templateUrl: 'intengopear/views/edit.html'
    });
  }
]);

