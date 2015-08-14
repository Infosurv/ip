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
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	wins: {
		type: Number,
		required: false,
		default: 0
	},
	losses: {
		type: String,
		required: false,
		default: 0
	}
});


mongoose.model('Answer', AnswerSchema);