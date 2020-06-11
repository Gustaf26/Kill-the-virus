/**
 * Module dependencies.
 */

require('dotenv').config();

const app = require('./app');
const debug = require('debug')('virus');
const http = require('http');
const SocketIO =require('socket.io')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = SocketIO(server);

let updatedUsers = []

let currentLevel =[];

let user = ""

let levels = [

  {name:'easy',
  users: {}},
  {name:'medium',
  users: {}},
  {name:'difficult',
  users: {}}
]

function getListOfLevelNames() {
  return levels.map(level => level.name);
}

function handleGetLevelsList(callback) {
  updatedUsers=[]
  callback(getListOfLevelNames())
}

io.on('connection', (socket) => {

  console.log("A client connected!");

  socket.on('disconnect', () => {
      console.log("Someone left the game :(");
    });

  socket.on('get-level-list', handleGetLevelsList)

  socket.on('start-request', (level, user)=> {

    currentLevel.push(level)

    console.log(currentLevel)

    socket.join(level)

    updatedUsers.forEach(us=>{

      if (user==us) {updatedUsers.shift(us)}

      })

      updatedUsers.push(user)

    /*Game starts only when both players in same level / room */

    if (currentLevel[0] && currentLevel[1]===currentLevel[0]){     

        if (user==updatedUsers[0]) {return}


        if (updatedUsers.length ==2) {

          x = Math.floor(Math.random()*500) 
          y = Math.floor(Math.random()*380)

          currentLevel=[]
          
          io.to(level).emit('start', updatedUsers, x, y) }

    }
  
    else {return}})    
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}