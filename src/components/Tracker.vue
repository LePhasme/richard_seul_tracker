<template>
  <div id="tracker" class="tile is-child notification is-info is-marginless">
    <h1 class="subtitle is-5">{{statusText}}</h1>
  </div>
</template>

<script>
// import Leap from 'leapjs'
import { EventBus } from '../event-bus.js'
import * as $ from 'jQuery'

export default {
  name: 'Tracker',
  data () {
    return {
      tracking: false,
      statusText: 'idle',
      handsLength: -1,
      smoothingPos: [],
      smoothingRadius: [],
      smoothingPower: 5
    }
  },
  methods: {
    init: function () {
      /*
      Leap.loop({
        background: true
      }, frame => {
        let newLength = frame.hands.length
        if (newLength !== this.handsLength) {
          EventBus.$emit('hands-changes', this.handsLength, newLength)
          if (newLength > 0) {
            this.tracking = true
            this.statusText = 'tracking'
            $('#tracker').addClass('is-success')
          } else {
            this.tracking = false
            this.statusText = 'idle'
            $('#tracker').removeClass('is-success')
          }
        }
        if (this.tracking === true) {
          EventBus.$emit('hands-coordinates', this.smoothPos(frame.interactionBox.normalizePoint(frame.hands[0].palmPosition, true)), this.smoothRadius(frame.hands[0].sphereRadius))
        }
        this.handsLength = newLength
      })
      */
      $(document).off('mousemove')
      $(document).mousemove((e) => {
        let pos = [e.pageX / $(document).width(), 0, e.pageY / $(document).height()]
        EventBus.$emit('hands-coordinates', this.smoothPos(pos), this.smoothRadius(0))
      })
    },
    smoothPos: function (newPos) {
      this.smoothingPos.push(newPos)
      if (this.smoothingPos.length > this.smoothingPower) {
        this.smoothingPos.shift()
      }
      let l = this.smoothingPos.length
      let px = 0
      let py = 0
      let pz = 0
      for (let i = 0; i < l; i++) {
        px += this.smoothingPos[i][0]
        py += this.smoothingPos[i][1]
        pz += this.smoothingPos[i][2]
      }
      return [px / l, py / l, pz / l]
    },
    smoothRadius: function (newRadius) {
      this.smoothingRadius.push(newRadius)
      if (this.smoothingRadius.length > this.smoothingPower) {
        this.smoothingRadius.shift()
      }
      let l = this.smoothingRadius.length
      let r = 0
      for (let i = 0; i < l; i++) {
        r += this.smoothingRadius[i]
      }
      return r / l
    }
  },
  beforeDestroy () {
    // nope
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
#tracker {
  display: none;
  margin-bottom: 0 !important;
}
</style>
