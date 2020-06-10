

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


function showVirus() {

    let virusImage = document.createElement(`img`)
    virusImage.src = "assets/virus.png"

    boardEl.style.cssText = "position:relative";
    virusImage.style.cssText = "position:absolute";
  
    // assign coordinates, don't forget "px"!
    let coords = boardEl.getBoundingClientRect();
  
    virusImage.style.left = coords.left + "50px";
    virusImage.style.top = coords.top + "20px";
  
    boardEl.append(virusImage)

    return
  }

document.querySelector('#login-form').addEventListener('submit', e => {

    e.preventDefault();

    if (nickEl.value=="") {

        alert('YOU NEED TO ENTER A COOL NAME');

        return
    }

    titleEl.style.display = "none";

    waitingMsgEl.style.display = 'flex';

    socket.emit('start-request', nickEl.value);

    

});

socket.on('start', users=>{


        gameEl.style.display = 'flex';
        waitingMsgEl.style.display = 'none';
        usersEl.innerHTML = `${users[0]} AGAINST ${users[1]}`


        let time =  new Date('dec 31, 2020 00:00:00')

        let n = 0

        showVirus()

        setInterval(function() {

            time.setSeconds(n) 

            timerEl.innerHTML = time.getSeconds()

            n += 1

        }, 1000)


        rounds +=1

        if (rounds==10) {

            alert('End of the game')

        }

        rounds= 0;

})



socket.on('logout', (user)=> {

    document.querySelector(`#${user.nick}`).remove()

    usersEl.innerHTML +=`<li class="logedout">${user.nick} has logged out</li>`

})