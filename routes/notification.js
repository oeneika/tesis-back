"use strict";

var express = require("express");
var NotificationController = require("../controllers/notifications");
var md_auth = require("../middlewares/authenticated");
var api = express.Router();
var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "./uploads/captures"});

api.get(
	"/notifications/:page?",
	md_auth.ensureAuth,
	NotificationController.getNotifications
);
api.post(
	"/notifications",
	md_auth.ensureAuth,
	NotificationController.SaveNotifications
);
api.delete(
	"/notifications/:id",
	md_auth.ensureAuth,
	NotificationController.DeleteNotifications
);
api.post(
	"/upload-image-notification/:id",
	[md_auth.ensureAuth, md_upload],
	NotificationController.uploadImage
);
api.get(
	"/get-image-notification/:imageFile",
	NotificationController.getImageFile
);

module.exports = api;
