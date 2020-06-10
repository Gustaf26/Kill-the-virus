

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

let rounds = 0;

let timeStamp = ""

document.querySelector('#login-form').addEventListener('submit', e => {

    e.preventDefault();

    titleEl.style.display = "none";

    waitingMsgEl.style.display = 'flex';

    socket.emit('start-request', nickEl.value);

    

});

socket.on('start', users=>{

        console.log(users)

        gameEl.style.display = 'flex';
        waitingMsgEl.style.display = 'none';
        usersEl.innerHTML = `${users[0]} AGAINST ${users[1]}`

        rounds +=1

        if (rounds==10) {

            alert('End of the game')
            
        }

})
// socket.on('chatmsg', dataobject => {

//     feedbackEl.innerHTML = "";
    
//     if (dataobject.emoji) {

//         document.querySelector('#messages').innerHTML += `<li class="list-group-item">${dataobject.nick}: ${dataobject.emoji}<a id="timestamp">${dataobject.time}</a></li>`;
//     }

//     else if (dataobject.message) {document.querySelector('#messages').innerHTML += `<li class="list-group-item">${dataobject.nick}: ${dataobject.message}<a id="timestamp">${dataobject.time}</a></li>`;}

//     else if (dataobject.pic) {

//         document.querySelector('#messages').innerHTML += `<li class="list-group-item">${dataobject.nick}: <img src="${dataobject.pic}"><a>${time}</a></li>`;
//     }


// });


socket.on('logout', (user)=> {

    document.querySelector(`#${user.nick}`).remove()

    usersEl.innerHTML +=`<li class="logedout">${user.nick} has logged out</li>`

})