import express from 'express'
import logger from 'morgan'

import route from './route.js'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(logger('dev'))

io.on('connection', (socket) => {
  console.log('a user has connected')

  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })

  socket.on('chat message', (msg) => {
    const username = socket.handshake.auth.username ?? 'anonimous'

    console.log('Username: ' + username + ' -- ' + 'message: ' + msg)

    io.emit('chat message', msg, username)
  })
})

app.use(route)

server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})
