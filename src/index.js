import * as PIXI from 'pixi.js';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({
    height: window.innerHeight,
    width: window.innerWidth
})

// The application will create a canvas element for you that you
// can then insert into the DOM

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
    const bunny = new PIXI.Sprite(resources.bunny.texture)

    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2
    bunny.y = app.renderer.height / 2

    // Rotate around the center
    bunny.anchor.x = 0.5
    bunny.anchor.y = 0.5

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny)

    console.log(bunny.position)

    // Listen for frame updates
    app.ticker.add(() => {
         // each frame we spin the bunny around a bit
        
        // if (keyCode === 65) {
        //     bunny.position.x += -0.01
        // }
        if(goLeft) {
            bunny.position.x -= 1
        }
        if(goRight) {
            bunny.position.x += 1
        }
        if(goUp) {
            bunny.position.y -= 1
        }
        if(goDown) {
            bunny.position.y += 1
        }

        //bunny.rotation += 0.01
    })
})
