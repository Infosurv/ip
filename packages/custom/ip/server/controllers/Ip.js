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
var util 			    = require('util');

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
        src: 'http://intengopear.com/#/ip',
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

/*
A1 <img src="http://lorempixel.com/400/200/nature/">
A2 <img src="http://lorempixel.com/400/200/nature/">
A3 <img src="http://lorempixel.com/400/200/nature/">
A4 <img src="http://lorempixel.com/400/200/nature/">
A5 <img src="http://lorempixel.com/400/200/nature/">
A6 <img src="http://lorempixel.com/400/200/nature/">
A7 <img src="http://lorempixel.com/400/200/nature/">
A8 <img src="http://lorempixel.com/400/200/nature/">
*/

exports.storeResponse   = function(req, res, next){
  //console.log(util.inspect(req.body));

  var response          = new Response(req.body);
  var winning_answer_id = (typeof req.body.answer_id !== 'undefined') ?  req.body.answer_id : req.body.answer1_id;
  var losing_answer_id  = (typeof req.body.losing_answer_id !== 'undefined') ? req.body.losing_answer_id : req.body.answer2_id;
  var indecision_option = req.body.indecision_option_id;
  var isTie             = (typeof indecision_option !== 'undefined');
  var placement         = req.body.placement;
  var wins_data;

  console.log('question_id1 , placement 1');
  console.log(util.inspect(winning_answer_id));
  console.log(util.inspect(placement));
  console.log("\n");

  if(! isTie) {
    var query_obj       = {wins: 1};
    query_obj[placement]= 1;
    wins_data           = {$inc: query_obj};
  } else {
    var query_obj       = {ties: 1 };
    query_obj[placement]= 1;
    wins_data           = {$inc: query_obj};
  }
  //If there is no tie
  Answer.findOneAndUpdate({_id: winning_answer_id}, wins_data, function(err, answer){
    if (err) return res.send(500, { error: err });  

    var query_obj, losses_data;
    if(! isTie) {
      query_obj           = {losses: 1};
      placement           = (placement == 'left') ? 'right' : 'left'; //Since it only records placement for the selected response then this grabs the alternate placement
      query_obj[placement]= 1;
      losses_data         = {$inc: query_obj};

      console.log('question_id2 , placement 2');
      console.log(util.inspect(losing_answer_id));
      console.log(util.inspect(placement));
      console.log("\n");
    } else {
      query_obj           = {ties: 1};
      placement           = (placement == 'left') ? 'right' : 'left'; //Since it only records placement for the selected response then this grabs the alternate placement
      query_obj[placement]= 1;
      losses_data         = {$inc: query_obj};
    }
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