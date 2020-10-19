const { filterObjByProperty } = require('./utils');

exports.getUsersCoordsFromController = (teamId) => {
    return {
        status: true,
        usersCoords: teamId === null ? global.usersLocations : filterObjByProperty(global.usersLocations, 'teamId', teamId)
    }
}