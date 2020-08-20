<<<<<<< HEAD
const mongoose = require('mongoose');
require('dotenv').config({
    path: 'variables.env'
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        });
        console.log('DB CONECTADA');    
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}
=======
const mongoose = require('mongoose');
require('dotenv').config({
    path: 'variables.env'
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        });
        console.log('DB CONECTADA');    
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}
>>>>>>> de82140dca08ba22227881f57a005d47329975dc
module.exports = connectDB;