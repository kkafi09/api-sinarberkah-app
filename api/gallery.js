const express = require("express");
const multer = require("multer");
const router = express.Router();

const galleryController = require("../controllers/galleryController");
const jwtAuth = require("../middlewares/jwtAuth");

const uploader = multer();

router.post("/", [uploader.single("image")], galleryController.createGallery);

router.get("/", galleryController.getGalleries);

router.get("/:category", galleryController.getGalleryByCategory);

router.delete("/:galleryId", galleryController.deleteGallery);

module.exports = router;
