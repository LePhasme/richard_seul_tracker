<template>
  <div id="recorder" class="tile is-child notification is-info">
    <h1 class="subtitle is-5">{{statusText}}</h1>
  </div>
</template>

<script>
import { EventBus } from '../event-bus.js'
import * as $ from 'jQuery'

export default {
  name: 'Recorder',
  data () {
    return {
      recording: false,
      pending: false,
      statusText: '[n]ew record',
      oldCoords: null,
      delta: 0.0075,
      startTime: 0,
      endTime: 0,
      records: [],
      keyPoints: [],
      playing: false
    }
  },
  methods: {
    init: function () {
      $(document).keyup((e) => {
        if (this.playing === false) {
          if (e.keyCode === 27) { // esc
            if (this.pending === true) {
              this.stop()
            }
          } else if (e.keyCode === 32) { // space
            if (this.pending === true) {
              this.start()
            } else if (this.recording === true) {
              this.addKeyPoint()
            }
          } else if (e.keyCode === 78) { // n
            if (this.pending === false && this.recording === false) {
              this.wait()
            }
          } else if (e.keyCode === 83) { // s
            if (this.recording === true) {
              this.stop()
            }
          }
        }
      })
      EventBus.$on('hands-coordinates', this.handsCoordinates)
      EventBus.$on('hands-changes', this.handsChanges)
      EventBus.$on('play-start', this.playStart)
      EventBus.$on('play-end', this.playEnd)
    },
    handsCoordinates: function (palm, radius) {
      if (this.recording === true && (this.oldCoords === null || Math.abs(this.oldCoords[0] - palm[0]) > this.delta || Math.abs(this.oldCoords[1] - palm[1]) > this.delta || Math.abs(this.oldCoords[2] - palm[2]) > this.delta)) {
        this.record(Date.now(), palm, radius)
        this.oldCoords = palm
      }
    },
    handsChanges: function (from, to) {
      if (this.recording === true && to < 1) {
        this.stop()
      }
    },
    playStart: function () {
      this.playing = false
      $('#recorder').addClass('is-warning')
      this.statusText = 'playing...'
    },
    playEnd: function () {
      this.playing = false
      $('#recorder').removeClass('is-warning')
      this.statusText = '[n]ew record'
    },
    wait: function () {
      this.pending = true
      this.recording = false
      this.statusText = '[space] to start recording ([esc] to cancel)'
      $('#recorder').addClass('is-warning')
      this.records = []
      this.keyPoints = []
      EventBus.$emit('record-pending')
    },
    start: function () {
      this.pending = false
      this.recording = true
      this.statusText = '[s]top ([space] to add key point)'
      $('#recorder').addClass('is-danger')
      this.startTime = Date.now()
      EventBus.$emit('record-start')
    },
    stop: function () {
      this.oldCoords = null
      this.pending = false
      this.recording = false
      this.statusText = '[n]ew record'
      $('#recorder').removeClass('is-danger').removeClass('is-warning')
      this.endTime = Date.now()
      EventBus.$emit('record-stop', this)
    },
    record: function (t, palm, radius) {
      this.records.push({
        t: t - this.startTime,
        x: palm[0],
        y: palm[1],
        z: palm[2],
        r: radius
      })
      EventBus.$emit('record-updated', this)
    },
    addKeyPoint: function () {
      this.keyPoints.push(this.records[this.records.length - 1].t)
    }
  },
  beforeDestroy () {
    EventBus.$off('hands-coordinates', this.handsCoordinates)
    EventBus.$off('hands-changes', this.handsChanges)
    EventBus.$off('play-start', this.playStart)
    EventBus.$off('play-end', this.playEnd)
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
h1 {
  color: white;
}
#recorder {
  margin-bottom: 0 !important;
}
</style>
