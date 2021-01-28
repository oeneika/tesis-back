"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CamaraSchema = Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	turn_screen: {
		type: String,
		required: true,
		trim: true,
	},
	resolution: {
		type: String,
		required: true,
		trim: true,
	},
	flash: {
		type: Boolean,
		required: true,
	},
	power: {
		type: Boolean,
		required: true,
	},
	user: {type: Schema.ObjectId, ref: "usuario"},
});

module.exports = mongoose.model("camara", CamaraSchema);
