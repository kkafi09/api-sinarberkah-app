const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt, {
      expiresIn: "2h",
    });
    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
};

const securePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error("Error generating password");
  }
};

exports.register = async (req, res) => {
  const { nama, email, password } = req.body;
  const spassword = await securePassword(password);

  try {
    const user = new User({ nama, email, password: spassword });

    const exixts = await User.findOne({ email: req.body.email });

    if (exixts) {
      res
        .status(400)
        .send({ success: false, message: "This email is alredy exixts" });
    }

    const newUser = await user.save();
    res.status(200).send({ success: true, data: newUser });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(email, password);
    console.log("user", user);

    if (!user) {
      return res
        .status(400)
        .send({ succes: false, message: "Login credentials incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .send({ succes: false, message: "Login credentials incorrect p" });
    }

    const tokenData = await createToken(user._id);
    const userResult = {
      _id: user._id,
      name: user.name,
      email: user.email,
      passwoord: user.password,
      type: user.type,
      token: tokenData,
    };

    const response = {
      succes: true,
      message: "User Details",
      data: userResult,
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
