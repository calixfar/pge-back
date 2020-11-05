const Place = require('../models/places');
const mongoose = require('mongoose');

exports.insertWorkInPlace = async ( placeId, workId ) => {
    try {
        await Place.findOneAndUpdate({_id: placeId}, {
            $push: { works: { work: workId } }
        });
        return true;
    } catch (error) {
        return false;
    }
}
exports.deleteWorkInPlace = async ( placeId, workId ) => {
    try {
        await Place.findOneAndUpdate({_id: placeId}, {
            $pull: { works: { work: mongoose.Types.ObjectId(workId) } }
        });
        return true;
    } catch (error) {
        return false;
    }
}