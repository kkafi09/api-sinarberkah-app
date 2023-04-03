const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const validator = require('validator')


const Schema = mongoose.Schema    

const userModel = new Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        unique: true,
        required: true
    },
    password: {
        type:String,
        required:true
    }
})

userModel.statics.register = async function(name, email, password) {
    
    /* Validator */
    if (!name || !email || !password){
        throw Error('All fields must be filled')
    }

    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }

    const exists = await this.findOne({ email })

    if(exists) {
        throw Error('Email alredy in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ name, email, password: hash})

    return user
}

userModel.statics.login = async function(email, password) {
     /* Validator */
     if (!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})
    if(!user){
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error('Incorrect password')
    }

    return user
}


module.exports = mongoose.model('User', userModel); 