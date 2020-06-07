const WebSocketServer = require('ws').Server
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const port = 8000

server.listen(port, () => {
    console.log('Listening on port: ' + port)
})

let player = {
    x: 640,
    y: 349
}

const wss = new WebSocketServer({ server: server })

wss.on('connection', (socket, req) => {
    console.log(req.socket.remoteAddress + ' has connected')

    console.log('on connect')
    socket.send(JSON.stringify(player))

    socket.onmessage = (event) => {
        //console.log(event.data)
        player = JSON.parse(event.data)

        wss.clients.forEach((client) => {
            client.send(JSON.stringify(player))
        })
    }
})