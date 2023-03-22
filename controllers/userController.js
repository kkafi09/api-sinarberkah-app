const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  const {nama, email, password } =req.body

  try {
    const user = await User.register(nama, email, password)
  }
  catch (err){

  }
}
exports.loginUser = async (req, res, next) => {
    res.json({msg: 'login user'})
}

