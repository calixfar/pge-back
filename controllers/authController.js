const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
exports.authUser = async (req, res) => {
    const { email, password } = req.body;
    const generalError = new Error();
    generalError.name = "internal";
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(400).json({
                validate: false,
                errors: errors.array()
            });
        }
        const searchUser = await User.findOne({email});
        console.log(searchUser);
        if(searchUser === null) {
            generalError.message = "Email o contraseña incorrectos1";
            throw generalError;
        }
        if(searchUser.password !== password) {
            generalError.message = "Email o contraseña incorrectos";
            throw generalError;
        }
        const payload = {
            user: searchUser._id
        }
        //expired in a week
        jwt.sign(payload, process.env.KEY_SECRET, {expiresIn: 3600 * 24 * 7}, (error, token) => {
            if(error) {
                generalError.message = "token no valido";
                throw generalError;
            }
            res.json({token});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: generalError.name === "internal"? generalError.message : "error al ingresar"
        })
    }
}
exports.getUserAuth = async (req, res) => {
    try {
        // const user = await User.findById(req.usuario.id).select('-password');
        res.json({user: req.user});
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            msg: "Hubo un error"
        });
    }
}