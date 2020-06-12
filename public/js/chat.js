

const socket = io();

const nickEl = document.querySelector('#nickname');

const feedbackEl = document.querySelector('#feedback');

const usersEl = document.querySelector("#users")

const loginEl = document.querySelector("#login-form")

const titleEl = document.querySelector("#title-wrapper")

const timerEl = document.querySelector("#timer")

const gameEl = document.querySelector("#second-wrapper")

gameEl.style.display = 'none'

const boardEl = document.querySelector("#game")

const waitingMsgEl = document.querySelector("#waiting")

waitingMsgEl.style.display = 'none'

let rounds = 0;
let level = null;
let currentUser = []
let currentLevel = ""

const getLevelList = () => {
    console.log("Requesting level list from server...");

    socket.emit('get-level-list', (levels)=> {

        updateLevels(levels)}) 
}

const updateLevels= (levels) => {

    document.querySelector('#level').innerHTML = levels.map(level => `<option value="${level}">${level}</option>`).join("");

    document.querySelector('#login-form').addEventListener('submit', e => {

        e.preventDefault();
    
        if (nickEl.value=="") {
    
            alert('YOU NEED TO ENTER A COOL NAME');
    
            return
        }
        level = loginEl.level.value
    
        titleEl.style.display = "none";
    
        waitingMsgEl.style.display = 'flex';
    
        socket.emit('start-request', level, nickEl.value);
    
    });

}


function showVirus(x, y) {

    let virusImage = document.createElement(`img`)
    virusImage.src = "assets/virus.png"
    virusImage.id = "virusImg"

    boardEl.style.cssText = "position:relative";
    virusImage.style.cssText = "position:absolute";
  
    // assign coordinates
    let coords = boardEl.getBoundingClientRect(); 
  
    virusImage.style.left = coords.left + x + "px";
    virusImage.style.top = coords.top + y +"px";
  
    boardEl.append(virusImage)

    return
  }



socket.on('start', (users, user, level, x, y) =>{

        currentLevel = level
        gameEl.style.display = 'flex';
        waitingMsgEl.style.display = 'none';
        usersEl.innerHTML = `<p><span></span>${users[0]} AGAINST ${users[1]}<span></span><p>`


        let time =  new Date('dec 31, 2020 00:00:00')
        //dec 31, 2020 00:00:00

        let n = 0

        showVirus(x, y)

        let timer = setInterval(function () {

            time.setSeconds(n) 

            timerEl.innerHTML = time.getSeconds()

            n += 1

        }, 1000)

        document.querySelector("#virusImg").addEventListener('click', e=> {

            document.querySelector("#virusImg").style.display='none';

            clearInterval(timer)

            if (currentUser.length==2) { 
                
               socket.emit('save-usertime', n, level, currentUser[0]);
               usersEl.innerHTML =""
            }
            
            else if (currentUser.length == 1) {

                socket.emit('save-usertime', n, level, currentUser[0]);
                usersEl.innerHTML =""}
            })

        rounds +=1

        if (rounds==10) {

            alert('End of the game')}

        rounds= 0;

})

socket.on('saveusers', user=>{

    currentUser.push(user)
})

socket.on('display-results', (result, user)=> {

    usersEl.innerHTML += `<p>${user} MADE IT ON ${result} seconds</p>`

    console.log(currentLevel)

    setTimeout(function(){

        socket.emit('start-request', currentLevel, currentUser[0]);  
      }, 5000) 

})


window.onload = () => {
    getLevelList();
}