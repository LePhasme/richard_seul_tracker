<template>
  <div id="app" class="tile is-ancestor is-vertical is-marginless">
    <router-view name="Tracker"></router-view>
    <router-view name="Visualizer"></router-view>
    <router-view name="Recorder"></router-view>
    <router-view name="Manager"></router-view>
  </div>
</template>

<script>
import { EventBus } from './event-bus.js'

export default {
  name: 'App',
  methods: {
    init: function () {
      EventBus.$on('hands-changes', (from, to) => {
        // console.log(`(in App) Hands changed from ${from} to ${to}`)
      })
    }
  },
  beforeMount () {
    this.init()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
