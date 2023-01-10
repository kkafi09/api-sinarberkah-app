const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const adminModel = require('../models/adminModel')

const login  = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    adminModel.findOne({$or: [{email:username},{phone:username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, resullt){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(resullt){
                    let token = jwt.sign({name: user.name}, 'verySecretValuue', {expiresIn: '1h'})
                    res.json({
                        message: 'login succesfull',
                        token
                    })
                }
            })
        } else {
            req.json({
                message: "no user found"
            })
        }
    })
}

module.exports = {login}