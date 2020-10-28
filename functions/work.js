const WorkActivity = require('../models/workActivity');
const Work = require('../models/work');
const User = require('../models/user');
const mongoose = require('mongoose');
const { zones } = require('../types/zone');

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
    let countWorks = {
        Sin_revisar: 0, 
        Vista: 0, 
        Problema: 0, 
        Navegacion: 0, 
        Inicio_tarea: 0, 
        Culminada: 0, 
        Pendiente: 0,
        count: 0
    };

    works.forEach( ({status_work,  place}) => {
        if( place !== null ) {
            countWorks[status_work] = countWorks[status_work] + 1;
            countWorks.count = countWorks.count + 1;

        }
    });
    
    return countWorks;
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