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
exports.deleteMembersNullRef = async (teamId) => {
    try {
        const team = await Team.findOne({_id: teamId}).populate('members.user');
        const promises = team.members.map((member) => {
            const { user } = member;
            if( user ) return null;
            return Team.findOneAndUpdate({_id: teamId}, {
                $pull: {
                    members: {
                        _id: mongoose.Types.ObjectId(member._id)
                    }
                }
            });
        });

        Promise.all([promises]);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}