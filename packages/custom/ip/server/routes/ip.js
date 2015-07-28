'use strict';

var mongoose    = require('mongoose');
var Question    = mongoose.model('Question');
var util        = require('util');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Ip, app, auth, database) {
  app.all('*', function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'Content-Type');
  	next();
  });

  app.route('/api/ip/:survey_id?/:question_id?').get(function(req, res, next) {
    var survey_id   = req.params.survey_id;
    var question_id = req.params.question_id;
    var projectData = {};
    
    Question.find({survey_id: survey_id}, function(err, questions){
      projectData.questions   = questions;

      projectData.iFrameData  = {
        src: 'http://intengopear.com/#/ip',
        survey_id: survey_id,
        question_id: question_id
      }

      res.status(200).json(projectData);
    });
  }).post(function(req, res, next){
  	res.status(200).send('connected');
  });

};
