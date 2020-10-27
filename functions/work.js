const WorkActivity = require('../models/workActivity');
const Work = require('../models/work');
const { zones } = require('../types/zone');

exports.mapModelActivityInWork = async (activies, workId) => {
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

exports.filterWorksByStatusAndZone = ( works ) => {
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

exports.deleteWork = async (id) => {
    try {
        await Work.findOneAndUpdate({_id: id}, {status: false});
        const workActivities = await WorkActivity.find({work: id});
        
        const promises = workActivities.map(({_id }) => WorkActivity.findOneAndDelete({_id}));

        await Promise.all(promises);
        
        return true;
    } catch (error) {
        return false;
    }
}