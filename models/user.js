const mongoose = require('mongoose'); 

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'Team'
    },
    assign_team: {
        type: mongoose.Schema.Types.ObjectId,
        default: null        
    },
    type_user: {
        type: String,
        enum: ['ADMIN', 'FIELD_MANAGER', 'EMPLOYEE'],
        required: true,
        trim: true
    },
    works: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Work' }]
    },
    date_register: {
        type: Date,
        default: Date.now()
    },
    creator_user: {
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('User', UserSchema);