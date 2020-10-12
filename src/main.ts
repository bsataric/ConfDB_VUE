import Vue from 'vue'
import App from './App.vue'
import './plugins/vuetify'
import vuetify from './plugins/vuetify'

import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-light-theme.css'

Vue.config.productionTip = false
//Vue.config.silent = true

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
