'use strict';

//Questions Model


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

//TODO: set user_id to required later
var ResponseSchema = new Schema({
	survey_id: {
		type: Number,
		required: true
	},
	user_id: {
		type: Number,
		required: false
	},
	question_id: {
		type: String,
		required: false
	},
	answer_id: {
		type: String,
		required: false
	},
	losing_answer_id: {
		type: String,
		required: false
	},
	indecision_option_id: {
		type: String,
		required: false
	},
	start_time: {
		type: Number,
		required: false
	},
	end_time: {
		type: Number,
		required: false
	},
	placement: {
		type: Schema.Types.Mixed,
		required: false
	},
	created: {
		type: Date, 
		default: Date.now
	}
});

mongoose.model('Response', ResponseSchema);