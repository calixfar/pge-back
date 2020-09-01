const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload')

const app = express();
app.use(fileUpload());

// TEST

connectDB();
app.use(cors());
app.use(express.json({extended: true}));
const PORT = process.env.PORT || 4000;
app.use('/', router());
app.listen(PORT, () => {
    console.log(`Servidor corriendo en localhost:${PORT}`);
});
