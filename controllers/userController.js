const User = require("../models/userModel");
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3h'})
}

exports.registerUser = async (req, res) => {
  const {name, email, password } = req.body

  try {
    const user = await User.register(name, email, password)

    const token = createToken(user._id)

    res.status(200).json({email, token})
  }
  catch (error){
    res.status(400).json({error: error.message})
  }
}

exports.loginUser = async (req, res, next) => {
  const {email, password } = req.body

  try {
    const user = await User.login(email, password)

    const token = createToken(user._id)
    res.status(200).json({email, token})
  }
  catch (error){
    res.status(400).json({error: error.message})
  }
}

