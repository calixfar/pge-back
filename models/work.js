const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
   
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    responsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    execution_date: Date,
    id_base_station: String,
    priority: String,
    type: String,
    status_work: {
        type: String,
        enum: ['Sin revisar', 'Problema', 'Navegacion', 'Inicio tarea', 'Culminada'],
        default: 'Sin revisar'
    },
    commentary: {
        type: String,
        default: ''
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Work', workSchema);