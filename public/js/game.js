
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

const audioOne = new Audio('./assets/music.mp3');

const gameOverAudio = new Audio('./assets/game-over.mp3');

const explosionSound = new Audio('./assets/explosion.mp3');

let level = null;
let setTimer = false;
let started = false;
let indexInterval = 0

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

function showVirusHarder() {

    const showInterval = setInterval(function(){

        socket.emit('getRandomCoordinates', level)

        if (started===false) {

            clearInterval(showInterval)
    
            return
        }

    }, indexInterval)

    return

}

socket.on('randomizedCoordinates', ({x, y}) =>{

    if (document.querySelector('#virusImg')) {

        document.querySelector('#virusImg').remove()
    }

    let virusImage = document.createElement(`img`)
    virusImage.src = "assets/virus.png"
    virusImage.id = "virusImg"

    boardEl.style.cssText = "position:relative";
    virusImage.style.cssText = "position:absolute";
  
    virusImage.style.left = x + "px";
    virusImage.style.top =  y + "px";
  
    boardEl.append(virusImage)    

    document.querySelector("#virusImg").addEventListener('click', e=> {

        document.querySelector("#virusImg").remove()

        socket.emit('stopCoordsIntervall', socket.id)

        explosionSound.play()

        explosionSound.volume=0.7;
    
    return })})


socket.on('ready', ()=>{

    waitingMsgEl.innerText='GET READY!'

    if (waitingMsgEl.style.display === "none") {

        waitingMsgEl.style.display = "block";}

    else {waitingMsgEl.style.display = "none";}})


socket.on('start', (users, level, x, y, rounds) =>{

    gameEl.style.display = 'flex';
    timerEl.style.display = "block"    
    waitingMsgEl.style.display = 'none';
    usersEl.innerHTML = `<li>Round ${rounds}</li>
                        <li><span>${users[0].name} vs. ${users[1].name}<span></li>`

    audioOne.play()

    let n = 0

    if (level=="medium") {

        changeBackground()

        
        let secs = 0
        let milli = 0
        let mins = 0

        setTimer=true
                        
        let timer = setInterval(function () {
            
            if (milli == 99) {
                    secs += 1;
                    milli=0}
                
            if (secs == 60) {
                    mins +=1
                    secs= 0}
         
            timerEl.innerHTML = mins + ' : ' + secs + ' : ' + milli
            milli += 1

            if (setTimer===false) {

                clearInterval(timer)

            }}, 10)

        //Emitting and getting coordinates function, starting game

        started = true

        indexInterval = 1000

        showVirusHarder()}

    else if (level=="difficult") {

        changeBackground()
            
        let secs = 0
        let milli = 0
        let mins = 0
    
        setTimer=true
                            
        let timer = setInterval(function () {
                
            if (milli == 99) {
                    secs += 1;
                    milli=0}
                
            if (secs == 60) {
                    mins +=1
                    secs= 0}
             
            timerEl.innerHTML = mins + ' : ' + secs + ' : ' + milli
            milli += 1
    
            if (setTimer===false) {
    
                clearInterval(timer)
    
            }}, 10)
    
        //Emitting and getting coordinates function, starting game
    
        started = true

        indexInterval = 500
    
        showVirusHarder()}
    
    else {
        
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

            explosionSound.play()

            explosionSound.volume=0.7;

            clearInterval(timer)
                           
            socket.emit('save-usertime', secs, milli, level, socket.id);
            usersEl.innerHTML ="";})}})


// Closing interval after klicking on virus

socket.on('clearCoordsInterval', level=> {
    
    console.log('interval cleared')

    let time = timerEl.innerHTML.split(":") 

    let secs = Number(time[1].trim())
    let milli = Number(time[2].trim())

    console.log(secs, milli)

    setTimer = false
    started = false

    socket.emit('save-usertime', secs, milli, level, socket.id);

    usersEl.innerHTML ="";})


socket.on('display-results', ( timeOne, timeTwo, nameOne, nameTwo, level)=> {

    audioOne.pause()

    if (timeOne.secs == false) {

        timeOne.secs = 0}

    if (timeTwo.secs == false) {

        timeTwo.secs = 0}

    usersEl.innerHTML = `<div id="results">
    
                            <p>${nameOne} - ${timeOne.secs} ss ${timeOne.milli} mm</p>
                            <p>${nameTwo} - ${timeTwo.secs} ss ${timeTwo.milli} mm</p>
                    
                        </div>`})

socket.on('finnished', (resultOne, resultTwo, userOne, userTwo, levelName, rounds) => {

    audioOne.pause()
    gameOverAudio.play()
    gameOverAudio.volume = 0.3;

    gameEl.style.display ='none'
    timerEl.style.display = 'none'
    resultEl.style.display ='flex'
    resultEl.innerHTML = `<div id="finalresults">
                            <p>After ${rounds} rounds...</p>
                            <p>${userOne} : ${resultOne} points - ${userTwo} : ${resultTwo} points</p>
                        </div>`
    
    const finalResEl = document.querySelector("#finalresults")

    if (resultOne>resultTwo) {

        finalResEl.innerHTML +=`<div id="finalresultsTwo">

                            <p><span class="winner">${userOne}</span> is the winner!!</p>
                            <button id="play-again">PLAY AGAIN</button>
        
                            </div>`

        appEl.style.backgroundImage ='linear-gradient(to right,  rgb(176, 212, 212) , azure)'
        appEl.style.opacity ='0.9'
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