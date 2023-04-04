const express = require("express")
const router = express()

const bodyParser = require("body-parser")

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:true}))

const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router