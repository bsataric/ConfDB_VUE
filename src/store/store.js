import Vue from 'vue'
import Vuex from 'vuex'
import * as sequence from '@/store/modules/sequence.js'
import * as path from '@/store/modules/path.js'
import * as module from '@/store/modules/module.js'
import * as pset from '@/store/modules/pset.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sequence,
    path,
    module,
    pset,
    notification,
  },
  state: {
    selectedNodeType: '', //TODO: maybe create action or something to change this through it
  },
  mutations: {
    SET_SELECTED_NODE_TYPE(state, nodeType) {
      state.selectedNodeType = nodeType
    },
  },
  getters: {
    getSelectedNodeType(state) {
      return state.selectedNodeType
    },
  },
})
