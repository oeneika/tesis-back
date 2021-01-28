"use strict";
var Usuario = require("../models/user");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
const {validationResult} = require("express-validator");

async function agregarUsuario(req, res) {
	//Validar errores que se definifieron en la ruta
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).send({message: errores.array()});
	}

	const {email} = req.body;
	try {
		//Buscamos si el email se encuentra registrado
		let usuario = await Usuario.findOne({email});
		if (usuario) {
			return res
				.status(400)
				.send({message: "El usuario ya existe en el sistema"});
		}

		usuario = new Usuario(req.body);

		//Hash a la clave
		if (usuario.password) {
			bcrypt.hash(usuario.password, null, null, function (err, hash) {
				usuario.password = hash;
			});
		}

		//Creamos al usuario
		await usuario.save((err, data) => {
			if (err) {
				res.status(500).send({message: "Error al guardar el usuario"});
			} else {
				if (!data) {
					res.status(404).send({message: "No se ha registrado el usuario"});
				} else {
					res.status(200).send({
						usuario: data,
						token: jwt.createToken(data),
						message: "Usuario creado correctamente",
					});
				}
			}
		});
	} catch (error) {
		res.status(400).send("Hubo un error");
	}
}

function loginUsuario(req, res) {
	//Validar errores que se definifieron en la ruta
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).send({message: errores.array()});
	}

	var params = req.body;
	var email = params.email;
	var password = params.password;

	Usuario.findOne({email: email.toLowerCase()}, (err, data) => {
		if (err) {
			res.status(500).send({message: "Error en la petición"});
		} else {
			if (!data) {
				res.status(404).send({message: "El usuario no existe"});
			} else {
				//Comprobar password
				bcrypt.compare(password, data.password, function (err, check) {
					if (check) {
						//devolver datos del usuario
						if (params.gethash) {
							//devolver un token de jwt
							res.status(200).send({token: jwt.createToken(data)});
						} else {
							res.status(200).send({data});
						}
					} else {
						res.status(404).send({message: "Clave erronea"});
					}
				});
			}
		}
	});
}

function actualizarUsuario(req, res) {
	var usuarioId = req.params.id;
	var update = req.body;

	Usuario.findByIdAndUpdate(usuarioId, update, (err, userUpdated) => {
		if (err) {
			res.status(500).send({message: "Error al actualizar el usuario"});
		} else {
			if (!userUpdated) {
				res
					.status(404)
					.send({message: "No se ha podido actualizar el usuario"});
			} else {
				res.status(200).send({usuario: userUpdated});
			}
		}
	});
}

function getUsuarios(req, res) {
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}

	var itemsPerPage = 10;

	Usuario.find()
		.sort("firstname")
		.paginate(page, itemsPerPage, function (err, user, total) {
			if (err) {
				res.status(500).send({message: "Error en la peticion"});
			} else {
				if (!user) {
					res.status(404).send({message: "No hay usuarios"});
				} else {
					return res.status(200).send({total_items: total, user: user});
				}
			}
		});
}

async function getUserToken(req, res) {
	try {
		const usuario = await Usuario.findById(req.user.id).select("-password");
		console.log(usuario);
		if (usuario) {
			return res.status(200).send({usuario, message: "Autenticado"});
		} else {
			res.status(404).send({message: "El usuario no está autenticado"});
		}
	} catch (error) {
		res.status(500).send({message: "Error en la peticion"});
	}
}

module.exports = {
	loginUsuario,
	agregarUsuario,
	actualizarUsuario,
	getUsuarios,
	getUserToken,
};
