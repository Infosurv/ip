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
  var response          = new Response(req.body);
  var winning_answer_id = req.body.answer_id;
  var losing_answer_id  = req.body.losing_answer_id;
  var wins_data         = {$inc: {wins: 1}};
  var losses_data       = {$inc: {losses: 1}};

  Answer.findOneAndUpdate({_id: winning_answer_id}, wins_data, function(err, answer){
    if (err) return res.send(500, { error: err });  
    Answer.findOneAndUpdate({_id: losing_answer_id}, losses_data, function(err, answer){
      if (err) return res.send(500, { error: err });  
      res.status(200).send('Answers tally updated'); 
    });
  });

  console.log(losing_answer_id);
  return;

  response.save(function(err){
      if(err){
        console.log(err);
        return res.status(500).send('Oops, response creation error.');
      }

      return res.status(200).json(response);
    });
  // Question.findOne({_id: question_id}, function(err, question){
  //   projectData.question = question;

  //   Answer.find({'question_id': question_id}, function(err, answers){
  //       projectData.answers = answers;
  //       res.status(200).json(projectData);
  //   });      
  // });
}