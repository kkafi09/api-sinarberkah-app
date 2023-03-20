const express = require("express");
const multer = require("multer");
const router = express.Router();

const galleryController = require("../controllers/galleryController");
const jwtAuth = require("../middlewares/jwtAuth");

const uploader = multer();

router.post(
  "/",
  [jwtAuth.verifyToken, uploader.single("image")],
  galleryController.createGallery
);

router.get("/", jwtAuth.verifyToken, galleryController.getGalleries);
router.get(
  "/:category",
  jwtAuth.verifyToken,
  galleryController.getGalleryByCategory
);

router.delete(
  "/:galleryId",
  jwtAuth.verifyToken,
  galleryController.deleteGallery
);

module.exports = router;
