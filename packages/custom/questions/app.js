'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Questions = new Module('questions');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Questions.register(function(app, auth, database) {
   console.log('questions module');
  //We enable routing. By default the Package Object is passed to the routes
  Questions.routes(app, auth, database);  
  Questions.aggregateAsset('css', 'questions.css');

  return Questions;
});
