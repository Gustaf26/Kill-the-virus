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
  finnishedPlayers: 0
  },
  {name:'medium',
  users: [],
  busy: 'false',
  finnishedPlayers: 0
  },
  {name:'difficult',
  users: [],
  busy: 'false',
  finnishedPlayers: 0}
]

function getListOfLevelNames() {
  return levels.map(level => level.name);
}

function handleGetLevelsList(callback) {
  updatedUsers=[]
  callback(getListOfLevelNames())
}


function saveUserTimes(time, level, sockId) {

  levels.forEach(lev=>{

    if (lev.name==level){

        lev.users.forEach(us=>{

          if (us.userId==sockId) {

            us.timeResult=time

            lev.finnishedPlayers += 1}          

          if (lev.finnishedPlayers==2) {

            lev.busy=false

            lev.users.forEach(us=>{

              us.finnished == true

              io.to(level).emit('display-results', us.timeResult, us.name)
            })

            lev.finnishedPlayers = 0
            
          }})
      }

      })

  }


io.on('connection', (socket) => {

  console.log("A client connected!");

  socket.on('disconnect', () => {

      console.log("Someone left the game :(");

      levels.forEach(lev=> {lev.busy=false})

    });

  socket.on('get-level-list', handleGetLevelsList)

  socket.on('save-usertime', (time, level, sockId)=>{

    saveUserTimes(time, level, sockId)
  })

  socket.on('start-request', (level, user)=> {

    /*Game starts only when both players in same level / room */

    levels.forEach(lev=> {

      if (lev.busy==true) {return}

       if (lev.users.length==2) {
          const finnishedUsers = lev.users.map(us=>us.finnished==true)

          console.log(lev.users, finnishedUsers)
          if (finnishedUsers.length == 2) {

          let n = Math.floor(Math.random()*10000)

            x = Math.floor(Math.random()*500) 
            y = Math.floor(Math.random()*380)
  
            setTimeout(function(){
  
              io.to(level).emit('start', lev.users, level, x, y)  
            }, n) 
  
             lev.busy = true
          }

          else {return}
       }
      
      else if (lev.name==level) {

         lev.users.push({
          
          userId: socket.id,
          name: user,
          timeResult:"",
          finnished: false})

        socket.join(level)

        let n = Math.floor(Math.random()*10000)

        if (lev.users.length ==2) {

          x = Math.floor(Math.random()*500) 
          y = Math.floor(Math.random()*380)

          setTimeout(function(){

            io.to(level).emit('start', lev.users, level, x, y)  
          }, n) 

           lev.busy = true
          }
        }
      
      else  {return}})

  })})

//   socket.on('restart', (level, user)=> {

//     socket.join(level)

//     io.to(level).emit('saveusers', user)

//     let n = Math.floor(Math.random()*10000)

//     levels.forEach(lev=>{

//       if (lev.name == level) {

//         lev.restartusers.push(user)
//       }

//       if (lev.restartusers.length ==2) {

//         x = Math.floor(Math.random()*500) 
//         y = Math.floor(Math.random()*380)
  
//         lev.timeResults=[]
  
//         setTimeout(function(){

//           console.log(currentUsers)
  
//           io.to(level).emit('start', currentUsers, user, level, x, y)  
//         }, n) 
//     }})

//   })


// })

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