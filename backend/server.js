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
    x: 300,
    y: 349
}
let activeConnections = 0
let clients = []

const wss = new WebSocketServer({ server: server })

wss.on('connection', (socket, req) => {
    console.log(req.socket.remoteAddress + ' has connected')

    let clientData = acceptConnection(socket)

    socket.send(JSON.stringify(clientData))

    socket.onmessage = (event) => {
        
        clientData = JSON.parse(event.data)
        
        clients[clientData.id].position = clientData.position

        for (let i = 0; i < clients.length; i++) {
            if (clientData.id !== clients[i].id) {
                socket.send(JSON.stringify(clients))
            }
        }
    }

    socket.onclose = (event) => {
        console.log(req.socket.remoteAddress + ' has disconnected')
        console.log(wss.clients.size)
        socket.close()
    }
})

function acceptConnection(socket) {

    let client = {
        id: activeConnections,
        position: {
            x: 300,
            y: 349
        }
    }

    clients.push(client)

    activeConnections++

    return client
}