require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const galleryApi = require("./api/gallery");
const userApi = require("./api/user");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "/public/images")));

app.use("/api/gallery/v1/", galleryApi);
app.use("/api/user/v1/", userApi);

app.use((error, req, res, next) => {
  const status = error.erroStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, date: data });
});

// Connect to the server and DB
const port = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connected to mongodb and Express running on port " + port);
    });
  })
  .catch((error) => console.log(error));

module.exports = app;
