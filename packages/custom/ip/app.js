'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Ip = new Module('ip');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Ip.register(function(app, auth, database) {

  app.set('views', __dirname + '/server/views');

  //We enable routing. By default the Package Object is passed to the routes
  Ip.routes(app, auth, database);  
  Ip.aggregateAsset('css', 'ip.css');

  return Ip;
});
