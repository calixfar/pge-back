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
    triggeredUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    alteredUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    route: {
        type: String,
        default: null
    },
    createAt: {
        type: Date,
        default: new Date()
    } 
});

NotificationSchema.statics.create = async (data) => {
    try {
        await Notification(data).save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification;