const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    type: {
        type: String,
        trim: true
    },
    action: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: new Date()
    } 
});

module.exports = mongoose.model('Notification', NotificationSchema);