import Vue from 'vue'
import Vuex from 'vuex'
import * as sequence from '@/store/modules/sequence.js'
import * as path from '@/store/modules/path.js'
import * as module from '@/store/modules/module.js'
import * as pset from '@/store/modules/pset.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
    openNodeIds: [],
    openFileContent: '',
  },
  mutations: {
    SET_SELECTED_NODE(state, payload) {
      /*      console.log(payload.selectedNodeType)
      console.log(payload.selectedNodeName)
      console.log(payload.selectedNodeId)
      console.log(payload.selectedNodeParamLength) */

      state.selectedNodeType = payload.selectedNodeType
      state.selectedNodeName = payload.selectedNodeName
      state.selectedNodeId = payload.selectedNodeId
      state.selectedNodeParamLength = payload.selectedNodeParamLength
      /* 
      if (state.selectedNodeParamLength == 0) {
        console.log('ITEM CHILDREN ZERO!')
        return
      }

      let idIndex = state.openNodeIds.indexOf(state.selectedNodeId)

      console.log('OPEN NODES BEFORE: ' + state.openNodeIds)

      if (idIndex == -1) state.openNodeIds.push(state.selectedNodeId)
      else state.openNodeIds.splice(idIndex, 1)

      console.log('OPEN NODES AFTER: ' + state.openNodeIds) */

      state.openNodeIds = [1]
    },
    SET_NODE_NAME_ID_MAP(state, payload) {
      state.nodeNameIdMap = payload
      //console.log('MAP: ' + JSON.stringify(state.nodeNameIdMap))
    },
    SET_OPEN_FILE_CONTENT(state, payload) {
      console.log('SETTING OPEN FILE CONTENT:')
      state.openFileContent = payload
      console.log('OPEN FILE CONTENT SET:' + payload)
    },
  },
  actions: {
    createNodeNameIdMap({ commit }, nodeNameIdMap) {
      commit('SET_NODE_NAME_ID_MAP', nodeNameIdMap)
    },
    setSelectedNode({ commit }, payload) {
      commit('SET_SELECTED_NODE', payload)
    },
    setOpenFileContent({ commit }, payload) {
      commit('SET_OPEN_FILE_CONTENT', payload)
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
    getOpenNodeIds(state) {
      console.log('openNodeIds FIRED')
      console.log('openNodeIds:' + state.openNodeIds)
      sleep(2000).then(() => {
        //have a little delay to avoid race condition
        console.log('DELAY CALLED')
        return state.openNodeIds
      })
    },
    getOpenNodeIdsLength(state) {
      //console.log('openNodeIds.length FIRED')
      //console.log('openNodeIds:' + state.openNodeIds)
      return state.openNodeIds.length
    },
    getOpenFileContent(state) {
      console.log('GET OPEN FILE CONTENT: ' + state.getOpenFileContent)
      return state.openFileContent
    },
  },
})
