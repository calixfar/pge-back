const WorkActivity = require('../models/workActivity');
const Work = require('../models/work');
const User = require('../models/user');
const mongoose = require('mongoose');
const { zones } = require('../types/zone');
let { valuesCountWorks } = require('../types/works');

const mapModelActivityInWork = async (activies, workId) => {
    try {       
        const promises = activies.map( async ({ _id, name }) => {
            const newWorkActivity = new WorkActivity({
                name,
                date: null,
                location: null,
                work: workId
            });
            newWorkActivity.save();
        });
        await Promise.all( promises );
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const filterWorksByStatusAndZone = ( works ) => {

    let count = 0;
    let countWorks = JSON.parse(JSON.stringify(valuesCountWorks));

    works.forEach( ({status_work,  place, type}) => {
        console.log(type);
        if( place !== null && countWorks[type.type] ) {
            countWorks[status_work].count = countWorks[status_work].count  ? countWorks[status_work].count  + 1 : 1;
            countWorks[type.type].count = countWorks[type.type].count ? countWorks[type.type].count + 1 : 1;
            count += 1;
        }
    });
    
    return {
        countWorks,
        count
    };
}

const deleteWork = async (id, userId) => {
    try {

        if( userId ) {
            await User.findByIdAndUpdate(
                {_id: userId},
                { $pull: {
                    works: {
                        work: mongoose.Types.ObjectId(id)
                    }
                }}
            );
        }
        await Work.findOneAndUpdate({_id: id}, {status: false});
        const workActivities = await WorkActivity.find({work: id});
        
        const promises = workActivities.map(({_id }) => WorkActivity.findOneAndDelete({_id}));

        await Promise.all(promises);
        
        return true;
    } catch (error) {
        console.log('errordeleteWork', error);
        return false;
    }
}

const deleteWorksNullRefs = async () => {
    try {
        const works = await Work.find({ status: true })
        .populate('responsable')
        .populate('place');

        const promises = works.map(({ _id, responsable, place }) => !responsable || !place ? deleteWork(_id, responsable ? responsable._id : null) : null );

        await Promise.all(promises);

        
        return true;
        
    } catch (error) {

        console.log('errorDeleteWorksNullRef', error);
        return false;
    }
}


module.exports = {
    mapModelActivityInWork,
    filterWorksByStatusAndZone,
    deleteWork,
    deleteWorksNullRefs
}