"use strict";

var express = require("express");
var UsuarioController = require("../controllers/users");
var md_auth = require("../middlewares/authenticated");
var {check} = require("express-validator");

var api = express.Router();
api.post(
	"/registro",
	[
		check("firstname", "El nombre es obligatorio").not().isEmpty(),
		check("lastname", "El apellido es obligatorio").not().isEmpty(),
		check("email", "El email no es válido").isEmail(),
		check(
			"password",
			"Obligatorio el uso de una mayuscula, minuscula, un caracter especial y un minimo 6 caracteres."
		)
			.isLength({min: 6})
			.matches(/^(?=.*\d)(?=.*[a-záéíóúüñ]).*[A-ZÁÉÍÓÚÜÑ]/),
	],
	UsuarioController.agregarUsuario
);
api.post(
	"/login",
	[
		check("email", "El correo electrónico es obligatorio").not().isEmpty(),
		check("password", "La contraseña es obligatoria").not().isEmpty(),
	],
	UsuarioController.loginUsuario
);
api.get("/auth-user", md_auth.ensureAuth, UsuarioController.getUserToken);
api.get("/usuario-registrados", UsuarioController.getUsuarios);
api.put(
	"/actualizar-usuario/:id",
	md_auth.ensureAuth,
	UsuarioController.actualizarUsuario
);

module.exports = api;
