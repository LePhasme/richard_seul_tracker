import Vue from 'vue'
import io from 'socket.io-client'
let bus = new Vue()
bus.socket = io('http://127.0.0.1:8090')
bus.socket.on('connect', function () {
  console.log('websocket connected')
})
export const EventBus = bus
