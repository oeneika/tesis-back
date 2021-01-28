"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PermissionsSchema = Schema({
	name: {type: String, required: true},
	code: {type: String, required: true},
});

module.exports = mongoose.model("permission", PermissionsSchema);
