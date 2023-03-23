const Article = require("../models/articleModel");
const imagekit = require("../helpers/imagekit");

const createSlug = (document) => {
  const slug = document
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return slug;
};

exports.createArticle = async (req, res) => {
  const { title, content, category, user_id } = req.body;
  try {
    const uploadFile = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: "plato-article",
    });

    const article = new Article({
      title: title,
      slug: createSlug(title),
      category: category,
      content: content,
      user_id: user_id,
      image: {
        image_id: uploadFile.fileId,
        image_url: uploadFile.url,
      },
    });

    await article.save();

    res.status(201).json({
      message: "Success add new article",
      data: article,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getArticles = async (req, res, next) => {
  const page = req.query.page || 1;
  const quantity = req.query.quantity || 5;
  let totalItems;

  const article = await Article.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;

      return Article.find()
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(quantity))
        .limit(parseInt(quantity));
    })
    .catch((err) => {
      next(err);
    });

  const metaModel = {
    page: page,
    quantity: quantity,
    totalPage: Math.ceil(totalItems / quantity),
    totalData: totalItems,
  };

  return res.status(200).json({
    success: true,
    data: article,
    meta: metaModel,
    message: "Successfully get article",
  });
};

exports.getArticleById = async (req, res) => {
  const { articleId } = req.params;

  Article.findById(articleId).then((article) => {
    if (!article) {
      return res.status(404).json({
        status: false,
        message: "Article not found",
      });
    }
    return res.status(200).json({
      status: true,
      data: article,
      message: "success get article",
    });
  });
};

exports.getArticleByCategory = (req, res) => {
  const category = req.params.category;

  Article.find({ category })
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Article not found",
        });
      }

      return res.status(200).json({
        status: true,
        data: result,
        message: "success get article",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    });
};

exports.updateArticle = async (req, res) => {
  const { articleId } = req.params;
  const { title, content, category } = req.body;

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res
        .status(404)
        .send({ status: false, message: "Article not found" });
    }

    // Check if a new image is uploaded
    if (req.file) {
      // Delete the old image from ImageKit
      if (article.image) {
        await imagekit.deleteFile(article.image.image_id);
      }

      // Upload the new image to ImageKit
      const imageFile = req.file;
      const result = await imagekit.upload({
        file: imageFile.buffer.toString("base64"),
        fileName: imageFile.originalname,
        folder: "plato-article",
      });

      article.image.image_url = result.url;
      article.image.image_id = result.fileId;
    }

    // Update the article without updating the image
    article.title = title;
    article.slug = createSlug(title);
    article.content = content;
    article.category = category;

    await article.save();

    return res.status(200).json({
      status: true,
      message: "success update article",
      data: article,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

exports.deleteArticle = (req, res, next) => {
  const articleId = req.params.articleId;

  Article.findById(articleId, (err, doc) => {
    if (err) {
      return res.status(401).json({
        succes: false,
        message: "Article not found",
      });
    }

    const image_id = doc.image.image_id;

    doc.deleteOne((err) => {
      if (err) {
        return res.status(400).json({
          succes: false,
          message: "Fail to delete article",
        });
      }

      imagekit.deleteFile(image_id).then((err, result) => {
        return res.status(200).json({
          succes: true,
          message: "success delete article",
          data: result,
        });
      });
    });
  });
};
