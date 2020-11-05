const Work = require('../models/work');
const User = require('../models/user');
const Activity = require('../models/activity');
const WorkActivity = require('../models/workActivity');
const mongoose = require('mongoose');
const { validateTypeUser, validateExistUser } = require('../functions/user');
const { mapModelActivityInWork, filterWorksByStatusAndZone } = require('../functions/work');
const { insertWorkInPlace } = require('../functions/place');

const fnWork = require('../functions/work');


exports.insertWork = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        let new_body = req.body;
        new_body.creator = user._id;
        new_body.execution_date = new Date(new_body.execution_date);
        const newWork =  Work(new_body);
        const activitiesByTypeWork = await Activity.find({ typeWork: newWork.type });

        const resCreatedActivities = await mapModelActivityInWork(activitiesByTypeWork, newWork._id);

        if( !resCreatedActivities ) throw Error('Error al generar la nueva tarea');

        await newWork.save();
        await User.findOneAndUpdate(
            {_id: new_body.responsable},
            { $push: {
                works : {
                    work: newWork._id
                }
            }},
            { new: true }
        )
        await insertWorkInPlace(newWork.place, newWork._id);
        res.json({
            status: true,
            msg: 'Tarea creada con éxito'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: 'No se pudo guardar la tarea'
        });
    }
};
exports.getWorks = async (req, res) => {
    try {
        const { user } = req;
        const { type_user } = user;
        
        let params = {status: true};
        if( type_user === 'FIELD_MANAGER' ) params.team = user.team_id;
        if( type_user === 'EMPLOYEE' ) {
            params.responsable = user._id;
        }
        /**
            params.status_work = { $ne: 'Culminada' }
         * 
         * params['$or'] = [
                {status_work : { $ne: 'Culminada' } },
                {status_work : { $ne: 'Problema' } },
            ]
         */
        console.log(params);
        let works = await Work.find(params)
        .populate('type')
        .populate('responsable', '-password -works -assign_team')
        .populate('place')
        .populate('team', '-members');

        res.json({
            status: true,
            works
        });
        if( type_user === 'EMPLOYEE' ) await changeStatusViewsWorks(works);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: 'No se pudo obtener todas las tareas'
        })
    }
};
exports.getWork = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const {params: { id }} = req;
        const work = await Work.findOne({_id: id, status: true})
        .populate('responsable', '-password -works -assign_team')
        .populate('place')
        .populate('team', '-members');
        res.json({
            status: true,
            work
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            msg: 'No se pudo obtener la tarea'
        })
    }
};
exports.getWorksBySearch = async ( req, res ) => {
    try {

        let { params: { search, userId }, user } = req;
        console.log(search, userId);
        let params = {status: true};
        let queryPopulatePlace = 'place';

        if( user.type_user === 'EMPLOYEE' ) {
            params.responsable = user._id;
        }
        else if( user.type_user === 'FIELD_MANAGER' ) {
            params.team = user.team_id;
        }

        if( userId.length && userId.toUpperCase() !== 'ALL' ) {
            console.log('entro params');
            params.responsable = userId;
        }

        if( search.toUpperCase() !== 'ALL' && search !== '' ) {
            let regex = new RegExp(`^${search.trim()}`, 'i');
            queryPopulatePlace = {
                path: 'place',
                match: { name: regex }
            };
        }
        console.log('params', params);
        let works = await Work.find(params)
        .populate('type')
        .populate('responsable', '-password -works -assign_team')
        .populate('team', '-members')
        .populate(queryPopulatePlace);

        works = works.filter(( { place } ) => place !== null);

        res.json({
            status: true,
            works
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: 'No se pudo obtener todas las tareas'
        })
    }
}
exports.getCountWorks = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);

        const {params: { filterZone }} = req;

        let querySearch = {
            status: true
        }

        if( user.type_user === 'FIELD_MANAGER' ) querySearch.creator = user._id;
        let queryPopulatePlace = 'place';
        
        if( filterZone.toUpperCase() !== 'ALL' && filterZone !== '' ) {
            let regex = new RegExp(`^${filterZone.trim()}`, 'i');
            queryPopulatePlace = {
                path: 'place',
                match: { zone: regex }
            };
        }
        let works = await Work.find(querySearch)
        .populate(queryPopulatePlace)
        .populate('type');

        const { countWorks, count } = filterWorksByStatusAndZone(works);
        console.log(countWorks);
        res.json({
            status: true,
            countWorks, 
            count
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: 'No se pudo obtener todas las tareas'
        })
    }
}
exports.getWorksByUser = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);

        const { params: { id } } = req;

        const existUser = await validateExistUser(id);

        if( !existUser ) throw Error('El usuario no existe');

        const works = await Work.find({responsable: id, status: true}).populate('type');

        res.json({
            works
        })

    } catch (error) {
        res.status(500).json({
            msg: error.message || 'Error al obtener las tareas del usuario'
        })
    }
}

exports.updateWork = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const {params: { id }} = req;
        const searchWork = await Work.findOne({_id: id});
        if( !searchWork ) throw Error('No se pudo encontrar una tarea con ese id');
        // if( searchWork.status_work === 'Culminada' ){
        //     const error = new Error();
        //     error.name = 'No modificable';
        //     error.message = 'No se puede modificar debido a que está en estado culminada';
        //     throw error;
        // }
        await Work.findOneAndUpdate({_id: id}, req.body, { new: true });
        res.json({
            status: true,
            msg: 'Tarea actualizada éxitosamente'
        })
    } catch (error) {
        let defaultMsg = 'No se pudo actualizar la tarea';
        res.status(400).json({
            status: false,
            msg: error.name === 'No modificable' ? error.message : defaultMsg
        })
    }
};
exports.changeStatusWork = async (req, res) => {
    try {   
        const { user, params: {id} } = req;

        const searchWork = await Work.findOne({_id: id});
        if( !searchWork ) throw Error('No se pudo encontrar una tarea con ese id');

        const { status_work, commentary } = req.body;

        const objUpdate = {};

        if( status_work ) objUpdate.status_work = status_work;
        if( commentary ) objUpdate.commentaryEmployee = commentary;

        await Work.findOneAndUpdate({_id: id}, objUpdate);

        res.json({
            msg: 'Actualización exitosa'
        })
        

    } catch (error) {
        res.status(500).json({
            msg: error.message || 'Ocurrio un error al actualizar el estado'
        })
    }
}
exports.deleteWork = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const {params: { id }} = req;
        const searchWork = await Work.findOne({_id: id});
        if( !searchWork ) throw Error('No se pudo encontrar una tarea con ese id');
        // if( searchWork.status_work === 'Culminada' ){
        //     const error = new Error();
        //     error.name = 'No modificable';
        //     error.message = 'No se puede modificar debido a que está en estado culminada';
        //     throw error;
        // }
        
        
        const resDeleteWork = await fnWork.deleteWork({
            id,
            userId: searchWork.responsable,
            placeId: searchWork.place
        });
        if( !resDeleteWork ) throw Error('Error al eliminar la tarea, por favor intentalo de nuevo');
        res.json({
            status: true,
            msg: 'Tarea eliminada éxitosamente'
        })
    } catch (error) {
        let defaultMsg = 'No se pudo eliminar la tarea';
        res.status(400).json({
            status: false,
            msg:  error.message || defaultMsg
        });
    }
}

const changeStatusViewsWorks = (works) => {
    works.forEach( async ({ _id, status_work }) => {

        if( status_work == 'Sin_revisar' ) await Work.findOneAndUpdate({_id}, {status_work: 'Vista'});
    });
    return true;

}

exports.resetWorks = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);

        const resDelete = await fnWork.deleteWorksNullRefs();

        if( !resDelete ) throw Error('Ocurrio un error');
        // const works = await Work.find().populate('responsable');

        // let promises = works.map(({ _id, responsable }) => !responsable ? Work.findOneAndDelete({_id}) : null); 

        // await Promise.all(promises);

        res.json({
            msg: 'Proceso completado con éxito'
        })
    } catch (error) {
        res.status(500).json({
            msg: error.message || 'Error al resetear la bd'
        })
    }
}