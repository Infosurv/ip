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
	var answers 	= Answer.find({}, function(err, answers){
		res.status(200).send(answers); 
	}); 
};

exports.create  	= function(req, res, next){
	var collection  = req.body.answers;
	//Loop through each answer here and save each one.
	
	Answer.create(collection, function(err, answers){
    	if(err)return res.status(500).send('Oops, answer creation error.');
    	return res.status(200).send('Answers have been saved.');
	});
	
};

exports.update   	= function(req, res, next){
	res.status(200).send('answers.update'); 
};

exports.delete   	= function(req, res, next){
	res.status(200).send('answers.delete'); 
};