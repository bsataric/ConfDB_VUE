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
    selectedNodeName: '',
    selectedNodeId: -1,
    selectedNodeParamLength: 0,
    nodeNameIdMap: {},
  },
  mutations: {
    SET_SELECTED_NODE(state, payload) {
      /*      console.log(payload.selectedNodeType)
      console.log(payload.selectedNodeName)
      console.log(payload.selectedNodeId) */
      state.selectedNodeType = payload.selectedNodeType
      state.selectedNodeName = payload.selectedNodeName
      state.selectedNodeId = payload.selectedNodeId
      state.selectedNodeParamLength = payload.selectedNodeParamLength
    },
    SET_NODE_NAME_ID_MAP(state, payload) {
      state.nodeNameIdMap = payload
      //console.log('MAP: ' + JSON.stringify(state.nodeNameIdMap))
    },
  },
  actions: {
    createNodeNameIdMap({ commit }, nodeNameIdMap) {
      commit('SET_NODE_NAME_ID_MAP', nodeNameIdMap)
    },
  },
  getters: {
    getSelectedNodeType(state) {
      return state.selectedNodeType
    },
    getSelectedNodeName(state) {
      return state.selectedNodeName
    },
    getSelectedNodeId(state) {
      return state.selectedNodeId
    },
    getSelectedNodeParamLength(state) {
      return state.selectedNodeParamLength
    },
    getNodeNameIdMap(state) {
      return state.nodeNameIdMap
    },
  },
})
