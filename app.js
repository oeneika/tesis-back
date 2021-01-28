"use strict";

var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");

var app = express();
app.use(cors());

//Cargar rutas
var usuario_routes = require("./routes/users");
var notification_routes = require("./routes/notification");
var camara_routes = require("./routes/camara");
var capture_routes = require("./routes/capture");
var captured_user_routes = require("./routes/captured_user");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras http

// rutas base
app.use("/api", usuario_routes);
app.use("/api", camara_routes);
app.use("/api", capture_routes);
app.use("/api", captured_user_routes);
app.use("/api", notification_routes);

module.exports = app;
