"use strict";
var jwt = require("jwt-simple");

var moment = require("moment");
var secret = "clave_secreta_curso";

exports.createToken = function (usuario) {
	var payload = {
		id: usuario._id,
		firstname: usuario.firstname,
		lastname: usuario.lastname,
		email: usuario.email,
		iat: moment().unix(),
		exp: moment().add(30, "days").unix,
	};
	return jwt.encode(payload, secret);
};
