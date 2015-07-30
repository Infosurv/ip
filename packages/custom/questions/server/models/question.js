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

var QuestionSchema = new Schema({
	survey_id: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	delay: {
		type: Schema.Types.Mixed,
		required: false
	},
	secondaryDelay: {
		type: Schema.Types.Mixed,
		required: false
	}
});

mongoose.model('Question', QuestionSchema);