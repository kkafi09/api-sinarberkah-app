const mongoose = require('mongoose')    
const Schema = mongoose.Schema          
const galleryModel = new Schema({           
    nama: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
}, {
    timestamps: true 
})

module.exports = mongoose.model('galleryModel', galleryModel) 