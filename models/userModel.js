const mongoose = require("mongoose")
const Schema = mongoose.Schema          
const userModel = new Schema({
    nama: {
        type:String,
        required: true
    }, 
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps: true 
})


module.exports = mongoose.model('userModel', userModel) 