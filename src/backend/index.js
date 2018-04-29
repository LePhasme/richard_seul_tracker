const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const fs = require('fs')
const path = require('path')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const SerialPort = require('serialport')

let useArduino = false // true = Activer l'envoi de données vers l'Arduino
let board
let boardData = ''
let boardOpened = false

if (useArduino === true) {
  board = new SerialPort('COM3', { // Remplacer COM3 avec le bon port, tel qu'il est affiché par l'application Arduino
    baudRate: 115200
  })

  board.on('error', function(err) {
    console.log('Erreur du contrôleur Arduino :')
    console.log(err)
  })

  board.on('open', function() {
    boardOpened = true
    console.log('Contrôleur Arduino ouvert !')
  })

  board.on('data', function(data) {
    // @TODO: gérer les données issues de l'Arduino
  })
}

io.on('connection', function(socket) {
  // L'application principale est en train de jouer une séquence de mouvements...
  // Chaque mouvement est envoyé sous la forme d'un couple de vecteurs
  // xz (déplacement de la base) et xy (déplacement des vérins)
  socket.on('play-vector', function(xz, xy, keyPoint) {
    console.log(xz, xy, keyPoint)
    if (useArduino === true && boardOpened === true) {
      // @TODO: board.write(...)
    }
  })
})

app.use(bodyParser.json({
  limit: '50mb'
}))

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 1000000
}))

app.use(cors())

// Lecture des données
app.get('/items', function(req, res, next) {
  fs.readFile(path.join(path.dirname(path.dirname(__dirname)), 'data', 'items.json'), (err, data) => {
    res.json(JSON.parse(data.toString()))
  })
})

// Enregistrement des données
app.post('/items', function(req, res) {
  fs.writeFile(path.join(path.dirname(path.dirname(__dirname)), 'data', 'items.json'), JSON.stringify(req.body.data), (err) => {
    res.send({ done: true })
  })
})

server.listen(8090, function() {
  console.log('Server écoutant sur le port 8090')
})
