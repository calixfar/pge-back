const Team = require('../models/team');
const { validateTypeUser } = require('../functions/user');
const { getUsersCoordsFromController } = require('../functions/sockets');


exports.getUsersCoords = async (req, res, io) => {
    try {
        const { user } = req;
        validateTypeUser(user.type_user, ["ADMIN", "FIELD_MANAGER"]);

        let teamId = null;
        if( user.type_user === 'FIELD_MANAGER' ) {
            const searchTeam = await Team.findOne({field_manager: user._id});
            if( !searchTeam ) throw Error('No estás asignado a un equipo');
            teamId = searchTeam._id;
        }
         const response = await getUsersCoordsFromController(teamId);
        if( !response.status ) throw Error(response.msg);

        res.json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message || 'Ocurrio un error al obtener los usuarios'
        })
    }
}