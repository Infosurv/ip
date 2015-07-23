'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Intengopear = new Module('intengopear');
var util   = require('util');
/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Intengopear.register(function(system, app, auth, database) {
  //Override the system layout
  app.set('views', __dirname + '/server/views');

  //We enable routing. By default the Package Object is passed to the routes
  Intengopear.routes(app, auth, database);

  // //We are adding a link to the main menu for all authenticated users
  // Intengopear.menus.add({
  //   title: 'Pairwise Admin',
  //   link: 'intengopear example page',
  //   roles: ['authenticated'],
  //   menu: 'main'
  // });
  
  Intengopear.aggregateAsset('css', 'intengopear.css');
  Intengopear.aggregateAsset('css', 'loginForms.css');
  
  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Intengopear.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Intengopear.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Intengopear.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Intengopear;
});
