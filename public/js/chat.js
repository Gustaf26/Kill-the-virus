

const socket = io();

const messageEl = document.querySelector('#message');

const nickEl = document.querySelector('#nickname');

const feedbackEl = document.querySelector('#feedback');

const attachFormEl = document.querySelector("#my-awesome-dropzone")

const usersEl = document.querySelector("#users")
const loginEl = document.querySelector("#login-form")


let userCounter = 0;

let timeStamp = ""

document.querySelector('#login-form').addEventListener('submit', e => {

    e.preventDefault();

    loginEl.style.display = "none";
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