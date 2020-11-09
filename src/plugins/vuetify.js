import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  directives: {
    Ripple,
  },
})

const opts = { theme: { dark: true } } //TODO: change this to be dynamic

export default new Vuetify(opts)
