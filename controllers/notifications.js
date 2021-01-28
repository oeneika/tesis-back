"use strict";

//SUBIR Y VER IMAGENES
var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination");

var Notification = require("../models/notifications");
var Usuario = require("../models/user");

//Conseguir todas las notificationes
function getNotifications(req, res) {
	var artistId = req.params.user;

	if (!artistId) {
		var find = Notification.find({}).sort("title");
	} else {
		var find = Notification.find({user: userId}).sort("year");
	}

	find.populate({path: "artist"}).exec((err, notifications) => {
		if (err) {
			res.status(500).send({message: "Error en la peticion"});
		} else {
			if (!notifications) {
				res.status(404).send({message: "No hay notificaciones"});
			} else {
				res.status(200).send({notifications});
			}
		}
	});
}

//Subir notificacion
function SaveNotifications(req, res) {
	var notification = new Notification();

	var params = req.body;
	notification.title = params.title;
	notification.description = params.description;
	notification.image = "null";
	notification.date = params.date;
	notification.user = params.user;

	notification.save((err, notificationStored) => {
		if (err) {
			res.status(500).send({message: "Error al guardar la captura"});
		} else {
			if (!notificationStored) {
				res.status(404).send({message: "La captura no ha sido guardada"});
			} else {
				res.status(200).send({notifications: notificationStored});
			}
		}
	});
}

//Eliminar una notificacion
function DeleteNotifications(req, res) {
	var notificationId = req.params.id;

	Notification.findByIdAndRemove(notificationId, (err, notificationRemoved) => {
		if (err) {
			res.status(500).send({message: "Error al eliminar la notificación"});
		} else {
			if (!notificationRemoved) {
				res.status(404).send({message: "La notificación no ha sido eliminada"});
			} else {
				res.status(404).send({notificationRemoved});
			}
		}
	});
}

function uploadImage(req, res) {
	var notificationId = req.params.id;
	var file_name = "No subido...";

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split("\\");
		var file_name = file_split[2];

		var ext_split = file_name.split(".");
		var file_ext = ext_split[1];

		if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
			Notification.findByIdAndUpdate(
				notificationId,
				{image: file_name},
				(err, notificationUpdated) => {
					if (!notificationId) {
						res
							.status(404)
							.send({message: "No se ha podido actualizar la captura"});
					} else {
						res.status(200).send({notification: notificationUpdated});
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
	var path_file = "./uploads/notifications/" + imageFile;
	fs.stat(path_file, function (exists) {
		console.log(exists);
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({message: "No existe la imagen..."});
		}
	});
}

module.exports = {
	getNotifications,
	SaveNotifications,
	getImageFile,
	uploadImage,
	DeleteNotifications,
};
