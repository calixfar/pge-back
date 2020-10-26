const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { convertErrorExpressValidator } = require('../functions/general');
exports.authUser = async (req, res) => {
    const { email, password } = req.body;
    const generalError = new Error();
    generalError.name = "internal";
    try {
        convertErrorExpressValidator(validationResult(req).array());
        const searchUser = await User.findOne({email});
        console.log(searchUser);
        if(searchUser === null) {
            generalError.message = "Email o contraseña incorrectos";
            throw generalError;
        }
        if(searchUser.password !== password) {
            generalError.message = "Email o contraseña incorrectos";
            throw generalError;
        }
        const payload = {
            user: searchUser._id
        }
        //expired in a month
        jwt.sign(payload, process.env.KEY_SECRET, {expiresIn: 3600 * 24 * 30 * 12}, (error, token) => {
            if(error) {
                generalError.message = "token no valido";
                throw generalError;
            }
            res.json({token});
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "error al ingresar"
        })
    }
}
exports.getUserAuth = async (req, res) => {
    try {
        // const user = await User.findById(req.usuario.id).select('-password');
        console.log('request');
        res.json({user: req.user});
    } catch (error) {
        console.log('error get', error)
        res.status(500).json({
            status: false,
            msg: "Hubo un error"
        });
    }
}