
const socket = io();

const bodyEl = document.querySelector('#body')

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

resultEl.style.display = 'none'

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

        waitingMsgEl.innerText='WAITING FOR YOUR OPPONENT'
            
        waitingMsgEl.style.display='flex'

        const waitForUsers = setInterval(function(){

            socket.emit('get-level-status', level)

        }, 3000)

        socket.on('level-status-free', level=>{

            console.log('HI')

            clearInterval(waitForUsers)

            socket.emit('start-request', level, nickEl.value)
        })});}


const requestStart = () =>{

    appEl.style.backgroundImage ='none'

    appEl.style.opacity ='1'

    resultEl.style.display='none'

    level = loginEl.level.value
    
    titleEl.style.display = "none";

    waitingMsgEl.innerText='WAITING FOR YOUR OPPONENT'
    
    waitingMsgEl.style.display='flex'

    socket.emit('get-level-status', level)
    
    socket.on('level-status-free', level=>{

        console.log('HI')

        clearInterval(waitForUsers)

        console.log(nickEl.value)

        socket.emit('start-request', level, nickEl.value)})}

function changeBackground () {

    let n = Math.floor(Math.random()*9)

    let pics= ['assets/worldOne.jpg', 'assets/worldTwo.jpg', 'assets/worldThree.jpg', 'assets/worldFour.jpg', 'assets/world5.jpg', 'assets/world6.jpg', 'assets/world7.jpg', 'assets/world8.jpg', 'assets/world9.jpg', 'assets/world10.jpg']

    bodyEl.style.backgroundImage = `url('${pics[n]}')`

    return
}


function showVirus(x, y) {

    let virusImage = document.createElement(`img`)
    virusImage.src = "assets/virus.png"
    virusImage.id = "virusImg"

    changeBackground()

    boardEl.style.cssText = "position:relative";
    virusImage.style.cssText = "position:absolute";
  
    virusImage.style.left = x + "px";
    virusImage.style.top =  y +"px";
  
    boardEl.append(virusImage)

    return}

socket.on('ready', ()=>{

    waitingMsgEl.innerText='GET READY!'

    if (waitingMsgEl.style.display === "none") {

        waitingMsgEl.style.display = "block";}

    else {waitingMsgEl.style.display = "none";}})


socket.on('start', (users, level, x, y) =>{

    gameEl.style.display = 'flex';
    timerEl.style.display = "block"    
    waitingMsgEl.style.display = 'none';
    usersEl.innerHTML = `<p><span></span>${users[0].name} vs. ${users[1].name}<span></span><p>`

    audio.play()

    let n = 0
    
    showVirus(x, y)

    let secs = 0
    let milli = 0
    let mins = 0

    let timer = setInterval(function () {

        if (milli == 99) {
            secs += 1;
            milli=0}

        if (secs == 60) {
            mins +=1
            secs= 0}

        timerEl.innerHTML = mins + ' : ' + secs + ' : ' + milli
            
        milli += 1

        }, 10)

        document.querySelector("#virusImg").addEventListener('click', e=> {

            document.querySelector("#virusImg").remove()

            clearInterval(timer)
                           
            socket.emit('save-usertime', secs, milli, level, socket.id);
            usersEl.innerHTML ="";
               
        })})

socket.on('display-results', ( timeOne, timeTwo, nameOne, nameTwo, level)=> {

    audio.pause()

    if (timeOne.secs == false) {

        timeOne.secs = 0}

    if (timeTwo.secs == false) {

        timeTwo.secs = 0}

    usersEl.innerHTML = `<div id="results">
    
                            <p>${nameOne} - ${timeOne.secs} ss ${timeOne.milli} mm</p>
                            <p>${nameTwo} - ${timeTwo.secs} ss ${timeTwo.milli} mm</p>
                    
                        </div>`})

socket.on('finnished', (resultOne, resultTwo, userOne, userTwo, levelName) => {

    audio.pause()

    gameEl.style.display ='none'
    timerEl.style.display = 'none'
    resultEl.style.display ='flex'
    resultEl.innerHTML = `<div id="finalresults">
    
                            <p>${userOne} : ${resultOne} points</p>
                            <p>${userTwo} : ${resultTwo} points</p>

                        </div>`
    
    const finalResEl = document.querySelector("#finalresults")

    if (resultOne>resultTwo) {

        finalResEl.innerHTML +=`<div id="finalresultsTwo">

                            <p><span class="winner">${userOne}</span> is the winner!!</p>
                            <button id="play-again">PLAY AGAIN</button>
        
                            </div>`

        appEl.style.backgroundImage ='linear-gradient(to right,  rgb(176, 212, 212) , azure)'
        appEl.style.opacity ='0.8'
    }

    else {
        
        finalResEl.innerHTML+=`<div id="finalresultsThree">
        
                            <p><span class="winner">${userTwo}</span> is the winner!!</p>
                            <button id="play-again">PLAY AGAIN</button>
                            
                            </div>` 

        appEl.style.backgroundImage ='linear-gradient(to right,  rgb(176, 212, 212) , azure)'}
        appEl.style.opacity ='0.8'

    socket.emit('leave-room', levelName);

    document.querySelector('#play-again').addEventListener('click', e=>{

        e.preventDefault();

        requestStart();
    })

    return
})


window.onload = () => {
    getLevelList();
}