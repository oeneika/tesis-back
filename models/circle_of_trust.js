"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationsSchema = Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	user: {type: Schema.ObjectId, ref: "usuario"},
});

module.exports = mongoose.model("notification", NotificationsSchema);
