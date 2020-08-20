<<<<<<< HEAD
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

=======
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

>>>>>>> de82140dca08ba22227881f57a005d47329975dc
module.exports = mongoose.model('Team', TeamSchema);