<template>
  <div id="manager" class="tile is-child has-text-left">
    <div class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">delete record</p>
        </header>
        <section class="modal-card-body">
          do you really want to delete the record?
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" v-on:click="confirm">delete</button>
          <button class="button" v-on:click="cancel">cancel</button>
        </footer>
      </div>
    </div>
    <div class="message is-link" v-for="item in compItems" v-bind:key="item.id">
      <div class="message-header">
        <p>{{ item.label }}</p>
        <a class="button is-primary" v-on:click="play(item.id)">
          <span class="icon">
            <font-awesome-icon icon="play" size="lg" />
          </span>
        </a>
        <a class="button is-info">
          <span class="icon">
            <font-awesome-icon icon="plus" size="lg" />
          </span>
        </a>
        <a class="button is-info">
          <span class="icon">
            <font-awesome-icon icon="edit" size="lg" />
          </span>
        </a>
        <a class="button is-danger" v-on:click="suppress(item.id)">
          <span class="icon">
            <font-awesome-icon icon="trash-alt" size="lg" />
          </span>
        </a>
      </div>
      <div class="message-body">{{ item.duration }}</div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../event-bus.js'
import * as $ from 'jQuery'
import Chance from 'chance'
import moment from 'moment'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

fontawesome.library.add(faPlay, faPlus, faEdit, faTrashAlt)

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
  computed: {
    compItems: function () {
      let comp = {}
      for (let i in this.items) {
        comp[i] = this.items[i]
      }
      return comp
    }
  },
  methods: {
    init: function () {
      this.BACKEND_ADDR = process.env.BACKEND_ADDR
      this.chance = new Chance()
      $.getJSON(this.BACKEND_ADDR + '/items', (data) => {
        this.items = data
        this.items.forEach((item) => { // @FIXME ???
          item.records.forEach((record) => {
            record.x = parseFloat(record.x)
            record.y = parseFloat(record.y)
            record.z = parseFloat(record.z)
          })
          item.keyPoints.forEach((keyPoint) => {
            keyPoint = parseInt(keyPoint)
          })
        })
      })
      EventBus.$on('record-stop', this.recordStop)
      EventBus.$on('play-end', this.playEnd)
      EventBus.$on('play-vector', this.playVector)
    },
    recordStop: function (recorder) {
      if (recorder.records.length > 0) {
        let item = {
          id: this.chance.guid(),
          records: recorder.records,
          keyPoints: recorder.keyPoints
        }
        item.label = moment().format('DD/MM/YYYY, HH:mm:ss')
        let duration = moment.duration(item.records[item.records.length - 1].t)
        item.duration = (duration.asHours() | 0) + 'h ' + (duration.asMinutes() | 0) + 'm ' + (duration.asSeconds() | 0) + 's'
        this.items.push(item)
        this.saveAll()
      }
    },
    playEnd: function () {
      this._pending_play_id = null
      $('a.button').attr('disabled', false)
    },
    playVector: function (xz, xy, keyPoint) {
      EventBus.socket.emit('play-vector', xz, xy, keyPoint)
    },
    play: function (id) {
      this._pending_play_id = id
      for (let i = 0, l = this.items.length; i < l; i++) {
        if (this.items[i].id === this._pending_play_id) {
          EventBus.$emit('play-start', this.items[i])
          $('a.button').attr('disabled', true)
        }
      }
    },
    suppress: function (id) {
      this._pending_suppress_id = id
      $('.modal').addClass('is-active')
    },
    confirm: function () {
      let newItems = []
      for (let i = 0, l = this.items.length; i < l; i++) {
        if (this.items[i].id !== this._pending_suppress_id) {
          newItems.push(this.items[i])
        }
      }
      this._pending_suppress_id = null
      this.items = newItems
      this.saveAll((data) => {
        $('.modal').removeClass('is-active')
      })
    },
    cancel: function () {
      this._pending_suppress_id = null
      $('.modal').removeClass('is-active')
    },
    saveAll: function (cb) {
      $.post(this.BACKEND_ADDR + '/items', {data: this.items}, (data) => {
        if (cb) {
          cb(data)
        }
      }, 'json')
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    EventBus.$off('record-stop', this.recordStop)
    EventBus.$off('play-end', this.playEnd)
    EventBus.$off('play-vector', this.playVector)
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
