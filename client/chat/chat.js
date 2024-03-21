import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

document.addEventListener('DOMContentLoaded', () => {
  const username = window.localStorage.getItem('username')
  const room = window.localStorage.getItem('room')

  const usersList = document.getElementById('listado-usuarios')
  const newUserItem = document.createElement('li')

  newUserItem.textContent = username
  usersList.appendChild(newUserItem)

  const rooms = document.querySelectorAll('.sala')

  rooms.forEach((roomElement) => {
    if (roomElement.textContent === room) {
      roomElement.setAttribute('data-activa', 'true')
    } else {
      roomElement.setAttribute('data-activa', 'false')
    }
  })

  const roomTitle = document.querySelector('.chat header h3')
  roomTitle.textContent = room

  const userIboton = document.querySelector('.nick-cliente')
  userIboton.textContent = username

  const socket = io({
    auth: {
      username,
      serverOffset: 0
    }
  })

  const input = document.getElementById('input')
  const messages = document.getElementById('messages')
  const form = document.getElementById('form')

  const listStyle = ['red', 'blue', 'green', 'purple', 'cyan', 'lime', 'withe', 'orange']
  const colorRandom = Math.floor(Math.random() * listStyle.length)
  const colorSelect = listStyle[colorRandom]

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (input.value) {
      socket.emit('chat message', input.value)
      input.vale = ''
    }
  })

  socket.on('chat message', (msg, username) => {
    const item = `
    <li class="message-listado">
      <small style="color:${colorSelect};">${username}:</small>
      <p>${msg}</p>
    </li>
    `
    messages.insertAdjacentHTML('beforeend', item)
  })
})
