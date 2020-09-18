const TypeWork = require('../models/typesWork');
const Activity = require('../models/activity');
const { validateTypeUser } = require('../functions/user');

exports.insertTypeWork = async (req, res) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);
        
        const { type } = req.body;
        if( !type ) throw Error('Por favor ingresa un tipo de trabajo');

        let searchTypeWorkByType = await TypeWork.findOne({type});
        if( searchTypeWorkByType ) throw Error('Ya existe un tipo de trabajo con este nombre');

        const newTypeWork = TypeWork(req.body);
        await newTypeWork.save();
        res.json({
            status: true,
            msg: 'Tipo de trabajo creado con éxito'
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al agregar el tipo de trabajo'
        });
    }
}
exports.getTypesWork = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);

        let typesWork = await TypeWork.find();

        res.json({
            typesWork
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al obtener los tipos de trabajo'
        });
    }
}
exports.getTypeWorkById = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);

        const { params: { id } } = req;

        let typeWork = await TypeWork.findOne({ _id: id });

        if( !typeWork ) throw Error('No existe un tipo de trabajo con este id');

        res.json({
            typeWork
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al obtener el tipo de trabajo'
        });
    }
}
exports.updateTypeWorkById = async ( req, res ) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);

        const { params: { id } } = req;

        let searchTypeWork = await TypeWork.findOne({ _id: id });

        if( !searchTypeWork ) throw Error('No existe un tipo de trabajo con este id');

        const { type } = req.body;

        if( type && type !== searchTypeWork.type ) {
            
            let searchTypeWorkByType = await TypeWork.findOne({type});

            if( searchTypeWorkByType ) throw Error('Existe un tipo de trabajo con este nombre');
        }

        await TypeWork.findOneAndUpdate({_id: id}, {type});

        res.json({
            msg: 'Se actualizo el tipo de trabajo con éxito'
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al actualizar el tipo de trabajo'
        });
    }   
}
exports.deleteTypeWorkById = async ( req, res ) => {
    try {
        validateTypeUser(user.type_user, ["ADMIN","FIELD_MANAGER"]);

        const { params: { id } } = req;

        await TypeWork.findOneAndDelete({_id: id});

        res.json({
            msg: 'Se elimino el tipo de trabajo con éxito'
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error.message ? error.message : 'Ocurrio un error al eliminar la actividad'
        });
    }   
}