'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Response = new Module('response');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Response.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Response.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Response.menus.add({
    title: 'response example page',
    link: 'response example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Response.aggregateAsset('css', 'response.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Response.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Response.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Response.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Response;
});
