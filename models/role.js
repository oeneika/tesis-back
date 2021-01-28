"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RoleSchema = Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	permissions: [{type: Schema.ObjectId, ref: "Permissions"}],
});

module.exports = mongoose.model("role", RoleSchema);
