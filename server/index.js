import express from 'express'
import logger from 'morgan'

import route from './route.js'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server)
const usersInRoom = {}

app.use(logger('dev'))

// **************************
io.on('connection', (socket) => {
  const username = socket.handshake.auth.username ?? 'anonimous'
  let room = socket.handshake.auth.room
  socket.join(room)

  if (!usersInRoom[room]) usersInRoom[room] = {}
  usersInRoom[room][socket.id] = username

  io.to(room).emit('room users', {
    room,
    users: Object.values(usersInRoom[room])
  })

  console.log('a user has connected')

  // **************************
  socket.on('disconnect', () => {
    console.log('a user has disconnected')
    delete usersInRoom[room][socket.id]
    io.to(room).emit('room users', {
      room,
      users: Object.values(usersInRoom[room])
    })
  })

  // **************************
  socket.on('chat message', ({ msg, room }) => {
    console.log('Username: ' + username + ' -- ' + 'message: ' + msg + ' -- Room: ' + room)

    io.to(room).emit('chat message', msg, username)
  })

  // **************************
  socket.on('change room', ({ newRoom, oldRoom }) => {
    socket.leave(oldRoom)
    delete usersInRoom[oldRoom][socket.id]
    socket.join(newRoom)
    room = newRoom

    if (!usersInRoom[newRoom]) usersInRoom[newRoom] = {}
    usersInRoom[newRoom][socket.id] = username

    // Emitir actualizaciones de usuarios conectados para ambas salas
    io.to(oldRoom).emit('room users', {
      room: oldRoom,
      users: Object.values(usersInRoom[oldRoom])
    })
    io.to(newRoom).emit('room users', {
      room: newRoom,
      users: Object.values(usersInRoom[newRoom])
    })

    console.log(`El usuario ${username} ha cambiado de ${oldRoom} a ${newRoom}`)
  })
})
// **************************
app.use(route)

server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`)
})
