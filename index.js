"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3977;
mongoose.Promise = global.Promise;

mongoose.connect(
	"mongodb://localhost:27017/sistema_de_vigilancia",
	(err, res) => {
		if (err) {
			throw err;
		} else {
			console.log("La base de datos está corriendo perfectamente");
			app.listen(port, function () {
				console.log(
					"Servidor de la API Rest escuchando en http://localhost:" + port
				);
			});
		}
	}
);
