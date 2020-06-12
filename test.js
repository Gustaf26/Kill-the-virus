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
  users: [],
  busy: 'false',
  timeResults: []},
  {name:'medium',
  users: [],
  busy: 'false',
  timeResults: []},
  {name:'difficult',
  users: [],
  busy: 'false',
  timeResults: []}
]

function getListOfLevelNames() {
  return levels.map(level => level.name);
}

function handleGetLevelsList(callback) {
  updatedUsers=[]
  callback(getListOfLevelNames())
}

function saveUserTimes(time, level, user) {

  levels.forEach(lev=>{

    if (lev.name==level){
        
        lev.timeResults.push({
        user: user,
        time: time})}

        console.log(lev.timeResults)

      })
  }


io.on('connection', (socket) => {

  console.log("A client connected!");

  socket.on('disconnect', () => {

      console.log("Someone left the game :(");

      levels.forEach(lev=> {lev.busy=false})

    });

  socket.on('get-level-list', handleGetLevelsList)

  socket.on('save-usertime', (time, level, user)=>{

    saveUserTimes(time, level, user)
  })

  socket.on('start-request', (level, user)=> {

    /*Game starts only when both players in same level / room */

    levels.forEach(lev=> {

      console.log(lev.busy)

      if (lev.busy==true) {return}
      
      if (lev.name==level) {

        lev.users.push(user)

        socket.join(level)

        io.to(level).emit('saveusers', user)

        let n = Math.floor(Math.random()*10000)

        if (lev.users.length ==2) {

          x = Math.floor(Math.random()*500) 
          y = Math.floor(Math.random()*380)

          setTimeout(function(){

            io.to(level).emit('start', lev.users, user, level, x, y)  
          }, n) 

          setTimeout(function(){

            lev.users = []
            lev.busy = true
            
          }, n+1)
          }
        }
      
      else  {return}})

  })    
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