import Vue from 'vue'
import Router from 'vue-router'
import Tracker from '@/components/Tracker'
import Visualizer from '@/components/Visualizer'
import Recorder from '@/components/Recorder'
import Manager from '@/components/Manager'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Main',
    components: {
      Tracker: Tracker,
      Visualizer: Visualizer,
      Recorder: Recorder,
      Manager: Manager
    }
  }]
})
