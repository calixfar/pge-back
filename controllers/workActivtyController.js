const WorkActicity = require('../models/workActivity');

exports.getActivitiesByWork = async (req, res) => {
    try {

        const { params: { workId } } = req;

        const activities = await WorkActicity.find({work: workId});

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

        let searchActivity = await Activity.findOne({ _id: id });

        if( !searchActivity ) throw Error('No existe una actividad con este id');

        const { status, lat, lng } = req.body;

        let objToUpdate = {
            status,
            lat: null,
            lng: null,
            date: null
        }

        if( status ) {
            objToUpdate.lat = lat ? lat : null;
            objToUpdate.lng = lng ? lng : null;
            objToUpdate.date = new Date();
        }

        await WorkActicity.findOneAndUpdate({ _id: id }, objToUpdate);

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