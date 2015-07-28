'use strict';

angular.module('mean.intengopear').factory('Intengopear', [function() {
    return {
      name: 'Intengopear',
      isAuthed: function(opts){
      	return opts.authenticated;
      }
    };
  }
]);
