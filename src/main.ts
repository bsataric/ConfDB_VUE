import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib'
import Vuex from 'vuex'

Vue.config.productionTip = false
//Vue.config.silent = true

const opts = {}

Vue.use(Vuetify)
Vue.use(Vuex)

new Vue({
  vuetify: new Vuetify(opts),
  render: (h) => h(App),
}).$mount('#app')
