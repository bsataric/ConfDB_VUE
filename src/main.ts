import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib'

import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'

Vue.config.productionTip = false
//Vue.config.silent = true

const opts = {}

Vue.use(Vuetify)

new Vue({
  vuetify: new Vuetify(opts),
  render: (h) => h(App),
}).$mount('#app')
