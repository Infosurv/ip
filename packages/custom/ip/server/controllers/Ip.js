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
Q2 A1 <img src="http://lorempixel.com/400/200/nature/">
Q2 A2 <img src="http://lorempixel.com/400/200/nature/">
Q2 A3 <img src="http://lorempixel.com/400/200/nature/">
Q2 A4 <img src="http://lorempixel.com/400/200/nature/">
Q2 A5 <img src="http://lorempixel.com/400/200/nature/">
Q2 A6 <img src="http://lorempixel.com/400/200/nature/">
Q2 A7 <img src="http://lorempixel.com/400/200/nature/">
Q2 A8 <img src="http://lorempixel.com/400/200/nature/">
*/

exports.storeResponse   = function(req, res, next){

  var response          = new Response(req.body);
  var winning_answer_id = (typeof req.body.answer_id !== 'undefined') ?  req.body.answer_id : req.body.answer1_id;
  var losing_answer_id  = (typeof req.body.losing_answer_id !== 'undefined') ? req.body.losing_answer_id : req.body.answer2_id;
  var placement         = req.body.placement;
  var indecision_option = req.body.indecision_option_id;
  var isTie             = (typeof indecision_option !== 'undefined');
  var wins_data;

  console.log('placement1');
  console.log(winning_answer_id);
  console.log(placement);
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
    losing_answer_id  = (typeof req.body.losing_answer_id !== 'undefined') ? req.body.losing_answer_id : req.body.answer2_id;
    placement         = req.body.placement;

    if (err) return res.send(500, { error: err });  

    var query_obj, losses_data;
    if(! isTie) {
      query_obj           = {losses: 1};
      placement           = (placement == 'left') ? 'right' : 'left'; //Since it only records placement for the selected response then this grabs the alternate placement
      query_obj[placement]= 1;
      losses_data         = {$inc: query_obj};

      // console.log('laid');
      // console.log(losing_answer_id);
      // console.log('placement2');
      // console.log(placement);
      // console.log("\n");

      // console.log(util.inspect(req.body));

    } else {
      //If it's a tie
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