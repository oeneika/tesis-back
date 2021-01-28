"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CapturedUserSchema = Schema({
	age: {
		type: String,
		required: true,
		trim: true,
	},
	gender: {
		type: String,
		required: true,
		trim: true,
	},
	facial_expression: {
		type: String,
		required: true,
		trim: true,
	},
	hour: {
		type: String,
		required: true,
		trim: true,
	},
	image: {
		type: String,
		required: true,
		trim: true,
	},
	capture: {type: Schema.ObjectId, ref: "capture"},
});

module.exports = mongoose.model("captured_user", CapturedUserSchema);
