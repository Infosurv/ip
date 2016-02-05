'use strict';

var util       = require('util');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Settings, app, auth, database) { 
  app.route('/api/settings/app')
  .get(function(req, res){
    var host;

    var settings  = {};
          //host    = 'dbsettings';
          host    = (typeof process.env.APPHOST !== 'undefined') ?  process.env.APPHOST : 'http://intengopear.com';
    settings.host = host;
    settings.type = 'app';

    res.status(200).json(settings);
  })
  .post(function(req, res){
    var appHost     = req.body.appHost;
    //Create a model and save this to the db

    res.status(200).send('updating setting');
  });
};
