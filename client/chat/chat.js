import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

document.addEventListener('DOMContentLoaded', () => {
  const username = window.localStorage.getItem('username')
  let room = window.localStorage.getItem('room')

  const usersList = document.getElementById('listado-usuarios')
  const newUserItem = document.createElement('li')

  const rooms = document.querySelectorAll('.sala')
  const roomTitle = document.querySelector('.chat header h3')
  const userIboton = document.querySelector('.nick-cliente')

  const contadorUsuarios = document.querySelector('.contador-usuarios')

  const socket = io({
    auth: {
      username,
      serverOffset: 0,
      room
    }
  })

  const input = document.getElementById('input')
  const messages = document.getElementById('messages')
  const form = document.getElementById('form')

  const listaUsuarios = {}

  newUserItem.textContent = username
  usersList.appendChild(newUserItem)
  userIboton.textContent = username
  roomTitle.textContent = room

  rooms.forEach((roomElement) => {
    roomElement.setAttribute('data-activa', roomElement.textContent === room ? 'true' : 'false')

    roomElement.addEventListener('click', () => {
      const newRoom = roomElement.textContent
      if (newRoom !== room) {
        changeRoom(newRoom)
      }
    })
  })

  function changeRoom (newRoom) {
    messages.innerHTML = ''

    rooms.forEach((roomElement) => {
      roomElement.setAttribute('data-activa', roomElement.textContent === newRoom ? 'true' : 'false')
    })

    socket.emit('change room', { newRoom, oldRoom: room })

    roomTitle.textContent = newRoom

    room = newRoom
    window.localStorage.setItem('room', newRoom)
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (input.value) {
      socket.emit('chat message', { msg: input.value, room })
      input.value = ''
    }
  })

  socket.on('chat message', (msg, senderUsername) => {
    const messageUsername = senderUsername === username ? 'yo' : senderUsername
    const alignmentClass = senderUsername === username ? 'align-right' : ''
    const isEven = messages.querySelectorAll('li').length % 2 === 0

    if (!listaUsuarios[senderUsername]) {
      const listStyle = ['red', 'blue', 'green', 'purple', 'cyan', 'lime', 'white', 'orange']
      const colorRandom = Math.floor(Math.random() * listStyle.length)

      listaUsuarios[senderUsername] = listStyle[colorRandom]
    }

    const userColor = listaUsuarios[senderUsername]

    const item = `
    <li class="message-listado ${alignmentClass}" style="background-color: ${isEven ? '#3b3b3b' : '#555555'};">
      <small style="color:${userColor};">${messageUsername}:</small>
      <p>${msg}</p>
    </li>
    `
    messages.insertAdjacentHTML('beforeend', item)
  })

  socket.on('room users', ({ room, users }) => {
    contadorUsuarios.textContent = users.length // Actualizar el contador de usuarios
    usersList.innerHTML = '' // Limpiar lista actual de usuarios
    users.forEach(user => {
      const userItem = document.createElement('li')
      userItem.textContent = user
      usersList.appendChild(userItem) // Añadir cada usuario a la lista
    })
  })
})
