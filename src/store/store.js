import Vue from 'vue'
import Vuex from 'vuex'
import * as sequence from '@/store/modules/sequence.js'
import * as path from '@/store/modules/path.js'
import * as module from '@/store/modules/module.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sequence,
    path,
    module,
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
