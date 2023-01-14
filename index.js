require("dotenv").config();
const express = require('express')                 
const bodyParser = require('body-parser')           
const mongoose = require('mongoose')               
const multer = require('multer')                    
const path = require('path')

const app = express();
const galleryApi = require('./api/gallery')
const userApi = require('./api/user')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null,new Date().getTime() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(bodyParser.json())
app.use('/images',express.static(path.join(__dirname, 'images')))
app.use(multer({storage: fileStorage, fileFilter:fileFilter}).single('image'))

app.use('/gallery', galleryApi)
app.use('/user', userApi)

const user = require("./api/user")
app.use('/api', user)


app.use((error,req,res,next) => {
  const status = error.erroStatus || 500
  const message = error.message
  const data = error.data
  res.status(status).json({message: message, date: data})
})

// connect to db
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