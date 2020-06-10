

const socket = io();

const nickEl = document.querySelector('#nickname');

const feedbackEl = document.querySelector('#feedback');

const usersEl = document.querySelector("#users")

const loginEl = document.querySelector("#login-form")

const titleEl = document.querySelector("#title-wrapper")

const gameEl = document.querySelector("#second-wrapper")

gameEl.style.display = 'none'

const waitingMsgEl = document.querySelector("#waiting")

waitingMsgEl.style.display = 'none'

let userCounter = 0;

let timeStamp = ""

document.querySelector('#login-form').addEventListener('submit', e => {

    e.preventDefault();

    titleEl.style.display = "none";

    waitingMsgEl.style.display = 'flex';

    setInterval(function() {
        gameEl.style.display = 'flex';
        waitingMsgEl.style.display = 'none';}, 5000);

    

});


socket.on('chatmsg', dataobject => {

    feedbackEl.innerHTML = "";
    
    if (dataobject.emoji) {

        document.querySelector('#messages').innerHTML += `<li class="list-group-item">${dataobject.nick}: ${dataobject.emoji}<a id="timestamp">${dataobject.time}</a></li>`;
    }

    else if (dataobject.message) {document.querySelector('#messages').innerHTML += `<li class="list-group-item">${dataobject.nick}: ${dataobject.message}<a id="timestamp">${dataobject.time}</a></li>`;}

    else if (dataobject.pic) {

        document.querySelector('#messages').innerHTML += `<li class="list-group-item">${dataobject.nick}: <img src="${dataobject.pic}"><a>${time}</a></li>`;
    }


});

socket.on('typing', (user)=> {

    feedbackEl.innerHTML = `<p><em>${user} is typing a message...</em></p>`

})

socket.on('login', (user)=> {

    usersEl.innerHTML += `<li id="${user.nick}">${user.nick} is online</li>`

})

socket.on('logout', (user)=> {

    document.querySelector(`#${user.nick}`).remove()

    usersEl.innerHTML +=`<li class="logedout">${user.nick} has logged out</li>`

})