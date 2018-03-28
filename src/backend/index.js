const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const fs = require('fs')
const path = require('path')
const PololuMaestro = require('pololu-maestro')
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', function (socket) {
  socket.on('play-vector', function (xz, xy, keyPoint) {
    console.log(xz, xy, keyPoint)
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
