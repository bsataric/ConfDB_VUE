import Vue from 'vue'
import Vuex from 'vuex'
import * as user from '@/store/modules/user.js'
import * as sequence from '@/store/modules/sequence.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    sequence,
    notification,
  },
  state: {
    //global state TODO
    categories: [
      'sustainability',
      'nature',
      'animal welfare',
      'housing',
      'education',
      'food',
      'community',
    ],
  },
})
