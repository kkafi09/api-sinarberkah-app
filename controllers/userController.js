const userModel = require("../models/userModel")
const bcryptjs = require("bcryptjs")
const config = require("../config/config")
const jwt = require("jsonwebtoken")
const createToken  =async(id)=>{
    try{
        const token = await jwt.sign({ _id:id}, config.secret_jwt)
        return token;
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const securePassword = async(password) => {
    try{
        const passwordHash = await bcryptjs.hash(password,8);
        return passwordHash
    } catch (error){
        res.status(400).send(error.message)
    }
}

exports.register = async(req, res) => {
    const spassword = await securePassword(req.body.password)

    try {
        const user = new userModel({
            nama:req.body.nama,
            email:req.body.email,
            password:spassword
        })

        const userData = await userModel.findOne({email:req.body.email})

        if(userData){
            res.status(200).send({success:false, message:"This email is alredy exixts"})
        } else{
            const user_data = await user.save()
            res.status(200).send({success:true, data:user_data})
        }
    } catch (error){
        res.status(400).send(error.message)
    }
}

exports.login = async(req,res)=>{
    try {

        const email = req.body.email
        const password = req.body.password
        const userData = await userModel.findOne({ email:email})
    
        if(userData){
            const passwordMatch = await bcryptjs.compare(password, userData.password)
            if(passwordMatch){
                const tokenData = await createToken(userData._id)
                const userResult = {
                    _id:userData._id,
                    name:userData.name,
                    email:userData.email,
                    passwoord:userData.password,
                    type:userData.type,
                    token: tokenData
                }
                const response = {
                    succes:true,
                    message: "User Details",
                    data:userResult
                }
                res.status(200).send(response)
            } else  {
            res.status(200).send({succes:false,message:"Login details are incorect"})
            }
        } else  {
            res.status(200).send({succes:false,message:"Login details are incorect"})
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
}
