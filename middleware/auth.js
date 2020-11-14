const jwt = require('jsonwebtoken');
const { validateExistUser } = require('../functions/user');
module.exports = async function (req, res, next) {
    try {
        const token = req.header('x-auth-token');
        const error = new Error;
        if(!token) {
            throw error;
        }
        const encryption = jwt.verify(token, process.env.KEY_SECRET);
        const searchUserLogged = await validateExistUser(encryption.user);
        if(!searchUserLogged) {
            error.message = "User no existe";
            throw error;
        }
        req.user = searchUserLogged;
        next();
    } catch (error) {
        res.status(403).json({
            status: false,
            msg: error.message || "token not valide"
        });
    }
}