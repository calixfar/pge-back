const User = require('./../models/user');
const Team = require('../models/team');
const { validationResult } = require('express-validator');
const { validateTypeUser } = require('../functions/user');
exports.insertUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({
            validate: false,
            errors: errors.array()
        });
    }
    try {
        const error = new Error();
        error.name = "internal";
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const { email, team_id } = req.body;
        let searchUser = await User.findOne({email});
        if(searchUser !== null) {
            error.message = "El usuario ya se encuentra registrado";
            throw error;
        }
        let newUser = User(req.body);
        await Team.findOneAndUpdate({_id: team_id}, {$push: {members: {user: newUser._id}}}, {new: true});
        await newUser.save();
        res.json({
            status: true,
            user: newUser});
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al registrar"
        })
    }
}

exports.getUsers = async( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const users = await User.find().populate('team_id', '-members');
        res.json({
            status: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al obtener los usuarios"
        })
    }
}
exports.getUsersFieldManager = async( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const users = await User.find({type_user: "FIELD_MANAGER"}).populate('-members');
        res.json({
            status: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al obtener los usuarios"
        })
    }
}
exports.getUser = async (req, res) => {
    try { 
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const { id } = req.params;
        const searchUser = await User.findById(id);;
        res.json({
            status: true,
            user: searchUser
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al obtener los datos del usuario"
        });
    }
}

exports.updateUser = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const error = new Error();
        error.name = "internal";
        const { id } = req.params;
        console.log(id);
        const searchUser = await User.findOne({_id: id});
        if(searchUser === null) {
            error.message = "El usuario no se encuentra registrado";
            throw error;
        }
        const newUser = await User.findOneAndUpdate({_id: id}, req.body, {new: true});
        res.json({
            status: true,
            user: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al actualizar los datos del usuario"
        });
    }
}
exports.deleteUser = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const error = new Error();
        error.name = "internal";
        const { id } = req.params;
        const searchUser = await User.findById(id);
        if(searchUser === null) {
            error.message = "El usuario no se encuentra registrado";
            throw error;
        }
        await User.findOneAndDelete({_id: id});
        res.json({
            status: true,
            msg: "El usuario fue eliminado con éxito"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al actualizar los datos del usuario"
        });
    }
}

