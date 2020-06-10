

const socket = io();

const messageEl = document.querySelector('#message');

const nickEl = document.querySelector('#nickname');

const feedbackEl = document.querySelector('#feedback');

const allEmojisEl = document.querySelector('#allemojis')

const attachFormEl = document.querySelector("#my-awesome-dropzone")

const fileEl = document.querySelector("#file")

const loginEl = document.querySelector("#login")

const usersEl = document.querySelector("#users")



const emojislist = [0x1F600, 0x1F604, 0x1F34A, 0x1F344, 0x1F37F, 0x1F363, 0x1F370, 0x1F355,0x1F354, 0x1F35F, 0x1F6C0, 0x1F48E, 0x1F5FA, 0x23F0, 0x1F579, 0x1F4DA, 0x1F431, 0x1F42A, 0x1F439, 0x1F424]

let userCounter = 0;

emojislist.forEach(emoji=>{

    allEmojisEl.innerHTML +=`<span id="${String.fromCodePoint(emoji)}">${String.fromCodePoint(emoji)}</span>`


})


emojislist.forEach(emoji=>{

    const id = String.fromCodePoint(emoji)
    
    document.querySelector(`#${id}`).addEventListener('click', e=> {

    messageEl.value += id

    })})



let timeStamp = ""

document.querySelector('#message-form').addEventListener('submit', e => {

    e.preventDefault();

    let currentdate = ""

     currentdate = new Date(); 

     timeStamp = '@' + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    
    if (messageEl.value != "") {

        socket.emit('chatmsg',({message: messageEl.value, nick: nickEl.value, time: timeStamp}))

        messageEl.value = '';

        return false;}
});

messageEl.addEventListener('keypress', (e) => {

    socket.emit('typing', (nickEl.value))
})

let inlogged = ""

loginEl.addEventListener('click', (e) => {

    e.preventDefault()

    if (inlogged =="" || inlogged == "loggedout") {

        inlogged= "inlogged";

        socket.emit('login', ({nick: nickEl.value, loggedin: true}))
    
        loginEl.innerText = "LOG OUT"}

   else if (inlogged == "inlogged") {

        socket.emit('logout', ({nick: nickEl.value, loggedin: false}))

        inlogged="loggedout"
    
        loginEl.innerText = "LOG IN"}
    
    })


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