const Product = require("../models/productModel");
const imagekit = require("../helpers/imagekit");

exports.createProduct = async (req, res) => {
  const { name, description, category, price } = req.body;

  try {
    const uploadFile = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: "plato-product",
    });

    const product = new Product({
      name,
      description,
      category,
      price,
      image: {
        image_id: uploadFile.fileId,
        image_url: uploadFile.url,
      },
    });

    await product.save();

    res.status(201).json({
      message: "Success add new Product",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getProducts = async (req, res, next) => {
  const page = req.query.page || 1;
  const quantity = req.query.quantity || 5;
  let totalItems;

  const product = await Product.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;

      return Product.find()
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
    data: product,
    meta: metaModel,
    message: "Successfully get Product",
  });
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, category, price } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    // Check if a new image is uploaded
    if (req.file) {
      // Delete the old image from ImageKit
      if (product.image) {
        await imagekit.deleteFile(product.image.image_id);
      }

      // Upload the new image to ImageKit
      const imageFile = req.file;
      const result = await imagekit.upload({
        file: imageFile.buffer.toString("base64"),
        fileName: imageFile.originalname,
        folder: "plato-product",
      });

      product.image.image_url = result.url;
      product.image.image_id = result.fileId;
    }

    // Update the Product without updating the image
    product.name = name;
    product.description = description;
    product.category = category;
    product.price = price;

    await product.save();

    return res.status(200).json({
      status: true,
      message: "success update Product",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: false, message: "Internal server error" });
  }
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.ProductId;

  Product.findById(productId, (err, doc) => {
    if (err) {
      res.status(401).json({
        succes: false,
        message: "Product not found",
      });
    }

    const image_id = doc.image.image_id;

    doc.deleteOne((err) => {
      if (err) {
        return res.status(400).json({
          succes: false,
          message: "Fail to delete Product",
        });
      }

      imagekit.deleteFile(image_id).then((err, result) => {
        return res.status(200).json({
          succes: true,
          message: "success delete Product",
          data: result,
        });
      });
    });
  });
};
