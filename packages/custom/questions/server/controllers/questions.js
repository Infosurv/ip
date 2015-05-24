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
var util 			= require('util');

exports.index 		= function(req, res, next){
	console.log('req.query');
	console.log(util.inspect(req.params));
	console.log(util.inspect(req.query));
	var questions 	= Question.find({}, function(err, questions){
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

exports.update   	= function(req, res, next){
	var id 			= req.params.question_id;
	var content     = req.body;

	Question.update({ _id : id }, {
		description: content.description
	}, function(err, numberAffected, resp){
		console.log('updated question: ', id, ' with ', content, ' affected ', numberAffected, ' row.');
	});
	//res.status(200).send('updating question ' + id);
	
};

exports.delete   	= function(req, res, next){
	var id 			= req.params.question_id;

	var question 	= Question.remove({ _id: id }, function(err, resp){
		console.log('err: ', err);
		console.log('resp: ', resp);
	});
	res.status(200).send('Question: ' + id + ' has been deleted.');


	// var question 	= Question.find({ id: req.body.id });
	// console.log(question.collection.length);

	// res.status(200);
	// res.send('updating question');
};