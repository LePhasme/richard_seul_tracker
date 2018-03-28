<template>
  <div id="app" class="tile is-ancestor is-vertical is-marginless">
    <router-view name="Tracker"></router-view>
    <router-view name="Visualizer"></router-view>
    <router-view name="Recorder"></router-view>
    <router-view name="Manager"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    init: function () {
      // nope
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
a.button {
  margin: 0 0 0 10px;
}
</style>
