const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleModel = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: {
        image_id: String,
        image_url: String,
      },
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleModel);
