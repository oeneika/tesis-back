"use strict";

//SUBIR Y VER IMAGENES
var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");

var Capture = require("../models/capture");
var User_capture = require("../models/captured_user");

function getCapture(req, res) {
	var captureId = req.params.id;
	Capture.findById(captureId, (err, capture) => {
		if (err) {
			res.status(500).send({message: "Error en la peticion"});
		} else {
			if (!capture) {
				res.status(404).send({message: "La capture no existe"});
			} else {
				res.status(200).send({capture});
			}
		}
	});
}

function getCaptures(req, res) {
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}

	var itemsPerPage = 3;

	Capture.find()
		.sort("name")
		.paginate(page, itemsPerPage, function (err, capture, total) {
			if (err) {
				res.status(500).send({message: "Error en la peticion"});
			} else {
				if (!capture) {
					res.status(404).send({message: "No hay captures"});
				} else {
					return res.status(200).send({total_items: total, capture: capture});
				}
			}
		});
}

function saveCapture(req, res) {
	var capture = new Capture();
	var params = req.body;

	capture.name = params.name;
	capture.size = params.size;
	capture.image = "null";
	capture.duration = params.duration;
	capture.camera = params.camera;

	capture.save((err, captureStored) => {
		if (err) {
			res.status(500).send({message: "Error al guardar la captura"});
		} else {
			if (!captureStored) {
				res.status(404).send({message: "La captura no ha sido guardada"});
			} else {
				res.status(200).send({capture: captureStored});
			}
		}
	});
}

function UpdateCapture(req, res) {
	var captureId = req.params.id;
	var update = req.body;

	Capture.findByIdAndUpdate(captureId, update, (err, captureUpdated) => {
		if (err) {
			res.status(500).send({message: "Error al actualizar la captura"});
		} else {
			if (!captureUpdated) {
				res.status(404).send({message: "La captura no ha sido actualizada"});
			} else {
				res.status(200).send({capture: captureUpdated});
			}
		}
	});
}

function DeleteCapture(req, res) {
	var captureId = req.params.id;

	//ELIMINAMOS LA CAMARA
	Capture.findByIdAndRemove(captureId, (err, captureRemoved) => {
		if (err) {
			res.status(500).send({message: "Error al eliminar la captura"});
		} else {
			if (!captureRemoved) {
				res.status(404).send({message: "La captura no ha sido eliminada"});
			} else {
				User_capture.find({
					capture: captureRemoved._id,
				}).remove((err, user_captureRemoved) => {
					if (err) {
						res.status(500).send({
							message: "Error al eliminar el rostro del usuario capturado",
						});
					} else {
						if (!user_captureRemoved) {
							res.status(404).send({
								message: "El rostro del usuario capturado no ha sido eliminado",
							});
						} else {
							res.status(200).send({
								message: "Captura y rostros de usuarios eliminados",
							});
						}
					}
				});
			}
		}
	});
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
	getCapture,
	getCaptures,
	saveCapture,
	UpdateCapture,
	DeleteCapture,
	uploadImage,
	getImageFile,
};
