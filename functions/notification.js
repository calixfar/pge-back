const Notification = require('../models/notification');

exports.createNotification = async (data) => {
    try {
        await Notification(data).save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}