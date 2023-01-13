const {validationResult} = require('express-validator') 
const path = require('path')
const galleryModel = require('../models/galleryModel')
const fs = require('fs')

exports.createGallery = (req, res, next) => {
   const errors = validationResult(req)

   if(!errors.isEmpty()){
    const err = new Error('Terdapat kesalahan dalam upload gambar')
    err.errorStatus = 400
    err.data = errors.array()
    throw err
   }

   if(!req.file){
    const err = new Error('Image tidak sesuai')
    err.errorStatus = 422
    err.data = errors.array()
    throw err
   }

   const nama = req.body.nama
   const image = req.file.path
   const category = req.body.category

   const Upload = new galleryModel({
    nama: nama,
    category: category,
    image: image
   })

   Upload.save()
   .then(result => {
    res.status(201).json({
        message: 'Upload image success',
        data: result
    })
   })
   .catch(err => {
    console.log('err : ', err)
   })
}

exports.getAllGallery = (req, res, next) => {
    const currentPage = req.query.page || 1
    const perPage = req.query.perPage || 5
    let totalItems

    galleryModel.find()
    .countDocuments()
    .then(count => {
        totalItems = count
        return galleryModel.find()
        .skip((parseInt(currentPage)-1)*parseInt(perPage))
        .limit(parseInt(perPage))
    })
    .then()
    .catch(err => {
        next(err)
    })

    galleryModel.find()
    .then(result => {
        res.status(200).json({
            message: 'Gallery berhasil ditampilkan',
            data: result,
            total_data: totalItems,
            per_page : parseInt(perPage),
            current_page: currentPage
        })
    })
    .catch(err => {
        next(err)
    })
}

exports.deleteGallery = (req, res, next) => {
    const galleryId = req.params.galleryId

    galleryModel.findById(galleryId)
    .then(post => {
        if(!post){
            const error = new Error('Gambar tidak ditemukan')
            error.errorStatus = 404
            throw error
        }
        console.log('galleryId',post)
        removeImage(post.image)
        return galleryModel.findByIdAndDelete(galleryId)
    })
    .then(result => {
        res.status(200).json({
            message: 'Gambar berhasil dihapus',
            data: result
        })
    })
    .catch(err => {
        next(err)
    })
}

const removeImage = (filePath) => {
    console.log('filePath', filePath) 
    console.log('dir name', __dirname)

    filePath = path.join(__dirname,'../',filePath)
    fs.unlink(filePath, err => console.log(err)) 
}
