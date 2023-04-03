const Gallery = require("../models/galleryModel");
const imagekit = require("../helpers/imagekit");

/**
 * function to hancle create gallery
 * @param {title, description, caetegory, type} req.body 
 * @param {image} req.file 
 */
exports.createGallery = async (req, res) => {
  try {
    const uploadFile = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: "plato-gallery",
    });

    const gallery = new Gallery({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      image: {
        image_id: uploadFile.fileId,
        image_url: uploadFile.url,
      },
    });

    await gallery.save();

    res.status(201).json({
      message: "Success add new gallery",
      data: gallery,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * function to handle get gallery 
 * @param {page, quantity} req.query (optional)
 */
exports.getGalleries = async (req, res, next) => {
  const page = req.query.page || 1;
  const quantity = req.query.quantity || 5;
  let totalItems;

  const gallery = await Gallery.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;

      return Gallery.find()
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
    data: gallery,
    meta: metaModel,
    message: "Successfully get gallery",
  });
};

/**
 * function to handle get gallery by category
 * @param {category} req.params 
 */
exports.getGalleryByCategory = (req, res, next) => {
  const category = req.params.category;

  Gallery.find({ category })
    .then((result) => {
      if (!result) {
        const error = new Error("gallery not found: " + category);
        error.errorStatus = 404;
        throw error;
      }
      res.status(200).json({
        status: true,
        data: result,
        message: "success get gallery",
      });
    })
    .catch((err) => {
      next(err);
    });
};

/**
 * function to handle delete gallery
 * @param {galleryId} req.params 
 */
exports.deleteGallery = (req, res, next) => {
  const galleryId = req.params.galleryId;

  Gallery.findById(galleryId, (err, doc) => {
    if (err) {
      res.status(404).json({
        succes: false,
        message: "Galery not found",
      });
    }

    const image_id = doc.image.image_id;

    doc.deleteOne((err) => {
      if (err) {
        return res.status(400).json({
          succes: false,
          message: "Fail to delete gallery",
        });
      }

      imagekit.deleteFile(image_id).then((err, result) => {
        return res.status(204).json({
          succes: true,
          message: "success delete gallery",
        });
      });
    });
  });
};
