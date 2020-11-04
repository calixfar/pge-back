const express = require('express');
const router = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');


const app = express();
app.use(fileUpload());

// TEST

app.use(cors());
app.use(express.json({extended: true}));



app.use('/', router());

module.exports = { app };