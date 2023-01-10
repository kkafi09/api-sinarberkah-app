const express = require('express')
const router = express.Router();

const AuthConstroller = require('../controllers/AuthController')

router.post('/login', AuthConstroller.login)

module.exports = router