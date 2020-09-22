const Activity = require('../models/activity');
const { validateTypeUser } = require('../functions/user');

exports.insertActivity = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);
        console.log(req.body);
        const { name, typeWork } = req.body;
        if( !name ) throw Error('Por favor ingresa un nombre para la actividad2');
        
        let searchActivityByName = await Activity.findOne({name, typeWork});
        if( searchActivityByName ) throw Error('Ya existe una actividad con este nombre');

        const newActivity = new Activity(req.body);
        await newActivity.save();
        res.json({
            status: true,
            msg: 'Actividad creada con éxito'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al agregar la actividad'
        });
    }
}
exports.getActivities = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);

        const { params: { typeWorkId } } = req;
        
        let activities = await Activity.find({typeWork: typeWorkId});
        
        if( !activities ) activities = [];
        
        console.log('request', activities);
        res.json({
            activities
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al obtener todas las actividades'
        });
    }
}
exports.updateActivity = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);

        const { params: { id } } = req;

        console.log('entro put', id);
        let searchActivity = await Activity.findOne({ _id: id });

        if( !searchActivity ) throw Error('No existe una actividad con este id');

        const { name } = req.body;

        if( name && name !== searchActivity.name ) {
            let searchActivityByName = await Activity.findOne({name, typeWork: searchActivity.typeWork});

            if( searchActivityByName) throw Error('Ya existe una actividad con este nombre');
        }
        await Activity.findOneAndUpdate({_id: id}, req.body);

        res.json({
            status: true,
            msg: 'Actividad actualizada con éxito'
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al actualizar la actividad'
        });
    }
}
exports.deleteActivity = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);

        const { params: { id } } = req;

        await Activity.findOneAndDelete({_id: id});

        res.json({
            msg: 'Se elimino la actividad con éxito'
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al eliminar la actividad'
        });
    }
}