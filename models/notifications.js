"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationsSchema = Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
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
	user: {type: Schema.ObjectId, ref: "usuario"},
});

module.exports = mongoose.model("notification", NotificationsSchema);
