const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    typeWork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypesWork'
    },
    name: String,
    status: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model('Activity', activitySchema);