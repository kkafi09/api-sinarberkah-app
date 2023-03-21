const express = require("express");
const multer = require("multer");
const router = express.Router();

const articleController = require("../controllers/articleController");
const jwtAuth = require("../middlewares/jwtAuth");

const uploader = multer();

router.get("/", articleController.getArticles);

router.get(
  "/:category",
  jwtAuth.verifyToken,
  articleController.getArticleByCategory
);

router.post(
  "/",
  [jwtAuth.verifyToken, uploader.single("image")],
  articleController.createArticle
);

router.put("/:articleId", jwtAuth.verifyToken, articleController.updateArticle);

router.delete(
  "/:articleId",
  jwtAuth.verifyToken,
  articleController.deleteArticle
);

module.exports = router;
