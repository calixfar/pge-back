const Place = require('./../models/places');
const { validationResult } = require('express-validator');
const { validateTypeUser } = require('../functions/user');
const { validateDataInBd } = require('../functions/general');
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
        let duplicate = await validateDataInBd(Place, {code_site}, req.body, "Ya hay un lugar registrado con este código");
        if( !duplicate ) {
            let newPlace = Place(req.body);
            await newPlace.save();
        }
        res.json({
            status: true
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message ? error.message : "Error al registrar"
        })
    }
}
exports.masiveInsert = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const places = req.body;
        // console.log('places', places);
        let filterPlaces = [];
        let repeatPlace = [];
        for (let i = 0; i < places.length; i++) {
            const place = await Place.findOne({code_site: places[i].code_site});
            if( place === null ) filterPlaces.push(places[i]);
            else if ( place.status === false ) {
                let newPlace = places[i];
                newPlace.status = true; 
                await Place.findOneAndUpdate({code_site: places[i].code_site}, newPlace);
            }
            else repeatPlace.push(parseInt(i) + 2); 
        }
        // console.log('filterPlaces', filterPlaces );
        // console.log('repeatPlace', repeatPlace );
        for (let i in filterPlaces) {
            let temPlace = new Place(filterPlaces[i]);
            await temPlace.save();
        }
        console.log(filterPlaces, repeatPlace.length);
        if(filterPlaces.length == places.length || repeatPlace.length == places.length) {
            const error = new Error();
            error.name = 'All repeat';
            error.message = 'Todos los registros del archivos ya se encuentran creados en la base de datos';
            throw error;
        }

        let msg = repeatPlace.length > 0 ?  `Lugares creados correctamente a excepción por duplicidad en la base de datos de las líneas: ${repeatPlace.toString()}` :
        `Todos los lugares fueron guardados con éxito`
        res.json({
            status: true,
            msg
        })
    } catch (error) {
        console.log(error);
        let msg =  error.message ? error.message : 'Algo salío mal';
        res.status(500).json({
            status: false,
            msg
        })
    }
};

exports.getPlaces = async( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
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