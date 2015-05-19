'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Intengopear, app, auth, database) {
 

  app.get('/intengopear/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/intengopear/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/intengopear/example/render', function(req, res, next) {
    Intengopear.render('index', {
      package: 'intengopear'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
