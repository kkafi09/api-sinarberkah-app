const express = require('express')
const {body} = require('express-validator')
const router  = express.Router()

const galleryController = require('../controllers/galleryController')

/* Router CREATE */
router.post('/post', [
    body('nama').isLength({min:10}).withMessage('Minimal 10 karakter'),
    body('category').isLength({min:5}).withMessage('Minimal 5 karater'),
    galleryController.createGallery
])

router.get('/posts', galleryController.getAllGallery)

router.delete('/post/:galleryId', galleryController.deleteGallery)


module.exports = router