'use strict';

var mongoose    	= require('mongoose');
require('../../../answers/server/models/answer');
require('../../../questions/server/models/question');

var Answer    		= mongoose.model('Answer');
var Question    	= mongoose.model('Question');
var Response      = mongoose.model('Response');

var async 			  = require('async');
var config 			  = require('meanio').loadConfig();
var crypto 			  = require('crypto');
var util          = require('util');

function getHost(req){
  var host = (req.hostname.indexOf('dev') > -1 || req.hostname.indexOf('pear') > -1) ? 'http://intengopear.com' : 'http://ideas.intengoresearch.com';
  console.log('host: ' + host);
  return host;
}

function resolvePlacement(req){
  var isTie     = typeof req.body.indecision_option_id !== 'undefined', placement;

  if(isTie) placement   = req.body.placement[req.body.answer1_id];
  if(! isTie) placement = req.body.placement;
  if(typeof placement == 'undefined') placement = 'right';
  
  console.log('placement resolved to: ' + placement);

  return placement;
}

function resolveReqParams(req){
  var params               = {};
  params.winning_answer_id = (typeof req.body.answer_id !== 'undefined') ?  req.body.answer_id : req.body.answer1_id;
  params.losing_answer_id  = (typeof req.body.losing_answer_id !== 'undefined') ? req.body.losing_answer_id : req.body.answer2_id;
  params.indecision_option = req.body.indecision_option_id;
  params.isTie             = (typeof params.indecision_option !== 'undefined');
  params.placement         = resolvePlacement(req);

  return params;
}

function composeTieData(req){
  console.log('Composing Tie Data');

  var params          = resolveReqParams(req);
  params.query_obj    = {ties: 1 };

  //var placement = params.placement[params.winning_answer_id];
  params.query_obj[params.placement] = 1;

  console.log('');
  console.log("\n");

  return params;
}

function composeAnswerData(req){
  console.log('Composing Answer Data');
  var params          = resolveReqParams(req);
  params.query_obj    = {wins: 1};
  params.query_obj[params.placement] = 1;

  return params;
}


//Sends back iFrame data 
exports.index 	= function(req, res, next) {
    // res.send('index');
    // return;

    var survey_id   = req.params.survey_id;
    var question_id = req.params.question_id;
    var projectData = {};
    
    Question.find({survey_id: survey_id}, function(err, questions){
      projectData.questions   = questions;

      projectData.iFrameData  = {
        src: getHost(req) + '/#/ip',
        survey_id: survey_id,
        question_id: question_id
      }

      res.status(200).json(projectData);
    });
};

exports.find = function(req, res, next){
	var question_id = req.params.question_id;
  var survey_id   = req.params.survey_id;
	var projectData = {};
  
	Question.findOne({_id: question_id}, function(err, question){
		projectData.question = question;

		Answer.find({'question_id': question_id}, function(err, answers){
        projectData.answers = answers;
        res.status(200).json(projectData);
	  });      
  });
}

exports.storeResponse   = function(req, res, next){
  //TODO: Run more manual tie checks in the morn

  var response          = new Response(req.body);
  var isTie             = (typeof req.body.indecision_option_id !== 'undefined');
  var wins_data, placement, losing_answer_id, losses_data;
  
  var params            = (! isTie) ? composeAnswerData(req) : composeTieData(req);
  console.log('params: ');

  wins_data             = {$inc: params.query_obj};
  placement             = params.placement;
  
  console.log('Saving question response:');  
  console.log('Answer 1: ');
  console.log("\n");
    
  //If there is no tie
  Answer.findOneAndUpdate({_id: params.winning_answer_id}, wins_data, function(err, answer){
    losing_answer_id  = (typeof req.body.losing_answer_id !== 'undefined') ? req.body.losing_answer_id : req.body.answer2_id;
    var placement     = params.placement;
    
    if (err) return res.send(500, { error: err });  

    var query_obj, losses_data;
    if(! params.isTie) {
      query_obj           = {losses: 1};
      placement           = (placement == 'left') ? 'right' : 'left'; //Since it only records placement for the selected response then this grabs the alternate placement
      query_obj[placement]= 1;
      losses_data         = {$inc: query_obj};
    } else {
      //If it's a tie
      query_obj           = {ties: 1};
      placement           = (placement == 'left') ? 'right' : 'left'; //Since it only records placement for the selected response then this grabs the alternate placement
      query_obj[placement]= 1;
      losses_data         = {$inc: query_obj};
    }

    console.log('Answer 2: ');
    console.log("\n");
    
    Answer.findOneAndUpdate({_id: losing_answer_id}, losses_data, function(err, losing_answer){
      if (err) return res.send(500, { error: err });  
      
      response.save(function(err){
        if(err){
          console.log(err);
          return res.status(500).send('Oops, response creation error.');
        }
        
        return res.status(200).json(response);
      });    
    });
  });
}

exports.exportResults   = function(req, res, next){
  // res.send('export results');
  // return;
  var question_id = req.params.question_id;
  var projectData = {};
  
  Question.findOne({_id: question_id}, function(err, question){
    projectData.question = question;

    Answer.find({'question_id': question_id}, function(err, answers){
        projectData.answers = answers;
        res.status(200).json(projectData);
    });      
  });
}

exports.exportVotes     = function(req, res, next){  
  var question_id = req.params.question_id;
  var projectData = {};
  
  Question.findOne({_id: question_id}, function(err, question){
    projectData.question = question;

    Answer.find({'question_id': question_id}, function(err, answers){
        projectData.answers = answers;

        Response.find({'survey_id': question.survey_id}, function(err, responses){
          projectData.responses = responses;
          res.status(200).json(projectData);
          return;
        });
    });      
  });
}

exports.clearData       = function(req, res, next){
  var survey_id = req.params.survey_id;
  var questions, errors = [];

  console.log('clearing data: ');

  Question.find({'survey_id': survey_id}, function(err, _questions){
        questions = _questions;

        console.log('survey_id', survey_id);
        Response.find({ survey_id : survey_id }).remove().exec();

        for(var i = 0; i < questions.length; i++){
          var question = questions[i];
          var qid      = question._id;

          console.log('Attempting to update question: ' + qid);
          Answer.update({'question_id' : qid}, {
              'wins'  : 0,
              'losses': '0',
              'ties'  : 0,
              'right' : 0,
              'left'  : 0
            },
            {
              multi: true
            },
            function(err, data){
                if (err) {
                  console.log('Data reset error: ');
                  console.log(err);
                  errors.push(err);
                } else if (! data){
                  console.log('No data found.');
                } else {
                    console.log('successfully updated: ' + data.nModified + ' items.');
                }
            }
          );
        }

        if(errors.length == 0) {
          res.send('data cleared');
        } else {
          res.send('data error');
        }
    }); 
} 

