const Team = require('./../models/team');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const { validateTypeUser } = require('../functions/user');
const { validateDataInBd } = require('../functions/general');

exports.insertTeam = async (req, res) => {
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
        const { name, field_manager } = req.body;
        let newTeam = Team(req.body);
        if( field_manager !== null) {
            console.log('entro if')
            const userField = await User.findOne({_id: field_manager});
            console.log( userField );
            if(userField.assign_team !== null) {
                error.message = "El field Manager seleccionado ya se encuentra asignado a una equipo";
                throw error;
            }
            await User.findOneAndUpdate({_id: field_manager}, {assign_team: newTeam._id});
        }
        await newTeam.save();
        res.json({
            status: true,
            team: newTeam
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al registrar"
        })
    }
}

exports.getTeams = async( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        let paramsQuery = {};
        if( user.type_user === "FIELD_MANAGER" ) {
            paramsQuery._id = user.team_id;
        }
        const teams = await Team.find(paramsQuery)
        .populate('field_manager', '-password -works')
        .populate('members.user', '-password -works');
        res.json({
            status: true,
            teams
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al obtener los equipos"
        })
    }
}
exports.getTeam = async (req, res) => {
    try { 
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const { id } = req.params;
        const searchTeam = await Team.findById(id)
        .populate('field_manager', '-password -works')
        .populate('members.user', '-password');;
        if(searchTeam === null) {
            const error = new Error();
            error.name = "internal";
            error.message = "No se encontro equipo con ese id"
            throw error;
        }
        res.json({
            status: true,
            team: searchTeam
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al obtener los datos del equipo"
        });
    }
}

exports.updateTeam = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const error = new Error();
        error.name = "internal";
        const { id } = req.params;
        const { field_manager } = req.body;
        const searchTeam = await Team.findOne({_id: id});
        if(searchTeam === null) {
            error.message = "El equipo no se encuentra registrado";
            throw error;
        }
        if( field_manager !== null) {
            console.log('team', req.body);
            const userField = await User.findOne({_id: field_manager});
            console.log(userField.team_lead != searchTeam._id, userField.team_lead, searchTeam._id)
            if( userField.team_lead.toString() != searchTeam._id.toString()) {
                error.message = "El field Manager seleccionado ya se encuentra asignado a una equipo";
                throw error;
            }
            await User.findOneAndUpdate({_id: field_manager}, {team_lead: searchTeam._id});
        }
        const newTeam = await Team.findOneAndUpdate({_id: id}, req.body, {new: true});
        res.json({
            status: true,
            team: newTeam
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al actualizar los datos del equipo"
        });
    }
}
exports.deleteTeam= async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        const error = new Error();
        error.name = "internal";
        const { id } = req.params;
        const searchTeam = await Team.findById(id);
        if(searchTeam === null) {
            error.message = "El equipo no se encuentra registrado";
            throw error;
        }
        await Team.findOneAndDelete({_id: id});
        res.json({
            status: true,
            msg: "El equipo fue eliminado con éxito"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.name === "internal"? error.message : "Error al eliminar el equipo"
        });
    }
}

