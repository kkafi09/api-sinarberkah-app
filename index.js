require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 4000;
const { connectToDB } = require("./helpers/db.js");

const app = express();
const galleryApi = require("./api/gallery");
const userApi = require("./api/user");
const articleApi = require("./api/article");

connectToDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "/public/images")));

app.use("/api/gallery/v1/", galleryApi);
app.use("/api/user/v1/", userApi);
app.use("/api/article/v1/", articleApi);

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to the gallery API. this service is working properly",
  });
});

app.use((error, req, res, next) => {
  const status = error.erroStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, date: data });
});

app.listen(port, () => {
  console.log(`Express running on port ${port}`);
});

module.exports = app;
