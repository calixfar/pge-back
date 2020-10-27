const Team = require('../models/team');
const mongoose = require('mongoose');
exports.deleteMember = async (teamId, memberId) => {
    console.log(teamId, memberId);
    try {
        await Team.findOneAndUpdate({_id: teamId}, {
            $pull: {
                members: {
                    user: mongoose.Types.ObjectId(memberId)
                }
            }
        });
        return true;
    } catch (error) {
        console.log('error team', error);
        return false;
    }
}