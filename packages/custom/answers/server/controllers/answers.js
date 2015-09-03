'use strict';

//Answers Controller

/**
 * Module dependencies.
 */
var mongoose 		= require('mongoose');
var Answer 			= mongoose.model('Answer');
var async 			= require('async');
var config 			= require('meanio').loadConfig();
var crypto 			= require('crypto');

exports.index 		= function(req, res, next){
	var question_id = req.query.id;
	var answers 	= Answer.find({question_id: question_id}, function(err, answers){
		res.status(200).send(answers); 
	}); 
};

exports.create  	= function(req, res, next){
	var collection  = req.body.answers;
	
	Answer.create(collection, function(err, answers){
    	if(err) return res.status(500).send('Oops, answer creation error.');
    	return res.status(200).send({status: 'saved'});
	});
	
};

exports.update   	= function(req, res, next){
	var newAnswer 	= req.body;
	
	var query 		= { _id: newAnswer._id };
	var data 		= { text: newAnswer.text };

	Answer.findOneAndUpdate(query, data, function(err, doc){
		if (err) return res.send(500, { error: err });
		res.status(200).send('answer '+ newAnswer._id +' updated'); 
	});
};

exports.delete   	= function(req, res, next){
	var id 			= req.query._id;

	var question 	= Answer.remove({ _id: id }, function(err, resp){
		console.log('err: ', err);
		console.log('resp: ', resp);
	});
	res.status(200).send('Question: ' + id + ' has been deleted.');
};

