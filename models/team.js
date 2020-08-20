const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const TeamSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    field_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: {
        type: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
    }]
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Team', TeamSchema);