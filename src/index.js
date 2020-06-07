import * as PIXI from 'pixi.js';

const socket = new WebSocket('ws://116.203.125.0:8000');
//const socket = new WebSocket('ws://localhost:8000');

let intervalId = 0
let player = {}
let bunny

socket.onopen = (event) => {
    console.log('Connected to server')
}

socket.onmessage = (event) => {

    player = JSON.parse(event.data)

    bunny.position.x = player.x
    bunny.position.y = player.y
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

// load the texture we need
app.loader.add('bunny', 'assets/bunny.png').load((loader, resources) => {
    // This creates a texture from a 'bunny.png' image
    bunny = new PIXI.Sprite(resources.bunny.texture)

    bunny.position.x = player.x
    bunny.position.y = player.y

    intervalId = setInterval(() => {

        player = {
            x: bunny.position.x,
            y: bunny.position.y
        }

        socket.send(JSON.stringify(player))

    }, 17)

    // Setup the position of the bunny
    // Rotate around the center
    bunny.anchor.x = 0.5
    bunny.anchor.y = 0.5

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny)

    // Listen for frame updates
    app.ticker.add(() => {
        // each frame we spin the bunny around a bit

        // if (keyCode === 65) {
        //     bunny.position.x += -0.01
        // }
        if (goLeft) {
            bunny.position.x -= 1
        }
        if (goRight) {
            bunny.position.x += 1
        }
        if (goUp) {
            bunny.position.y -= 1
        }
        if (goDown) {
            bunny.position.y += 1
        }
        //bunny.rotation += 0.01
    })
})