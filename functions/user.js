<<<<<<< HEAD
const User = require('../models/user');

exports.validateExistUser =  (user) => {
    return User.findById({_id: user});;
}

exports.validateTypeUser = (typeUser, valideTypesUser) => {
    let validate = false;
    for(let i = 0; i < valideTypesUser.length; i++) {
        if( typeUser === valideTypesUser[i] ){
            validate = true;
            break;
        }
    }
    if(!validate ){
        const error = new Error();
        error.message = "You do not have permissions to perform this operation";
        error.name = "internal";
        throw error;
    }
=======
const User = require('../models/user');

exports.validateExistUser =  (user) => {
    return User.findById({_id: user});;
}

exports.validateTypeUser = (typeUser, valideTypesUser) => {
    let validate = false;
    for(let i = 0; i < valideTypesUser.length; i++) {
        if( typeUser === valideTypesUser[i] ){
            validate = true;
            break;
        }
    }
    if(!validate ){
        const error = new Error();
        error.message = "You do not have permissions to perform this operation";
        error.name = "internal";
        throw error;
    }
>>>>>>> de82140dca08ba22227881f57a005d47329975dc
}