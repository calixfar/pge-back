exports.validateDataInBd = async (Model, searchParam, newDataForBd, msgDuplicated) => {
    const searchData = await Model.findOne(searchParam);
    const error = new Error();
    error.name = "internal";
    if( searchData !== null ) {
        if( searchData.status ) {
            error.message = msgDuplicated;
            throw error;
        } else {
            newDataForBd.status = true;
            await Model.findOneAndUpdate(searchParam, newDataForBd);
            return true;
        }
    }
    return false;
}