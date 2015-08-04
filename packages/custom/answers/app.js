'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Answers = new Module('answers');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Answers.register(function(app, auth, database) {
  console.log('answers module');

  //We enable routing. By default the Package Object is passed to the routes
  Answers.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Answers.aggregateAsset('css', 'answers.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Answers.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Answers.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Answers.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Answers;
});
