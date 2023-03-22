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

userModel.static.register = async (nama, email, password) => {
    const exists = await this.findOne({email})

    if(exists) {
        throw Error('Email alredy in use')
    }

    const salt = await bcrypt.gensalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ nama, email, password: hash})

    return user
}


module.exports = mongoose.model("User", userModel); 