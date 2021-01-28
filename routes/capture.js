"use strict";

var express = require("express");
var CaptureController = require("../controllers/capture");
var md_auth = require("../middlewares/authenticated");
var api = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "./uploads/captures"});

api.get("/capture/:id", md_auth.ensureAuth, CaptureController.getCapture);
api.post("/capture", md_auth.ensureAuth, CaptureController.saveCapture);
api.get("/capture/:page?", md_auth.ensureAuth, CaptureController.getCaptures);
api.put("/capture/:id", md_auth.ensureAuth, CaptureController.UpdateCapture);
api.delete("/capture/:id", md_auth.ensureAuth, CaptureController.DeleteCapture);
api.post(
	"/upload-image-capture/:id",
	[md_auth.ensureAuth, md_upload],
	CaptureController.uploadImage
);
api.get("/get-image-capture/:imageFile", CaptureController.getImageFile);

module.exports = api;
