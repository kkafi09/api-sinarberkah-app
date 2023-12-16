const express = require("express");
const multer = require("multer");
const router = express.Router();

const articleController = require("../controllers/articleController");
const jwtAuth = require("../middlewares/jwtAuth");

const uploader = multer();

router.get("/", articleController.getArticles);

router.get("/:articleId", articleController.getArticleById);

router.get("/:category", articleController.getArticleByCategory);

router.post(
  "/",
  [uploader.single("image")],
  articleController.createArticle
);

router.put(
  "/:articleId",
  [uploader.single("image")],
  articleController.updateArticle
);

router.delete(
  "/:articleId",
  articleController.deleteArticle
);

module.exports = router;
