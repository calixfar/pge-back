<<<<<<< HEAD
const mongoose = require('mongoose');

const PlaceShema = mongoose.Schema({
    code_site: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    structure: {
        type: String,
        trim: true
    },
    owner: {
        type: String,
        trim: true
    },
    latitude: {
        type: String,
        trim: true
    },
    longitude: {
        type: String,
        trim: true
    },
    type_station: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

=======
const mongoose = require('mongoose');

const PlaceShema = mongoose.Schema({
    code_site: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    deparment: {
        type: String,
        trim: true
    },
    structure: {
        type: String,
        trim: true
    },
    owner: {
        type: String,
        trim: true
    },
    latitude: {
        type: String,
        trim: true
    },
    length: {
        type: String,
        trim: true
    },
    type_station: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: 'true'
    }
});

>>>>>>> de82140dca08ba22227881f57a005d47329975dc
module.exports = mongoose.model('Place', PlaceShema);