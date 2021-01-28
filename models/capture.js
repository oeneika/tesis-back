"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CaptureSchema = Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	size: {
		type: String,
		required: true,
		trim: true,
	},
	duration: {
		type: String,
		required: true,
		trim: true,
	},
	date: {
		type: Date,
		required: true,
	},
	image: {
		type: String,
		required: true,
		trim: true,
	},
	camera: {type: Schema.ObjectId, ref: "camara"},
});

module.exports = mongoose.model("capture", CaptureSchema);
