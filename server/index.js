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
  const username = socket.handshake.auth.username ?? 'anonimous'
  // Uniendo el socket a una sala basada en el auth proporcionado
  let room = socket.handshake.auth.room
  socket.join(room)

  console.log('a user has connected')

  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })

  socket.on('chat message', ({ msg, room }) => {
    console.log('Username: ' + username + ' -- ' + 'message: ' + msg + ' -- Room: ' + room)

    // Emitiendo el mensaje solo a los usuarios en la misma sala
    io.to(room).emit('chat message', msg, username)
  })

  // *************
  socket.on('change room', ({ newRoom, oldRoom }) => {
    socket.leave(oldRoom)
    socket.join(newRoom)
    room = newRoom

    console.log(`El usuario ${username} ha cambiado de ${oldRoom} a ${newRoom}`)
  })
})

app.use(route)

server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})
