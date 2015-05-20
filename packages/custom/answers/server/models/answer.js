'use strict';

//Answers Model


/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
          _   = require('lodash');

/**
 * User Schema
 */

var AnswerSchema = new Schema({
	survey_id: {
		type: Number,
		required: true
	},
	question_id: {
		type: Number,
		required: true
	},
	text: {
		type: String,
		required: true
	}
});

mongoose.model('Answer', AnswerSchema);