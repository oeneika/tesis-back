"use strict";

var express = require("express");
var CamaraController = require("../controllers/camaras");
var md_auth = require("../middlewares/authenticated");
var api = express.Router();

api.get("/camaras/:id", md_auth.ensureAuth, CamaraController.getCamara);
api.post("/camaras", md_auth.ensureAuth, CamaraController.saveCamara);
api.get("/camaras/:page?", md_auth.ensureAuth, CamaraController.getCamaras);
api.put("/camaras/:id", md_auth.ensureAuth, CamaraController.UpdateCamara);
api.delete("/camaras/:id", md_auth.ensureAuth, CamaraController.DeleteCamara);

module.exports = api;
