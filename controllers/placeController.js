const Place = require('./../models/places');
const { validationResult } = require('express-validator');
const { validateTypeUser } = require('../functions/user');
exports.insertPlace = async (req, res) => {
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
        const { code_site } = req.body;
        let searchPlace = await Place.findOne({code_site});
        if(searchPlace !== null) {
            error.message = "Ya hay un lugar registrado con este código";
            throw error;
        }
        let newPlace = Place(req.body);
        await newPlace.save();
        res.json({
            status: true,
            place: newPlace
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al registrar"
        })
    }
}

exports.getPlaces = async( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const places = await Place.find({status: true}).select('-status');
        res.json({
            status: true,
            places
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al obtener los lugares"
        })
    }
}
exports.getPlace = async (req, res) => {
    try { 
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const { id } = req.params;
        const searchPlace = await Place.findOne({_id: id, status: true}).select('-status');
        if(searchPlace === null) {
            const error = new Error();
            error.name = "internal";
            error.message = "No se encontro lugar con ese id"
            throw error;
        }
        res.json({
            status: true,
            place: searchPlace
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al obtener los datos del lugar"
        });
    }
}

exports.updatePlace = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const error = new Error();
        error.name = "internal";
        const { id } = req.params;
        const { code_site } = req.body;
        console.log(id);
        const searchPlace = await Place.findOne({_id: id, status: true});
        if(searchPlace === null) {
            error.message = "El lugar no se encuentra registrado";
            throw error;
        }
        if(code_site ) {
            const searchPlaceByCode = await Place.findOne({code_site, status: true});
            if(searchPlaceByCode !== null) {
                error.message = "Ya hay un lugar registrado con este código";
                throw error;
            }
        }
        const newPlace = await Place.findOneAndUpdate({_id: id}, req.body, {new: true});
        res.json({
            status: true,
            place: newPlace
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al actualizar los datos del lugar"
        });
    }
}
exports.deletePlace = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const error = new Error();
        error.name = "internal";
        const { id } = req.params;
        const searchPlace = await Place.findById(id);
        if(searchPlace === null) {
            error.message = "El lugar no se encuentra registrado";
            throw error;
        }
        await Place.findOneAndUpdate({_id: id}, {status: false});
        res.json({
            status: true,
            msg: "El equipo fue eliminado con éxito"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al eliminar el lugar"
        });
    }
}
exports.insertMasivePlaces = (req, res) => {
    console.log(req.files.file)
}
