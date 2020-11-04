

const socketIo = require("socket.io");
const { filterObjByProperty } = require('../functions/utils');
const { changeEnableDisconnectUserBySocket } = require('../functions/sockets');

const {
    SUBSCRIBE_USER,
    UPDATE_LOCATION,
    GET_LOCATIONS,
    ENABLE
  } = require('../types/sockets');
const startSocket = (server) => {

    const io = socketIo(server); 
    
    global.usersIo = {};
    global.usersLocations = {};
    
    const getUsersCoordsByTypeUser = (userType, teamLead) => { 
      let temp = {};
      if( userType === 'ADMIN'  ) temp = global.usersLocations;
      temp = filterObjByProperty(global.usersLocations, 'teamId', teamLead);
      console.log('temp final', temp);
      return temp; 
    }
    
    const sendUserCoords = () => {
      console.log('global.usersIo', global.usersIo);
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
        console.log('usersIo', usersIo);
    
      });
      socket.on( UPDATE_LOCATION, (data) => {
        const { userId, teamId, coords } = data;
        console.log('updateLocation, ', data);
    
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
    
        changeEnableDisconnectUserBySocket(socket.id);
        sendUserCoords();
      });
    });

    global.io = io;
}

module.exports = { startSocket };