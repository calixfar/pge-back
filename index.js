const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const socketIo = require("socket.io");
const http = require("http");
const { filterObjByProperty, findObjByProperty } = require('./functions/utils');
const { userUpdateLocation } = require('./functions/user');

const {
  SUBSCRIBE_USER,
  UPDATE_LOCATION,
  GET_LOCATIONS,
  ENABLE
} = require('./types/sockets');

const { changeEnableDisconnectUserBySocket } = require('./functions/sockets');
const app = express();
const server = http.createServer(app);
const io = socketIo(server); 
app.use(fileUpload());

// TEST

connectDB();
app.use(cors());
app.use(express.json({extended: true}));
const PORT = process.env.PORT || 4000;


global.usersIo = {};
global.usersLocations = {};



// const filterResultsForFieldManager = (obj, property) => {
//   const keys = Object.keys(obj);
//   // console.log('keys', keys);
//   let temp = {};
//   for( let key of keys ) {
//     if( obj[key].socketId !== socketId ) temp[key] = obj[key];
//   }
//   obj = temp;
// }

const getUsersCoordsByTypeUser = (userType, teamLead) => { 
  let temp = {};
  if( userType === 'ADMIN'  ) temp = global.usersLocations;
  temp = filterObjByProperty(global.usersLocations, 'teamId', teamLead);
  console.log('temp final', temp);
  return temp; 
}

const sendUserCoords = () => {
  Object.values(global.usersIo).forEach((item) => {
      if( item.userType === 'EMPLOYEE' ) return;
      io.to(global.usersIo[item.userId].socketId).emit(GET_LOCATIONS, {
        userCoords: getUsersCoordsByTypeUser(item.userType, item.userTeamLead)
      });
  });
  // console.log('se envio');
}

io.on("connection", socket => {
  // console.log('con', SUBSCRIBE_USER);
  socket.on( SUBSCRIBE_USER, (data) => {
    const { userId, userType, userTeamLead } = data;
    // console.log('data user io', data);

    let temp = global.usersIo;

    temp[userId] = {
      socketId: socket.id, 
      userId,
      userType,
      userTeamLead
    }
    global.usersIo = temp;
    // console.log('global.usersIo', global.usersIo);

  });
  socket.on( UPDATE_LOCATION, (data) => {
    const { userId, teamId, coords } = data;
    // console.log('data', data);
    // console.log('data location', data);
    if( !userId ) return;
    let temp = global.usersLocations;
    temp[userId] = {
      socketId: socket.id,
      userId,
      teamId,
      coords,
      enable: ENABLE.ON
    }
    console.log('final temp', temp);
    global.usersLocations = temp;
    sendUserCoords();
  });
  socket.on("disconnect", () => {




    global.usersIo = filterObjByProperty(global.usersIo, 'socketId', socket.id);
    // console.log('initial', global.usersLocations);

    changeEnableDisconnectUserBySocket(socket.id);
    // global.usersLocations = filterObjByProperty(global.usersLocations, 'socketId', socket.id);
    // console.log('final', global.usersLocations);
    // console.log('dis', global.usersLocations);
    sendUserCoords();
  });
});



app.use('/', router(io));
server.listen(PORT, () => {
    console.log(`Servidor corriendo en localhost:${PORT}`);
});
