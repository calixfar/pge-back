const mongoose = require('mongoose');

const workActivitySchema = mongoose.Schema({
    name: String,
    date: {
        type: Date,
        default: null
    },
    lat: {
        type: String,
        default: null
    },
    lng: {
        type: String,
        default: null
    },
    work: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Work'
    },
    status: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('WorkActivity', workActivitySchema);