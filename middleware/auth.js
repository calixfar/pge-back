<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const { validateExistUser } = require('../functions/user');
module.exports = async function (req, res, next) {
    try {
        const token = req.header('x-auth-token');
        const error = new Error;
        error.name = "internal";
        if(!token) {
            error.message = "Token not found";
            throw error;
        }
        const encryption = jwt.verify(token, process.env.KEY_SECRET);
        const searchUserLogged = await validateExistUser(encryption.user);
        // if(!user) {
        //     error.message = "User no logged";
        //     throw error;
        // }
        req.user = searchUserLogged;
        next();
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "token not valide"
        });
    }
=======
const jwt = require('jsonwebtoken');
const { validateExistUser } = require('../functions/user');
module.exports = async function (req, res, next) {
    try {
        const token = req.header('x-auth-token');
        const error = new Error;
        error.name = "internal";
        if(!token) {
            error.message = "Token not found";
            throw error;
        }
        const encryption = jwt.verify(token, process.env.KEY_SECRET);
        const searchUserLogged = await validateExistUser(encryption.user);
        // if(!user) {
        //     error.message = "User no logged";
        //     throw error;
        // }
        req.user = searchUserLogged;
        next();
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "token not valide"
        });
    }
>>>>>>> de82140dca08ba22227881f57a005d47329975dc
}