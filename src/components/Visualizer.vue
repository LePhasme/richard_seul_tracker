<template>
  <div id="visualizer" class="tile is-parent">
    <div id="top-view" class="tile is-child">
      <h1 class="subtitle is-6">top view</h1>
      <div class="canvasWrapper">
        <canvas class="back"></canvas>
        <canvas class="front"></canvas>
      </div>
    </div>
    <div id="front-view" class="tile is-child">
      <h1 class="subtitle is-6">front view</h1>
      <div class="canvasWrapper">
        <canvas class="back"></canvas>
        <canvas class="front"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../event-bus.js'
import * as $ from 'jQuery'
import Victor from 'victor'

export default {
  name: 'Visualizer',
  methods: {
    clearFront: function () {
      // top
      this.ctxTop.clearRect(0, 0, 300, 300)
      this.ctxTop.strokeStyle = 'rgb(0, 0, 0)'
      this.ctxTop.beginPath()
      this.ctxTop.moveTo(145, 150)
      this.ctxTop.lineTo(155, 150)
      this.ctxTop.stroke()
      this.ctxTop.beginPath()
      this.ctxTop.moveTo(150, 145)
      this.ctxTop.lineTo(150, 155)
      this.ctxTop.stroke()
      this.ctxTop.setLineDash([1, 3])
      this.ctxTop.beginPath()
      this.ctxTop.moveTo(150, 0)
      this.ctxTop.lineTo(150, 300)
      this.ctxTop.stroke()
      this.ctxTop.beginPath()
      this.ctxTop.moveTo(0, 150)
      this.ctxTop.lineTo(300, 150)
      this.ctxTop.stroke()
      this.ctxTop.setLineDash([])
      // front
      this.ctxFront.clearRect(0, 0, 300, 300)
      this.ctxFront.strokeStyle = 'rgb(0, 0, 0)'
      this.ctxFront.beginPath()
      this.ctxFront.moveTo(145, 150)
      this.ctxFront.lineTo(155, 150)
      this.ctxFront.stroke()
      this.ctxFront.beginPath()
      this.ctxFront.moveTo(150, 145)
      this.ctxFront.lineTo(150, 155)
      this.ctxFront.stroke()
      this.ctxFront.setLineDash([1, 3])
      this.ctxFront.beginPath()
      this.ctxFront.moveTo(150, 0)
      this.ctxFront.lineTo(150, 300)
      this.ctxFront.stroke()
      this.ctxFront.beginPath()
      this.ctxFront.moveTo(0, 150)
      this.ctxFront.lineTo(300, 150)
      this.ctxFront.stroke()
      this.ctxFront.setLineDash([])
    },
    clearBack: function () {
      // top
      this.ctxTopBack.clearRect(0, 0, 300, 300)
      // front
      this.ctxFrontBack.clearRect(0, 0, 300, 300)
    },
    init: function () {
      this.playing = false
      this.canvasTop = $('#top-view canvas.front').get(0)
      this.ctxTop = this.canvasTop.getContext('2d', { alpha: true })
      this.canvasFront = $('#front-view canvas.front').get(0)
      this.ctxFront = this.canvasFront.getContext('2d', { alpha: true })
      this.canvasTopBack = $('#top-view canvas.back').get(0)
      this.ctxTopBack = this.canvasTopBack.getContext('2d', { alpha: false })
      this.canvasFrontBack = $('#front-view canvas.back').get(0)
      this.ctxFrontBack = this.canvasFrontBack.getContext('2d', { alpha: false })
      this.canvasTop.width = 600
      this.canvasTop.height = 600
      this.canvasFront.width = 600
      this.canvasFront.height = 600
      this.canvasTopBack.width = 600
      this.canvasTopBack.height = 600
      this.canvasFrontBack.width = 600
      this.canvasFrontBack.height = 600
      this.canvasTop.style.width = '300px'
      this.canvasTop.style.height = '300px'
      this.canvasFront.style.width = '300px'
      this.canvasFront.style.height = '300px'
      this.canvasTopBack.style.width = '300px'
      this.canvasTopBack.style.height = '300px'
      this.canvasFrontBack.style.width = '300px'
      this.canvasFrontBack.style.height = '300px'
      this.ctxTop.scale(2, 2)
      this.ctxFront.scale(2, 2)
      this.ctxTopBack.scale(2, 2)
      this.ctxFrontBack.scale(2, 2)
      this.clearFront()
      this.clearBack()
      EventBus.$on('record-updated', this.recordUpdated)
      EventBus.$on('hands-coordinates', this.handsCoordinates)
      EventBus.$on('play-start', this.playStart)
    },
    recordUpdated: function (recorder) {
      if (recorder.records.length > 2) {
        this.clearBack()
        let i = 0
        let l = recorder.records.length
        this.ctxTopBack.strokeStyle = 'rgb(127, 127, 127)'
        this.ctxTopBack.beginPath()
        this.ctxTopBack.arc(recorder.records[0].x * this.canvasTopBack.width / 2, recorder.records[0].z * this.canvasTopBack.height / 2, 3, 0, 2 * Math.PI, false)
        this.ctxTopBack.stroke()
        this.ctxTopBack.setLineDash([1, 2])
        this.ctxTopBack.beginPath()
        this.ctxTopBack.moveTo(recorder.records[0].x * this.canvasTopBack.width / 2, recorder.records[0].z * this.canvasTopBack.height / 2)
        this.ctxFrontBack.strokeStyle = 'rgb(127, 127, 127)'
        this.ctxFrontBack.beginPath()
        this.ctxFrontBack.arc(recorder.records[0].x * this.canvasFrontBack.width / 2, (1 - recorder.records[0].y) * this.canvasFrontBack.height / 2, 3, 0, 2 * Math.PI, false)
        this.ctxFrontBack.stroke()
        this.ctxFrontBack.setLineDash([1, 2])
        this.ctxFrontBack.beginPath()
        this.ctxFrontBack.moveTo(recorder.records[0].x * this.canvasFrontBack.width / 2, (1 - recorder.records[0].y) * this.canvasFrontBack.height / 2)
        for (i = 1; i < l - 2; i++) {
          let xc = (recorder.records[i].x + recorder.records[i + 1].x) / 2
          let yc = (recorder.records[i].z + recorder.records[i + 1].z) / 2
          this.ctxTopBack.quadraticCurveTo(recorder.records[i].x * this.canvasTopBack.width / 2, recorder.records[i].z * this.canvasTopBack.height / 2, xc * this.canvasTopBack.width / 2, yc * this.canvasTopBack.height / 2)
          yc = (recorder.records[i].y + recorder.records[i + 1].y) / 2
          this.ctxFrontBack.quadraticCurveTo(recorder.records[i].x * this.canvasFrontBack.width / 2, (1 - recorder.records[i].y) * this.canvasFrontBack.height / 2, xc * this.canvasFrontBack.width / 2, (1 - yc) * this.canvasFrontBack.height / 2)
        }
        this.ctxTopBack.quadraticCurveTo(recorder.records[i].x * this.canvasTopBack.width / 2, recorder.records[i].z * this.canvasTopBack.height / 2, recorder.records[i + 1].x * this.canvasTopBack.width / 2, recorder.records[i + 1].z * this.canvasTopBack.height / 2)
        this.ctxTopBack.stroke()
        this.ctxTopBack.setLineDash([])
        let quadPointX = recorder.records[i].x * this.canvasTopBack.width / 2
        let quadPointY = recorder.records[i].z * this.canvasTopBack.height / 2
        let endPointX = recorder.records[i + 1].x * this.canvasTopBack.width / 2
        let endPointY = recorder.records[i + 1].z * this.canvasTopBack.height / 2
        let arrowAngle = Math.atan2(quadPointX - endPointX, quadPointY - endPointY) + Math.PI
        let arrowWidth = 5
        this.ctxTopBack.beginPath()
        this.ctxTopBack.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))
        this.ctxTopBack.lineTo(endPointX, endPointY)
        this.ctxTopBack.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))
        this.ctxTopBack.stroke()
        this.ctxFrontBack.quadraticCurveTo(recorder.records[i].x * this.canvasFrontBack.width / 2, (1 - recorder.records[i].y) * this.canvasFrontBack.height / 2, recorder.records[i + 1].x * this.canvasFrontBack.width / 2, (1 - recorder.records[i + 1].y) * this.canvasFrontBack.height / 2)
        this.ctxFrontBack.stroke()
        this.ctxFrontBack.setLineDash([])
        quadPointX = recorder.records[i].x * this.canvasTopBack.width / 2
        quadPointY = (1 - recorder.records[i].y) * this.canvasFrontBack.height / 2
        endPointX = recorder.records[i + 1].x * this.canvasTopBack.width / 2
        endPointY = (1 - recorder.records[i + 1].y) * this.canvasFrontBack.height / 2
        arrowAngle = Math.atan2(quadPointX - endPointX, quadPointY - endPointY) + Math.PI
        this.ctxFrontBack.beginPath()
        this.ctxFrontBack.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))
        this.ctxFrontBack.lineTo(endPointX, endPointY)
        this.ctxFrontBack.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))
        this.ctxFrontBack.stroke()
        for (i = 0; i < l; i++) {
          if (recorder.keyPoints[recorder.records[i].t] === true) {
            this.ctxTopBack.strokeStyle = 'rgb(255, 127, 127)'
            this.ctxTopBack.beginPath()
            this.ctxTopBack.arc(recorder.records[i].x * this.canvasTopBack.width / 2, recorder.records[i].z * this.canvasTopBack.height / 2, 3, 0, 2 * Math.PI, false)
            this.ctxTopBack.stroke()
            this.ctxFrontBack.strokeStyle = 'rgb(255, 127, 127)'
            this.ctxFrontBack.beginPath()
            this.ctxFrontBack.arc(recorder.records[i].x * this.canvasFrontBack.width / 2, (1 - recorder.records[i].y) * this.canvasFrontBack.height / 2, 3, 0, 2 * Math.PI, false)
            this.ctxFrontBack.stroke()
          }
        }
      }
    },
    handsCoordinates: function (palm, radius) {
      if (this.playing === false) {
        let topPoint = {
          x: palm[0] * this.canvasTop.width / 2,
          y: palm[2] * this.canvasTop.height / 2
        }
        let frontPoint = {
          x: palm[0] * this.canvasFront.width / 2,
          y: (1 - palm[1]) * this.canvasFront.height / 2
        }
        this.clearFront()
        // top
        this.ctxTop.strokeStyle = 'rgb(255, 0, 0)'
        this.ctxTop.beginPath()
        this.ctxTop.moveTo(topPoint.x - 5, topPoint.y)
        this.ctxTop.lineTo(topPoint.x + 5, topPoint.y)
        this.ctxTop.stroke()
        this.ctxTop.beginPath()
        this.ctxTop.moveTo(topPoint.x, topPoint.y - 5)
        this.ctxTop.lineTo(topPoint.x, topPoint.y + 5)
        this.ctxTop.stroke()
        this.ctxTop.beginPath()
        this.ctxTop.arc(topPoint.x, topPoint.y, 8, 0, 2 * Math.PI, false)
        this.ctxTop.stroke()
        // front
        this.ctxFront.strokeStyle = 'rgb(255, 0, 0)'
        this.ctxFront.beginPath()
        this.ctxFront.moveTo(frontPoint.x - 5, frontPoint.y)
        this.ctxFront.lineTo(frontPoint.x + 5, frontPoint.y)
        this.ctxFront.stroke()
        this.ctxFront.beginPath()
        this.ctxFront.moveTo(frontPoint.x, frontPoint.y - 5)
        this.ctxFront.lineTo(frontPoint.x, frontPoint.y + 5)
        this.ctxFront.stroke()
        this.ctxFront.beginPath()
        this.ctxFront.arc(frontPoint.x, frontPoint.y, 8, 0, 2 * Math.PI, false)
        this.ctxFront.stroke()
      }
    },
    playStart: function (items) {
      if (this.playing === false) {
        this.playing = true
        this.playingIndex = 0
        this.playingSubIndex = 0
        this.playingItems = items
        this.clearFront()
        this.play(true)
      }
    },
    play: function (init) {
      if (this.playing === true && this.playingIndex < this.playingItems.records.length - 1) {
        if (init === true) {
          this.clearBack()
          let i = 0
          let l = this.playingItems.records.length
          this.ctxTopBack.strokeStyle = 'rgb(127, 127, 127)'
          this.ctxTopBack.beginPath()
          this.ctxTopBack.arc(this.playingItems.records[0].x * this.canvasTopBack.width / 2, this.playingItems.records[0].z * this.canvasTopBack.height / 2, 3, 0, 2 * Math.PI, false)
          this.ctxTopBack.stroke()
          this.ctxTopBack.setLineDash([1, 2])
          this.ctxTopBack.beginPath()
          this.ctxTopBack.moveTo(this.playingItems.records[0].x * this.canvasTopBack.width / 2, this.playingItems.records[0].z * this.canvasTopBack.height / 2)
          this.ctxFrontBack.strokeStyle = 'rgb(127, 127, 127)'
          this.ctxFrontBack.beginPath()
          this.ctxFrontBack.arc(this.playingItems.records[0].x * this.canvasFrontBack.width / 2, (1 - this.playingItems.records[0].y) * this.canvasFrontBack.height / 2, 3, 0, 2 * Math.PI, false)
          this.ctxFrontBack.stroke()
          this.ctxFrontBack.setLineDash([1, 2])
          this.ctxFrontBack.beginPath()
          this.ctxFrontBack.moveTo(this.playingItems.records[0].x * this.canvasFrontBack.width / 2, (1 - this.playingItems.records[0].y) * this.canvasFrontBack.height / 2)
          for (i = 1; i < l - 2; i++) {
            let xc = (this.playingItems.records[i].x + this.playingItems.records[i + 1].x) / 2
            let yc = (this.playingItems.records[i].z + this.playingItems.records[i + 1].z) / 2
            this.ctxTopBack.quadraticCurveTo(this.playingItems.records[i].x * this.canvasTopBack.width / 2, this.playingItems.records[i].z * this.canvasTopBack.height / 2, xc * this.canvasTopBack.width / 2, yc * this.canvasTopBack.height / 2)
            yc = (this.playingItems.records[i].y + this.playingItems.records[i + 1].y) / 2
            this.ctxFrontBack.quadraticCurveTo(this.playingItems.records[i].x * this.canvasFrontBack.width / 2, (1 - this.playingItems.records[i].y) * this.canvasFrontBack.height / 2, xc * this.canvasFrontBack.width / 2, (1 - yc) * this.canvasFrontBack.height / 2)
          }
          this.ctxTopBack.quadraticCurveTo(this.playingItems.records[i].x * this.canvasTopBack.width / 2, this.playingItems.records[i].z * this.canvasTopBack.height / 2, this.playingItems.records[i + 1].x * this.canvasTopBack.width / 2, this.playingItems.records[i + 1].z * this.canvasTopBack.height / 2)
          this.ctxTopBack.stroke()
          this.ctxTopBack.setLineDash([])
          let quadPointX = this.playingItems.records[i].x * this.canvasTopBack.width / 2
          let quadPointY = this.playingItems.records[i].z * this.canvasTopBack.height / 2
          let endPointX = this.playingItems.records[i + 1].x * this.canvasTopBack.width / 2
          let endPointY = this.playingItems.records[i + 1].z * this.canvasTopBack.height / 2
          let arrowAngle = Math.atan2(quadPointX - endPointX, quadPointY - endPointY) + Math.PI
          let arrowWidth = 5
          this.ctxTopBack.beginPath()
          this.ctxTopBack.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))
          this.ctxTopBack.lineTo(endPointX, endPointY)
          this.ctxTopBack.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))
          this.ctxTopBack.stroke()
          this.ctxFrontBack.quadraticCurveTo(this.playingItems.records[i].x * this.canvasFrontBack.width / 2, (1 - this.playingItems.records[i].y) * this.canvasFrontBack.height / 2, this.playingItems.records[i + 1].x * this.canvasFrontBack.width / 2, (1 - this.playingItems.records[i + 1].y) * this.canvasFrontBack.height / 2)
          this.ctxFrontBack.stroke()
          this.ctxFrontBack.setLineDash([])
          quadPointX = this.playingItems.records[i].x * this.canvasTopBack.width / 2
          quadPointY = (1 - this.playingItems.records[i].y) * this.canvasFrontBack.height / 2
          endPointX = this.playingItems.records[i + 1].x * this.canvasTopBack.width / 2
          endPointY = (1 - this.playingItems.records[i + 1].y) * this.canvasFrontBack.height / 2
          arrowAngle = Math.atan2(quadPointX - endPointX, quadPointY - endPointY) + Math.PI
          this.ctxFrontBack.beginPath()
          this.ctxFrontBack.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))
          this.ctxFrontBack.lineTo(endPointX, endPointY)
          this.ctxFrontBack.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))
          this.ctxFrontBack.stroke()
          for (i = 0; i < l; i++) {
            if (this.playingItems.keyPoints[this.playingItems.records[i].t] === true) {
              this.ctxTopBack.strokeStyle = 'rgb(255, 127, 127)'
              this.ctxTopBack.beginPath()
              this.ctxTopBack.arc(this.playingItems.records[i].x * this.canvasTopBack.width / 2, this.playingItems.records[i].z * this.canvasTopBack.height / 2, 3, 0, 2 * Math.PI, false)
              this.ctxTopBack.stroke()
              this.ctxFrontBack.strokeStyle = 'rgb(255, 127, 127)'
              this.ctxFrontBack.beginPath()
              this.ctxFrontBack.arc(this.playingItems.records[i].x * this.canvasFrontBack.width / 2, (1 - this.playingItems.records[i].y) * this.canvasFrontBack.height / 2, 3, 0, 2 * Math.PI, false)
              this.ctxFrontBack.stroke()
            }
          }
        }
        let v1 = new Victor(this.playingItems.records[this.playingIndex].x, this.playingItems.records[this.playingIndex].z)
        let v2 = new Victor(this.playingItems.records[this.playingIndex + 1].x, this.playingItems.records[this.playingIndex + 1].z)
        let v3 = new Victor(this.playingItems.records[this.playingIndex].x, this.playingItems.records[this.playingIndex].y)
        let v4 = new Victor(this.playingItems.records[this.playingIndex + 1].x, this.playingItems.records[this.playingIndex + 1].y)
        this.clearFront()
        // top
        let startPointX = this.playingItems.records[this.playingIndex].x * this.canvasTop.width / 2
        let startPointY = this.playingItems.records[this.playingIndex].z * this.canvasTop.height / 2
        let endPointX = this.playingItems.records[this.playingIndex + 1].x * this.canvasTop.width / 2
        let endPointY = this.playingItems.records[this.playingIndex + 1].z * this.canvasTop.height / 2
        let arrowAngle = Math.atan2(startPointX - endPointX, startPointY - endPointY) + Math.PI
        let arrowWidth = 5
        if (this.playingItems.keyPoints[this.playingItems.records[this.playingIndex].t] === true) {
          this.ctxTop.strokeStyle = 'rgb(255, 0, 0)'
          this.ctxFront.strokeStyle = 'rgb(255, 0, 0)'
          this.ctxTop.lineWidth = 5
          this.ctxFront.lineWidth = 5
        } else {
          this.ctxTop.strokeStyle = 'rgb(0, 0, 0)'
          this.ctxFront.strokeStyle = 'rgb(0, 0, 0)'
          this.ctxTop.lineWidth = 1
          this.ctxFront.lineWidth = 1
        }
        this.ctxTop.beginPath()
        this.ctxTop.moveTo(startPointX, startPointY)
        this.ctxTop.lineTo(endPointX, endPointY)
        this.ctxTop.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))
        this.ctxTop.lineTo(endPointX, endPointY)
        this.ctxTop.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))
        this.ctxTop.stroke()
        // front
        startPointX = this.playingItems.records[this.playingIndex].x * this.canvasFront.width / 2
        startPointY = (1 - this.playingItems.records[this.playingIndex].y) * this.canvasFront.height / 2
        endPointX = this.playingItems.records[this.playingIndex + 1].x * this.canvasFront.width / 2
        endPointY = (1 - this.playingItems.records[this.playingIndex + 1].y) * this.canvasFront.height / 2
        arrowAngle = Math.atan2(startPointX - endPointX, startPointY - endPointY) + Math.PI
        this.ctxFront.beginPath()
        this.ctxFront.moveTo(startPointX, startPointY)
        this.ctxFront.lineTo(endPointX, endPointY)
        this.ctxFront.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)))
        this.ctxFront.lineTo(endPointX, endPointY)
        this.ctxFront.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)), endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)))
        this.ctxFront.stroke()
        this.ctxTop.lineWidth = 1
        this.ctxFront.lineWidth = 1
        this.playingSubIndex++
        if (this.playingSubIndex > 2) {
          EventBus.$emit('play-vector', v2.subtract(v1), v4.subtract(v3), (this.playingItems.keyPoints[this.playingItems.records[this.playingIndex].t] === true))
          this.playingSubIndex = 0
          this.playingIndex++
        }
        requestAnimationFrame(() => this.play())
      } else {
        this.playing = false
        EventBus.$emit('play-end')
      }
    }
  },
  beforeDestroy () {
    EventBus.$off('record-updated', this.recordUpdated)
    EventBus.$off('hands-coordinates', this.handsCoordinates)
    EventBus.$off('play-start', this.playStart)
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
h1 {
  color: black;
}
#visualizer {
  background: #fff;
}
.canvasWrapper {
  position: relative;
  width: 100%;
  height: 300px;
  text-align: center;
}
canvas {
  position: relative;
  border: 1px solid black;
}
canvas.back {
  border: 1px solid black;
  left: 152px;
}
canvas.front {
  left: -152px;
}
</style>
