'use strict';

var IpController= require('../controllers/Ip');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Ip, app, auth, database) {
  app.all('*', function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'Content-Type');
  	next();
  });

  //External Routes
  app.route('/api/:survey_id/clearData')
  .get(IpController.clearData);

  //Get specific data about a question
  app.route('/api/ip/ext/export/questions/:question_id')
  .get(IpController.exportResults);

  app.route('/api/ip/ext/export/votes/:question_id')
  .get(IpController.exportVotes);

  //Get all the standard data for a project for the intengoresearch dashboard
  //The index method requires a survey_id only
  app.route('/api/ip/ext/:survey_id?/:question_id?')
  .get(IpController.index)
  .post(IpController.storeResponse);

  /* Internal Routes
  ** Get: 
  ** Post: 
  */
  app.route('/api/ip/:survey_id?/:question_id?')
  .get(IpController.find)
  .post(IpController.storeResponse);
};
