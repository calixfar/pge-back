const Activity = require('../models/activity');
const { validateTypeUser } = require('../functions/user');

exports.insertActivity = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);
        
        const { type } = req.body;
        if( !type ) throw Error('Por favor existe un tipo de tarea');

        let searchActivityByType = await Activity.findOne({type});
        if( searchActivityByType ) throw Error('Ya existe un tarea con este tipo');

        const newActivity = Activity(req.body);
        await newActivity.save();
        res.json({
            status: true,
            msg: 'Actividades creadas con éxito'
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al agregar la actividad'
        });
    }
}
exports.getActivities = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);

        let activities = await Activity.find();

        res.json({
            activities
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al obtener las actividades'
        });
    }
}
exports.getActivityById = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);

        const { params: { id } } = req;

        let activity = await Activity.findOne({ _id: id });

        if( !activity ) throw Error('No existe una actividad con este id');

        res.json({
            activity
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al obtener la actividade'
        });
    }
}
exports.updateActivityById = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN"]);

        const { params: { id } } = req;

        let searchActivity = await Activity.findOne({ _id: id });

        if( !searchActivity ) throw Error('No existe una actividad con este id');

        const { type } = req.body;

        if( type && type !== searchActivity.type ) {
            
            let searchActivityByType = await Activity.findOne({type});

            if( searchActivityByType ) throw Error('Existe una actividad con este tipo');
        }

        await Activity.findOneAndUpdate({_id: id}, req.body);

        res.json({
            msg: 'Se actualizo la actividad con éxito'
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al actualizar la actividad'
        });
    }   
}
exports.deleteActivityById = async ( req, res ) => {
    try {
        validateTypeUser(user.type_user, ["ADMIN"]);

        const { params: { id } } = req;

        await Activity.findOneAndDelete({_id: id}, req.body);

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