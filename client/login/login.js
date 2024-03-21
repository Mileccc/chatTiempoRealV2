document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.loginForm')

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const username = document.getElementById('username').value
    const room = document.querySelector('.selector-sala').value

    window.localStorage.setItem('username', username)
    window.localStorage.setItem('room', room)

    window.location.href = '/chat'
  })
})
