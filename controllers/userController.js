const User = require('./../models/user');
const Team = require('../models/team');
const { validationResult, param } = require('express-validator');
const { validateTypeUser } = require('../functions/user');
const team = require('../models/team');
const Notification = require('../models/notification');
const { deleteWork } = require('../functions/work');
const { deleteMember } = require('../functions/team');
const { CREATE_USER,
    UPDATE_USER,
    DELETE_USER 
} = require('../types/notification');
require('dotenv').config({
    path: 'variables.env'
});
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
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const { email, team_id } = req.body;
        let searchUser = await User.findOne({email});
        if(searchUser !== null) {
            error.message = "El usuario ya se encuentra registrado";
            throw error;
        }
        let newUser = User(req.body);
        if( newUser.type_user !== 'ADMIN' ) {
            let objTeam = {$push: {members: {user: newUser._id}}};
            if( newUser.type_user === 'FIELD_MANAGER' ) {
                if( user.type_user !== 'ADMIN' && user.team_id !== team_id ) {
                    error.message = "No tienes permiso para realizar esta operación";
                    throw error;
                }
                const searchTeam = await Team.findOne({_id: team_id});
                if( searchTeam.field_manager !== null ) {
                    error.message = "El equipo seleccionado ya tiene un Field Manager asignado";
                    throw error;
                }
                objTeam =  {field_manager :newUser._id};
            }
            await Team.findOneAndUpdate({_id: team_id}, objTeam, {new: true});
        } else newUser.team_id = null;
        await newUser.save();

        await Notification.create({
            type: CREATE_USER,
            route: `/usuario/${ newUser._id }`,
            triggeredUser: user._id,
            alteredredUser: newUser._id,
            action: `creo el usuario ${newUser.name}`
        });

        res.json({
            status: true,
            user: newUser
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            msg: error.message ? error.message : "Error al registrar"
        })
    }
}
exports.createUserAdmin = async ( req, res ) => {
    try {
        const { params: { key } } = req;

        if ( key !== process.env.KEY_SECURITY ) {
            throw Error('No tienes permiso para realizar está acción')
        }

        const dataUser = {
            email: 'superadmin@control.com',
            password: 'PG.cadmin2020',
            name: 'Super',
            last_name: 'Admin',
            phone: '312312332',
            type_user: 'ADMIN'
        }

        if( (await User.findOne({email: dataUser.email})) ) {
            throw Error('Ya existe el usuario');
        }
        const user = User(dataUser);
        await user.save();

        res.json({
            msg: 'Usuario creado'
        })
        
    } catch (error) {
        res.status(403).json({
            msg: error.message || 'Error al crear el usuario'
        })
    }
}
exports.deleteUserAdmin = async ( req, res ) => {
    try {
        const { params: { key } } = req;

        if ( key !== process.env.KEY_SECURITY ) {
            throw Error('No tienes permiso para realizar está acción')
        }

        await User.findOneAndDelete({email: 'superadmin@control.com'});

        res.json({
            msg: 'Usuario eliminado'
        })
    } catch (error) {
        res.status(403).json({
            msg: error.message || 'Error al crear el usuario'
        })
    }
}

exports.getUsers = async( req, res ) => {
    try {
        const { user, params } = req;
        console.log(params, !Object.keys(params).length);
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        let users = [];
        let paramsQuery = {};
        if( user.type_user == 'FIELD_MANAGER' ) {
            paramsQuery.team_id = user.team_id;
        }
        if( !Object.keys(params).length ) users = await User.find(paramsQuery)
        .populate('team_id', '-members')
        .populate('works.work');
        else {
            let regex = new RegExp(`^${params.name}`, 'i');
            paramsQuery.name = regex;
            users = await  User.find(paramsQuery).populate('team_id', '-members');
        }
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
        const searchUser = await User.findById(id).populate('works.work').populate('type');
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

exports.getCountEmployee = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);

        const params = {type_user: 'EMPLOYEE'};

        if( user.type_user === 'FIELD_MANAGER' ) {
            
            params.team_id = user.team_id;
        }
        const searchUsers = await User.find(params).populate('works.work');

        res.json({
            worksUsers: searchUsers
        })
    } catch (error) {
        res.status(500).json({
            msg: error.message || 'Error al obtener el resultado'
        })
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

        await Notification.create({
            type: UPDATE_USER,
            route: `/usuario/${ newUser._id }`,
            triggeredUser: user._id,
            alteredredUser: newUser._id,
            action: `el usuario ${searchUser.name}`

        });
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
        
        const resDeleteMember = await deleteMember(searchUser.team_id, searchUser._id);

        if( !resDeleteMember ) throw Error('Ocurrio un error al eliminar el usaurio del grupo de trabajo');

        if( searchUser.works.length > 0 ) {
            let promises = searchUser.works.map(({ work }) => deleteWork(work));
            await Promise.all(promises);
        }

        await User.findOneAndDelete({_id: id});

        await Notification.create({
            type: DELETE_USER,
            triggeredUser: user._id,
            action: `el usuario ${searchUser.name}`

        });
    
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