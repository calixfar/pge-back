const Work = require('../models/work');
const User = require('../models/user');
const Activity = require('../models/activity');
const WorkActivity = require('../models/workActivity');
const mongoose = require('mongoose');
const { validateTypeUser } = require('../functions/user');
const { mapModelActivityInWork, filterWorksByStatusAndZone } = require('../functions/work');


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
        if( type_user === 'EMPLOYEE' ) params.responsable = user._id;
        let works = await Work.find(params)
        .populate('responsable', '-password -works -assign_team')
        .populate('place')
        .populate('type')
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

        let { params: { search } } = req;
        let params = {status: true};
        let queryPopulatePlace = 'place';

        if( search.toUpperCase() !== 'ALL' && search !== '' ) {
            let regex = new RegExp(`^${search.trim()}`, 'i');
            queryPopulatePlace = {
                path: 'place',
                match: { name: regex }
            };
        }
        let works = await Work.find(params)
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

        let queryPopulatePlace = 'place';
        
        if( filterZone.toUpperCase() !== 'ALL' && filterZone !== '' ) {
            let regex = new RegExp(`^${filterZone.trim()}`, 'i');
            queryPopulatePlace = {
                path: 'place',
                match: { zone: regex }
            };
        }
        let countWorks = await Work.find({ status: true }).populate(queryPopulatePlace);

        countWorks = filterWorksByStatusAndZone(countWorks);
        console.log(countWorks);
        res.json({
            status: true,
            countWorks
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: 'No se pudo obtener todas las tareas'
        })
    }
}
exports.updateWork = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const {params: { id }} = req;
        const searchWork = await Work.findOne({_id: id});
        if( searchWork.status_work === 'Culminada' ){
            const error = new Error();
            error.name = 'No modificable';
            error.message = 'No se puede modificar debido a que está en estado culminada';
            throw error;
        }
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
exports.deleteWork = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);
        const {params: { id }} = req;
        const searchWork = await Work.findOne({_id: id});
        if( searchWork.status_work === 'Culminada' ){
            const error = new Error();
            error.name = 'No modificable';
            error.message = 'No se puede modificar debido a que está en estado culminada';
            throw error;
        }
        await Work.findOneAndUpdate({_id: id}, {status: false});
        await User.findByIdAndUpdate(
            {_id: searchWork.responsable},
            { $pull: {
                works: {
                    work: mongoose.Types.ObjectId(id)
                }
            }},
            { new : true }
        )
        const workActivities = await WorkActivity.find({work: id});
        
        const promises = workActivities.map(({_id}) => WorkActivity.findOneAndDelete({_id}));

        await Promise.all(promises);

        res.json({
            status: true,
            msg: 'Tarea eliminada éxitosamente'
        })
    } catch (error) {
        let defaultMsg = 'No se pudo actualizar la tarea';
        res.status(400).json({
            status: false,
            msg: error.name === 'No modificable' ? error.message : defaultMsg
        });
    }
}

const changeStatusViewsWorks = (works) => {
    works.forEach( async ({ _id, status_work }) => {

        if( status_work == 'Sin_revisar' ) await Work.findOneAndUpdate({_id}, {status_work: 'Vista'});
    });
    return true;

}