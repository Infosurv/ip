'use strict';

var mongoose    	= require('mongoose');
require('../../../answers/server/models/answer');
require('../../../questions/server/models/question');

var Answer    		= mongoose.model('Answer');
var Question    	= mongoose.model('Question');
var async 			= require('async');
var config 			= require('meanio').loadConfig();
var crypto 			= require('crypto');
var util 			= require('util');

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

exports.push 		= function(req, res, next){
	res.status(200).send('connected');
}