import * as PIXI from 'pixi.js';

//const socket = new WebSocket('ws://116.203.125.0:8000')
const socket = new WebSocket('ws://localhost:8000')

let intervalId = 0
let player = null
let players = []
let playerBunny
let activeBunnies = []

socket.onopen = (event) => {
    console.log('Connected to server')
}

socket.onmessage = (event) => {

    if (player === null) {
        Promise.all([setPlayer(), createPlayer()])
            .then(() => {
                intervalId = setInterval(() => {
            
                    playerBunny.position.x = player.position.x
                    playerBunny.position.y = player.position.y
                
                    socket.send(JSON.stringify(player))
                
                }, 17)
            })
    } else {

        players = JSON.parse(event.data)

        for (let i = 0; i < players.length; i++) {
            if (players[i].id !== player.id) {

                if (players.length - 1 > activeBunnies.length) {
                    createOpponent(players[i])
                }

                activeBunnies[0].position.x = players[i].position.x
                activeBunnies[0].position.y = players[i].position.y
            }
        }
    }
}

socket.onclose = (event) => {
    console.log('Disconnected')
    clearInterval(intervalId)
}

const app = new PIXI.Application({
    height: window.innerHeight,
    width: window.innerWidth
})

let goLeft = false
let goRight = false
let goUp = false
let goDown = false

addEventListener('keydown', (event) => {
    if (event.keyCode === 65) {
        goLeft = true
    } else if (event.keyCode === 68) {
        goRight = true
    } else if (event.keyCode === 87) {
        goUp = true
    } else if (event.keyCode === 83) {
        goDown = true
    }
})
addEventListener('keyup', (event) => {
    goLeft = false
    goRight = false
    goUp = false
    goDown = false
})

document.body.style.margin = 0
document.body.appendChild(app.view)

function createPlayer() {

    app.loader.add('bunny', 'assets/bunny.png').load((loader, resources) => {

        playerBunny = new PIXI.Sprite(resources.bunny.texture)

        playerBunny.anchor.x = 0.5
        playerBunny.anchor.y = 0.5

        app.stage.addChild(playerBunny)

        app.ticker.add(() => {
            if (goLeft) {
                player.position.x -= 1
            }
            if (goRight) {
                player.position.x += 1
            }
            if (goUp) {
                player.position.y -= 1
            }
            if (goDown) {
                player.position.y += 1
            }
        })
    })
}

function createOpponent(player) {

    app.loader.add('bunny' + player.id, 'assets/bunny.png').load((loader, resources) => {

        let bunny = new PIXI.Sprite(resources.bunny.texture)

        bunny.position.x = player.position.x
        bunny.position.y = player.position.y

        bunny.anchor.x = 0.5
        bunny.anchor.y = 0.5

        app.stage.addChild(bunny)

        activeBunnies.push(bunny)
    })
}

function setPlayer() {
    player = JSON.parse(event.data)
}