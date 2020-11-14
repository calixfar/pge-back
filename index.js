
const http = require("https");
const { app } = require('./app');
const connectDB = require('./config/db');
const { startSocket } = require('./sockets');



const server = http.createServer(app);

const PORT = process.env.PORT || 5000;


startSocket(server);
connectDB();

server.listen(PORT, () => {
    console.log(`Servidor corriendo en localhost:${PORT}`);
});
