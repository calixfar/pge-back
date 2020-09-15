const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    type: {
        required: true,
        trim: true,
        type: String
    },
    activities: {
        type: [{
            activity: {
                type: String
            }
        }]
    }
});

module.exports = mongoose.model('activity', activitySchema);