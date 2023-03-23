const express = require("express");
const multer = require("multer");
const router = express.Router();

const productController = require("../controllers/productController");
const jwtAuth = require("../middlewares/jwtAuth");

const uploader = multer();

router.post(
  "/",
  [jwtAuth.verifyToken, uploader.single("image")],
  productController.createProduct
);

router.get("/", productController.getProducts);

router.put("/:productId", jwtAuth.verifyToken, productController.updateProduct);

router.delete(
  "/:productId",
  jwtAuth.verifyToken,
  productController.deleteProduct
);

module.exports = router;
