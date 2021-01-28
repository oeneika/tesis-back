"use strict";

//SUBIR Y VER IMAGENES
var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");

var Captured_user = require("../models/captured_user");

function getCapturedUser(req, res) {
	var captured_userId = req.params.id;
	Captured_user.findById(captured_userId, (err, captured_user) => {
		if (err) {
			res.status(500).send({message: "Error en la peticion"});
		} else {
			if (!captured_user) {
				res.status(404).send({message: "La capture no existe"});
			} else {
				res.status(200).send({captured_user});
			}
		}
	});
}

function getCapturedUsers(req, res) {
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}

	var itemsPerPage = 3;

	Captured_user.find()
		.sort("name")
		.paginate(page, itemsPerPage, function (err, captured_user, total) {
			if (err) {
				res.status(500).send({message: "Error en la peticion"});
			} else {
				if (!captured_user) {
					res.status(404).send({message: "No hay captures"});
				} else {
					return res
						.status(200)
						.send({total_items: total, captured_users: captured_user});
				}
			}
		});
}

function saveCapturedUser(req, res) {
	var captured_user = new Captured_user();
	var params = req.body;

	captured_user.age = params.age;
	captured_user.gender = params.gender;
	captured_user.facial_expression = params.facial_expression;
	captured_user.hour = params.hour;
	captured_user.image = "null";
	captured_user.capture = params.capture;

	captured_user.save((err, captureStored) => {
		if (err) {
			res.status(500).send({message: "Error al guardar la captura"});
		} else {
			if (!captureStored) {
				res.status(404).send({message: "La captura no ha sido guardada"});
			} else {
				res.status(200).send({captureStored});
			}
		}
	});
}

function UpdateCapturedUser(req, res) {
	var captured_userId = req.params.id;
	var update = req.body;

	Captured_user.findByIdAndUpdate(
		captured_userId,
		update,
		(err, captured_userUpdated) => {
			if (err) {
				res.status(500).send({message: "Error al actualizar la captura"});
			} else {
				if (!captured_userUpdated) {
					res.status(404).send({message: "La captura no ha sido actualizada"});
				} else {
					res.status(200).send({capture: captured_userUpdated});
				}
			}
		}
	);
}

function DeleteCapturedUser(req, res) {
	var captured_userId = req.params.id;

	//ELIMINAMOS LA CAMARA
	Captured_user.findByIdAndRemove(
		captured_userId,
		(err, captured_userRemoved) => {
			if (err) {
				res.status(500).send({message: "Error al eliminar la captura"});
			} else {
				if (!captured_userRemoved) {
					res.status(404).send({message: "La captura no ha sido eliminada"});
				} else {
					res.status(404).send({captured_userRemoved});
				}
			}
		}
	);
}

function uploadImage(req, res) {
	var captureId = req.params.id;
	var file_name = "No subido...";

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split("\\");
		var file_name = file_split[2];

		var ext_split = file_name.split(".");
		var file_ext = ext_split[1];

		if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
			Capture.findByIdAndUpdate(
				captureId,
				{image: file_name},
				(err, captureUpdated) => {
					if (!captureId) {
						res
							.status(404)
							.send({message: "No se ha podido actualizar la captura"});
					} else {
						res.status(200).send({capture: captureUpdated});
					}
				}
			);
		} else {
			res.status(200).send({message: "Extension del archivo no valida"});
		}
	} else {
		res.status(200).send({message: "No has subido ninguna imagen..."});
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = "./uploads/captures/" + imageFile;
	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({message: "No existe la imagen..."});
		}
	});
}

module.exports = {
	getCapturedUser,
	getCapturedUsers,
	saveCapturedUser,
	UpdateCapturedUser,
	DeleteCapturedUser,
	uploadImage,
	getImageFile,
};
