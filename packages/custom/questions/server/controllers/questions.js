'use strict';

//Questions Controller

/**
 * Module dependencies.
 */
var mongoose 		= require('mongoose');
var Question 		= mongoose.model('Question');
var async 			= require('async');
var config 			= require('meanio').loadConfig();
var crypto 			= require('crypto');

exports.index 		= function(req, res, next){
	var survey_id 	= req.query.survey_id;
	
	var questions 	= Question.find({survey_id: survey_id}, function(err, questions){
		res.status(200).send(questions); 
	});
};

exports.create  	= function(req, res, next){
	var question 	= new Question(req.body);
	console.log('Creating question', question);

	question.save(function(err){
	    if(err){
	    	console.log(err);
	    	return res.status(500).send('Oops, question creation error.');
	    }

	    return res.status(200).json(question);
  	});
};

exports.update 		  	= function(req, res, next){
	var content     	= req.body;
	var query 		 	= { _id : content._id };
	var data 			= { survey_id: content.survey_id, delay: parseInt(content.delay), secondaryDelay: parseInt(content.secondaryDelay), description: content.description, indecision_options: content.indecision_options, styles: content.styles };
	
	Question.findOneAndUpdate(query, data, function(err, doc){
		if (err) return res.send(500, { error: err });
    	return res.send("succesfully saved");
	});
};

exports.delete   	= function(req, res, next){
	var id 			= req.params.question_id;

	var question 	= Question.remove({ _id: id }, function(err, resp){
		console.log('err: ', err);
		console.log('resp: ', resp);
	});
	res.status(200).send('Question: ' + id + ' has been deleted.');
};

