import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const opts = { theme: { dark: true } } //TODO: change this to be dynamic

export default new Vuetify(opts)
