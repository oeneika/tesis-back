"use strict";

//SUBIR Y VER IMAGENES
var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");

var Camara = require("../models/camera");
var Capture = require("../models/capture");
var User_capture = require("../models/captured_user");

function getCamara(req, res) {
	var camaraId = req.params.id;
	Camara.findById(camaraId, (err, camara) => {
		if (err) {
			res.status(500).send({message: "Error en la peticion"});
		} else {
			if (!camara) {
				res.status(404).send({message: "La camara no existe"});
			} else {
				res.status(200).send({camara});
			}
		}
	});
}

function getCamaras(req, res) {
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}

	var itemsPerPage = 3;

	Camara.find()
		.sort("name")
		.paginate(page, itemsPerPage, function (err, camaras, total) {
			if (err) {
				res.status(500).send({message: "Error en la peticion"});
			} else {
				if (!camaras) {
					res.status(404).send({message: "No hay camaras"});
				} else {
					return res.status(200).send({total_items: total, camaras: camaras});
				}
			}
		});
}

function saveCamara(req, res) {
	var camara = new Camara();
	var params = req.body;

	camara.name = params.name;
	camara.battery = params.battery;
	camara.turn_screen = params.turn_screen;
	camara.resolution = params.resolution;
	camara.flash = params.flash;
	camara.power = params.power;
	camara.user = params.user;

	camara.save((err, camaraStored) => {
		if (err) {
			res.status(500).send({message: "Error al guardar la camara"});
		} else {
			if (!camaraStored) {
				res.status(404).send({message: "La camara no ha sido guardada"});
			} else {
				res.status(200).send({camara: camaraStored});
			}
		}
	});
}

function UpdateCamara(req, res) {
	var camaraId = req.params.id;
	var update = req.body;

	Camara.findByIdAndUpdate(camaraId, update, (err, camaraUpdated) => {
		if (err) {
			res.status(500).send({message: "Error al actualizar la camara"});
		} else {
			if (!camaraUpdated) {
				res.status(404).send({message: "La camara no ha sido actualizada"});
			} else {
				res.status(200).send({camara: camaraUpdated});
			}
		}
	});
}

function DeleteCamara(req, res) {
	var camaraId = req.params.id;

	//ELIMINAMOS LA CAMARA
	Camara.findByIdAndRemove(camaraId, (err, camaraRemoved) => {
		if (err) {
			res.status(500).send({message: "Error al eliminar la camara"});
		} else {
			if (!camaraRemoved) {
				res.status(404).send({message: "La camara no ha sido eliminada"});
			} else {
				//ELIMINAMOS LAS CAPTURADAS ASOCIADAS A LA CAMARA
				Capture.find({
					camara: camaraRemoved._id,
				}).remove((err, captureRemoved) => {
					if (err) {
						res.status(500).send({message: "Error al eliminar la captura"});
					} else {
						if (!captureRemoved) {
							res
								.status(404)
								.send({message: "La captura no ha sido eliminada"});
						} else {
							//ELIMINAMOS LOS ROSTROS DE LOS USUARIOS ASOCIADOS A LA CAPTURA
							User_capture.find({
								capture: captureRemoved._id,
							}).remove((err, user_captureRemoved) => {
								if (err) {
									res
										.status(500)
										.send({message: "Error al eliminar la captura"});
								} else {
									if (!user_captureRemoved) {
										res
											.status(404)
											.send({message: "La captura no ha sido eliminada"});
									} else {
										res.status(200).send({
											message:
												"Camara, capturas y rostros de usuarios capturados eliminados",
										});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

module.exports = {
	getCamara,
	saveCamara,
	getCamaras,
	UpdateCamara,
	DeleteCamara,
};
