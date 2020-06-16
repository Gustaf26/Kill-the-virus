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

let levels = [

  {name:'easy',
  users: [],
  busy: false,
  finnishedPlayers: 0
  },
  {name:'medium',
  users: [],
  busy: false,
  finnishedPlayers: 0
  },
  {name:'difficult',
  users: [],
  busy: false,
  finnishedPlayers: 0
 }
]

function getListOfLevelNames() {
  return levels.map(level => level.name);
}

function handleGetLevelsList(callback) {
  updatedUsers=[]
  callback(getListOfLevelNames())
}


function saveUserTimes(time, level, sockId) {

  const updatedLevel =updateState(time,level,sockId)

     if (updatedLevel.finnishedPlayers === 2) {

            const finnished = checkPoints(updatedLevel.users[0].timeResult, updatedLevel.users[1].timeResult, updatedLevel)

            if (finnished==true) {

              io.to(level).emit('finnished', updatedLevel.users[0].points, updatedLevel.users[1].points, updatedLevel.users[0].name, updatedLevel.users[1].name, updatedLevel.name)

              updatedLevel.busy=false
              updatedLevel.finnishedPlayers = 0
              updatedLevel.users=[]

              return
            }

            io.to(level).emit('display-results', updatedLevel.users[0].timeResult, updatedLevel.users[1].timeResult, updatedLevel.users[0].name, updatedLevel.users[1].name, updatedLevel.name)

            let n = Math.floor(Math.random()*10000)

            x = Math.floor(Math.random()*450) 
            y = Math.floor(Math.random()*250)

            console.log(y)
      
            setTimeout(function(){
      
               io.to(level).emit('start', updatedLevel.users, updatedLevel.name, x, y)}
               , n)

            updatedLevel.busy=false
            updatedLevel.finnishedPlayers = 0}     

      else {return}

      }

function updateState(time,level,sockId) {

  const levelToUpdate = levels.filter(lev=>lev.name == level)

  levelToUpdate[0].users.forEach(us=>{

      if (us.userId==sockId) {

          us.timeResult=time
          us.finnished = true
      }
  })

  levelToUpdate[0].finnishedPlayers += 1

    return levelToUpdate[0]
}

function getLevel(level) {

  return levels.filter(lev=>lev.name === level)

}

function checkPoints(timeOne, timeTwo, level) {

  const users = level.users;

  if (timeOne > timeTwo) {

    users[1].points +=1

    if (Number(users[1].points) === 5){

      console.log('finnished')
  
      return true}
  }

  else if (timeOne < timeTwo) {

    console.log(users[0].points)

    users[0].points +=1; 

    if (Number(users[0].points) === 5){

      console.log('finnished')
  
      return true}
  
  }

  else if (timeOne == timeTwo) {

    users[1].points +=1; 
    users[0].points +=1
  
  }

  return false
}


// Events on connection

io.on('connection', (socket) => {

  console.log("A client connected!");

  socket.on('disconnect', () => {

      console.log("Someone left the game :(");

      levels.forEach(lev=> {

        lev.users.forEach(us=>{

          if (us.userId==socket.id) {

            console.log(us.userId)

            lev.busy=false; 
            lev.users=[]
          }
        })
        })

    });

  socket.on('get-level-list', handleGetLevelsList)

  socket.on('save-usertime', (time, level, sockId)=>{

    saveUserTimes(time, level, sockId)

  })

  socket.on('start-request', (level, user)=> {

    /*Game starts only when both players in same level / room */

    const levelDetails = getLevel(level)

      if (levelDetails[0].busy===true) {
        
        return}

      levelDetails[0].users.push({
          
          userId: socket.id,
          name: user,
          timeResult:"",
          finnished: false,
          points: 0})

      socket.join(level)

      let n = Math.floor(Math.random()*10000)

      if (levelDetails[0].users.length ==2) {

          x = Math.floor(Math.random()*450) 
          y = Math.floor(Math.random()*250)

          console.log(y)

          setTimeout(function(){

            io.to(level).emit('start', levelDetails[0].users, level, x, y) 
            
            levelDetails[0].busy = true}, n)
          }

      else {
        
        return}
      
      })

  socket.on('leave-room', (level)=>{

    let lev = getLevel(level)
    lev.busy=false

    socket.leave(level)
    console.log('user has lefte the level:' + level)

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