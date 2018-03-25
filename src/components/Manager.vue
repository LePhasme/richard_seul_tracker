<template>
  <div id="manager" class="tile is-child has-text-left">
    <div class="message is-link" v-for="item in items" v-bind:key="item.id">
      <div class="message-header">
        <p>{{ item.id }}</p>
        <font-awesome-icon icon="plus" size="lg" />
        <font-awesome-icon icon="edit" size="lg" />
        <font-awesome-icon icon="trash-alt" size="lg" />
      </div>
      <div class="message-body">{{ item.records.length }}</div>
      <!-- header class="card-header">
        <p class="card-header-title">
          {{ item.id }}
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          {{ item.records.length }}
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item">Edit</a>
        <a href="#" class="card-footer-item">Delete</a>
      </footer -->
    </div>
  </div>
</template>

<script>
import { EventBus } from '../event-bus.js'
// import * as $ from 'jQuery'
import Chance from 'chance'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

fontawesome.library.add(faPlus, faEdit, faTrashAlt)

export default {
  name: 'Manager',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      items: []
    }
  },
  methods: {
    init: function () {
      let chance = new Chance()
      EventBus.$on('record-stop', (recorder) => {
        if (recorder.records.length > 0) {
          this.items.push({
            id: chance.guid(),
            records: recorder.records,
            keyPoints: recorder.keyPoints
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.message {
  display: inline-block;
  margin: 0.5rem;
  nopadding: 0.5rem 1rem;
}
.message-header p {
  padding-right: 5rem;
}
</style>
