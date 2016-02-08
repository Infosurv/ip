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

var SettingSchema = new Schema({
	survey_id: {
		type: Number,
		required: false,
		default: 0
	},
	appHost: {
		type: String,
		required: false,
		default: 'http://intengopear.com'
	},
	questionSizing: {
		type: String,
		required: true,
		default: 'static'
	}
}, { strict: false });


mongoose.model('Setting', SettingSchema);