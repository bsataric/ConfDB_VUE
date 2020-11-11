import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  directives: {
    Ripple,
  },
})

const opts = {} //TODO: change this to be dynamic (no dark for now will have to be custom probably)

export default new Vuetify(opts)
