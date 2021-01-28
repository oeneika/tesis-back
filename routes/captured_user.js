"use strict";

var express = require("express");
var CapturedUserController = require("../controllers/captured_user");
var md_auth = require("../middlewares/authenticated");
var api = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "./uploads/captured_users"});

api.get(
	"/captured_user/:id",
	md_auth.ensureAuth,
	CapturedUserController.getCapturedUser
);
api.post(
	"/captured_user",
	md_auth.ensureAuth,
	CapturedUserController.saveCapturedUser
);
api.get(
	"/captured_user/:page?",
	md_auth.ensureAuth,
	CapturedUserController.getCapturedUsers
);
api.put(
	"/captured_user/:id",
	md_auth.ensureAuth,
	CapturedUserController.UpdateCapturedUser
);
api.delete(
	"/captured_user/:id",
	md_auth.ensureAuth,
	CapturedUserController.DeleteCapturedUser
);
api.post(
	"/upload-image-captured_user/:id",
	[md_auth.ensureAuth, md_upload],
	CapturedUserController.uploadImage
);
api.get(
	"/get-image-captured_user/:imageFile",
	CapturedUserController.getImageFile
);

module.exports = api;
