const { filterObjByProperty, findObjByProperty } = require('./utils');
const {
    ENABLE
} = require('../types/sockets');
const { userUpdateLocation } = require('./user');
exports.getUsersCoordsFromController = (teamId) => {
    return {
        status: true,
        usersCoords: teamId === null ? global.usersLocations : filterObjByProperty(global.usersLocations, 'teamId', teamId)
    }
}
exports.changeEnableDisconnectUserBySocket = ( socketId ) => {
    try {
        const user = findObjByProperty(global.usersLocations, 'socketId', socketId);

        if( Object.keys(user).length === 0 ) return;
        global.usersLocations[user.userId].enable = ENABLE.OFF;

        userUpdateLocation(user.userId, user.coords);
    } catch (error) {
        return;
    }
}