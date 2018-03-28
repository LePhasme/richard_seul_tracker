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
          <button class="button is-danger" v-on:click="confirm">confirm</button>
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
      let chance = new Chance()
      $.getJSON('http://127.0.0.1:8090/items', (data) => { // @FIXME SETTINGS/API
        this.items = data
        this.items.forEach((item) => { // @FIXME ???
          item.records.forEach((record) => {
            record.x = parseFloat(record.x)
            record.y = parseFloat(record.y)
            record.z = parseFloat(record.z)
          })
          for (let key in item.keyPoints) {
            item.keyPoints[key] = true
          }
        })
      })
      EventBus.$on('record-stop', (recorder) => {
        if (recorder.records.length > 0) {
          let item = {
            id: chance.guid(),
            records: recorder.records,
            keyPoints: recorder.keyPoints
          }
          item.label = moment().format('DD/MM/YYYY, HH:mm:ss')
          let duration = moment.duration(item.records[item.records.length - 1].t)
          item.duration = (duration.asHours() | 0) + 'h ' + (duration.asMinutes() | 0) + 'm ' + (duration.asSeconds() | 0) + 's'
          this.items.push(item)
          this.saveAll()
        }
      })
      EventBus.$on('play-end', () => {
        this._pending_play_id = null
        $('a.button').attr('disabled', false)
      })
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
      $.post('http://127.0.0.1:8090/items', {data: this.items}, (data) => { // @FIXME SETTINGS/API
        if (cb) {
          cb(data)
        }
      }, 'json')
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
