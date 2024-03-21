import express from 'express'
import path from 'path'

const router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd() + '/client/login/login.html'))
})

router.get('/chat', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/chat/chat.html'))
})

router.get('/login/login.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/login/login.html'))
})

router.get('/login/login.css', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/login/login.css'))
})

router.get('/login/login.js', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/login/login.js'))
})

router.get('/chat/chat.css', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/chat/chat.css'))
})

router.get('/chat/chat.js', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/chat/chat.js'))
})

router.get('/assets/icono.png', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/assets/icono.png'))
})

export default router
