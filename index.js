const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server); 
app.use(fileUpload());

// TEST

connectDB();
app.use(cors());
app.use(express.json({extended: true}));
const PORT = process.env.PORT || 4000;


global.usersIo = [];

io.on("connection", socket => {
  console.log("New client connected");
  socket.on('loginuser', (data) => {
    const { userId } = data;
    console.log('data', data);
    global.usersIo.push({socketId: socket.id, userId});
  })
  socket.on("disconnect", () => {
    global.usersIo = global.usersIo.filter((user) => user.socketId !== socket.id);
  });
});


app.use('/', router(io));
app.listen(PORT, () => {
    console.log(`Servidor corriendo en localhost:${PORT}`);
});
