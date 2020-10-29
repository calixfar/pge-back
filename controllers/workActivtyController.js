const WorkActivity = require('../models/workActivity');
const { validateTypeUser } = require('../functions/user');

exports.getActivitiesByWork = async (req, res) => {
    try {

        const { params: { workId } } = req;

        const activities = await WorkActivity.find({work: workId});

        if( !activities ) activities = [];

        res.json({
            activities
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: 'No se pudo obtener las actividades'
        });
    }
}

exports.updateWorkActivity = async (req, res) => {
    try {
        
        const { params: { id } } = req;

        let searchActivity = await WorkActivity.findOne({ _id: id });

        if( !searchActivity ) throw Error('No existe una actividad con este id');

        const { status, latitude, longitude } = req.body;

        let objToUpdate = {
            status,
            latitude: latitude ? latitude : null,
            longitude: longitude ? longitude : null,
            date: new Date()
        }

        // if( status !== undefined ) {
        //     objToUpdate.latitude = latitude ? latitude : null;
        //     objToUpdate.longitude = longitude ? longitude : null;
        //     objToUpdate.date = new Date();
        // }

        await WorkActivity.findOneAndUpdate({ _id: id }, objToUpdate);

        res.json({
            status: true,
            msg: 'Actividad actualizada con éxito'
        })
        

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            msg: 'Error al actualizar la actividad'
        });
    }
}

exports.resetWorkActivities = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);

        const workActivities = await WorkActicity.find();

        let promises = workActivities.map(({ _id }) => WorkActicity.findOneAndDelete({_id})); 

        await Promise.all(promises);

        res.json({
            workActivities
        })
    } catch (error) {
        res.status(500).json({
            msg: error.message || 'Error al resetear la bd'
        })
    }
}