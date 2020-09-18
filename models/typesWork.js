const mongoose = require('mongoose');

const TypesWorkSchema = mongoose.Schema({
    type: {
        required: true,
        trim: true,
        type: String
    }
});

module.exports = mongoose.model('TypesWork', TypesWorkSchema);