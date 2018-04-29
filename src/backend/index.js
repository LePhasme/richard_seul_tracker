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
    console.log('Erreur du contrôleur :')
    console.log(err)
  })

  board.on('open', function() {
    boardOpened = true
    console.log('Contrôleur ouvert !')
  })

  board.on('data', function(data) {
    boardData += data.toString().trim()
    let indexEnd = boardData.indexOf(']')
    if (indexEnd !== -1) {
      let indexStart = boardData.indexOf('[')
      if (indexStart !== -1) {
        if (indexStart < indexEnd) {
          boardData = boardData.substr(indexStart, indexEnd - indexStart + 1)
          if (boardData.indexOf('ok') !== -1) {
            // @TODO: Exécuter la commande suivante...
          }
          boardData = ''
        } else {
          boardData = boardData.substr(indexStart)
        }
      } else {
        boardData = ''
      }
    }
  })
}

io.on('connection', function(socket) {
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

app.get('/items', function(req, res, next) {
  fs.readFile(path.join(path.dirname(path.dirname(__dirname)), 'data', 'items.json'), (err, data) => {
    res.json(JSON.parse(data.toString()))
  })
})

app.post('/items', function(req, res) {
  fs.writeFile(path.join(path.dirname(path.dirname(__dirname)), 'data', 'items.json'), JSON.stringify(req.body.data), (err) => {
    res.send({ done: true })
  })
})

server.listen(8090, function() {
  console.log('CORS-enabled web server listening on port 8090')
})
