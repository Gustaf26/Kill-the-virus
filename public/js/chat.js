

const socket = io();

const appEl = document.querySelector("#gamewrapper")

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

const resultEl = document.querySelector('#result')

result.style.display = 'none'

const audio = new Audio('./assets/music.mp3');

let level = null;

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
  
    virusImage.style.left = x + "px";
    virusImage.style.top =  y +"px";
  
    boardEl.append(virusImage)

    return
  }



socket.on('start', (users, level, x, y) =>{

        gameEl.style.display = 'flex';
        waitingMsgEl.style.display = 'none';
        usersEl.innerHTML = `<p><span></span>${users[0].name} vs. ${users[1].name}<span></span><p>`

        audio.play()

        let time =  new Date('dec 31, 2020 00:00:00')

        let n = 0

        showVirus(x, y)

        let timer = setInterval(function () {

            time.setSeconds(n) 

            timerEl.innerHTML = time.getSeconds()

            n += 1

        }, 1000)

        document.querySelector("#virusImg").addEventListener('click', e=> {

            document.querySelector("#virusImg").remove()

            clearInterval(timer)
                           
               socket.emit('save-usertime', n, level, socket.id);
               usersEl.innerHTML ="";
               
        })
})

socket.on('display-results', ( timeOne, timeTwo, nameOne, nameTwo, level)=> {

    audio.pause()

    usersEl.innerHTML = `<div id="results">
    
                            <p>${nameOne} : ${timeOne} seconds</p>
                            <p>${nameTwo} : ${timeTwo} seconds</p>
                    
                        </div>`
})

socket.on('finnished', (resultOne, resultTwo, userOne, userTwo, levelName) => {

    audio.pause()

    gameEl.style.display ='none'
    resultEl.style.display ='flex'
    resultEl.innerHTML = `<div id="finalresults">
    
                            <p>${userOne} : ${resultOne} points</p>
                            <p>${userTwo} : ${resultTwo} points</p>
                        
                        </div>`
    
    const finalResEl = document.querySelector("#finalresults")

    if (resultOne>resultTwo) {

        finalResEl.innerHTML +=`<p>${userOne} is the winner!!</p>`
        appEl.style.backgroundImage ='linear-gradient(to right, darkblue , azure)'
    }

    else {
        
         finalResEl.innerHTML+=`<p>${userTwo} is the winner!!</p>` }

    console.log(levelName)
    socket.emit('leave-room', levelName);

    return
})


window.onload = () => {
    getLevelList();
}