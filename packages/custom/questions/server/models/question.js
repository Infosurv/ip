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
	indecision_options: {
		type: String,
		required: false,
		default: ['I like both options the same', 'I dislike both options the same', 'I don\'t know enough about either option']
	},
	description: {
		type: String,
		required: true
	},
	delay: {
		type: Schema.Types.Mixed,
		required: false,
		default: 5000
	},
	secondaryDelay: {
		type: Schema.Types.Mixed,
		required: false,
		default: 2500
	},
	styles: {
		type: String,
		required: false
	}
});

mongoose.model('Question', QuestionSchema);