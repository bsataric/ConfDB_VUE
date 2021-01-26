import Vue from 'vue'
import Vuex from 'vuex'
import { MainVuexState } from '../types'
import * as sequence from '@/store/modules/sequence.js'
import * as path from '@/store/modules/path.js'
import * as module from '@/store/modules/module.js'
import * as pset from '@/store/modules/pset.js'
import Utils from '@/lib/utils.ts'

Vue.use(Vuex)

/* async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
} */

const state: MainVuexState = {
  selectedNodeType: '', //TODO: maybe create action or something to change this through it
  selectedNodeName: '',
  selectedNodeId: -1,
  selectedNodeParamLength: 0,
  selectedNodeParentId: 0,
  nodeIDToObjectMap: {},
  openNodeIds: [],
  forcedOpenNodeIds: [],
  forcedActiveNodeId: 0,
  openFileContent: '',
  darkMode: false,
  idCounter: 0,
  snackBarOpen: false,
  snackBarText: '',
  snackBarColor: '',
}

export default new Vuex.Store({
  modules: {
    sequence,
    path,
    module,
    pset,
  },
  state,
  mutations: {
    SET_SELECTED_NODE_VIA_ID(state, payload) {
      //console.log('SELECTED NODE ID: ' + payload.selectedNodeId)
      state.selectedNodeId = payload.selectedNodeId //get all info just via ID
      //console.log(typeof state.selectedNodeId)
      console.log(
        'state.nodeIDToObjectMap[payload.selectedNodeId]' +
          JSON.stringify(state.nodeIDToObjectMap[payload.selectedNodeId])
      )
      state.selectedNodeType =
        state.nodeIDToObjectMap[payload.selectedNodeId].type
      state.selectedNodeName =
        state.nodeIDToObjectMap[payload.selectedNodeId].name
      console.log('state.selectedNodeName ' + state.selectedNodeName)
      state.selectedNodeParamLength =
        state.nodeIDToObjectMap[payload.selectedNodeId].itemChildrenLength
      state.selectedNodeParentId =
        state.nodeIDToObjectMap[payload.selectedNodeId].parentNodeId
      let forceOpenNode = payload.forceOpenNode //if node is opened by foce open it's parent as well

      console.log('FORCED OPEN NODE: ' + forceOpenNode)
      if (forceOpenNode) {
        state.forcedActiveNodeId = state.selectedNodeId
        //console.log('FORCED NODE ID: ' + state.forcedActiveNodeId)
      }
      //TODO FIX LEAF SEQUENCE DISPLAYING
      /*    if (state.selectedNodeParamLength == 0) {
        console.log('ITEM CHILDREN ZERO!')
        return
      } */

      let idIndex = state.openNodeIds.indexOf(payload.selectedNodeId)
      //console.log('SELECTED NODE ID: ' + state.selectedNodeId)
      //console.log('OPEN NODES BEFORE: ' + state.openNodeIds)
      //console.log('IDINDEX: ' + idIndex)

      if (idIndex == -1) {
        //console.log('OVDE USAO')
        if (forceOpenNode) {
          //if force is enwoked both node and it's parent have to be opened
          //console.log('SELECTED NODE TYPE: ' + state.selectedNodeType)

          //console.log('PARENT NODE ID: ' + state.selectedNodeParentId)
          let parentNodeIndex = state.openNodeIds.indexOf(
            state.selectedNodeParentId
          )
          console.log('PARENT NODE INDEX: ' + parentNodeIndex)
          if (parentNodeIndex == -1) {
            //push parent node on array as well
            state.openNodeIds.push(state.selectedNodeParentId)
          }
          //else do nothing (TODO MAYBE FOCUS OR ACTIVATE)
        }
        state.openNodeIds.push(state.selectedNodeId)
      } else {
        if (forceOpenNode) {
          //if force is enwoked both node and it's parent have to be opened
          //console.log('PARENT NODE ID: ' + state.selectedNodeParentId)

          let parentNodeIndex = state.openNodeIds.indexOf(
            state.selectedNodeParentId
          )
          console.log('PARENT NODE INDEX: ' + parentNodeIndex)
          if (parentNodeIndex == -1) {
            //push parent node on array as well
            state.openNodeIds.push(state.selectedNodeParentId)
          }
          //else do nothing (both nodes are already open - TODO MAYBE FOCUS OR ACTIVATE)
        }
        //console.log('SPLICE')
        state.openNodeIds.splice(idIndex, 1) //close the node if already open
      }

      //console.log('OPEN NODES AFTER: ' + state.openNodeIds)
      if (forceOpenNode) {
        //console.log('FORCED OPEN!')
        state.forcedOpenNodeIds = [...state.openNodeIds] //cannot assign by reference, but copy whole array
      }
      //state.openNodeIds = [1]
    },
    SET_ID_TO_OBJECT_MAP(state, payload) {
      state.nodeIDToObjectMap = payload
      /*      console.log(
        'nodeIDToObjectMap:' + JSON.stringify(state.nodeIDToObjectMap)
      ) */
    },
    APPEND_ID_TO_OBJECT_MAP(state, payload) {
      console.log('APPEND_ID_TO_OBJECT_MAP')
      console.log(
        'payload.nodeIDToObject' + JSON.stringify(payload.nodeIDToObject)
      )
      console.log('payload.id ' + payload.id)
      state.nodeIDToObjectMap[payload.id] = payload.nodeIDToObject
      /*   console.log(
        'nodeIDToObjectMap:' + JSON.stringify(state.nodeIDToObjectMap)
      ) */
    },
    REMOVE_ID_OBJECT_FROM_MAP(state, payload) {
      delete state.nodeIDToObjectMap[payload]
    },
    SET_INITIAL_ID_COUNTER(state, payload) {
      console.log('SETTING INITIAL ID COUNTER: ' + payload)
      state.idCounter = payload
    },
    INCREMENT_ID_COUNTER(state) {
      console.log('INCREMENTING ID COUNTER')
      state.idCounter++
    },
    SET_OPEN_FILE_CONTENT(state, payload) {
      //console.log('SETTING OPEN FILE CONTENT:')
      state.openFileContent = payload
      //console.log('OPEN FILE CONTENT SET:' + payload)
    },
    SET_DARK_MODE(state, payload) {
      state.darkMode = payload
    },
    SET_SNACKBAR_TEXT(state, payload) {
      state.snackBarOpen = true
      console.log('SNACKBAR COLOR: ' + payload.snackBarColor)
      state.snackBarText = payload.snackBarText
      state.snackBarColor = payload.snackBarColor
      Utils.sleep(4000).then(() => {
        state.snackBarOpen = false
      })
    },
  },
  actions: {
    createNodeIDToObjectMap({ commit }, nodeIDToObjectMap) {
      commit('SET_ID_TO_OBJECT_MAP', nodeIDToObjectMap)
    },
    appendNodeIDToObjectMap({ commit }, nodeIDToObject) {
      commit('APPEND_ID_TO_OBJECT_MAP', nodeIDToObject)
    },
    removeNodeIDObjectFromMap({ commit }, payload) {},
    setSelectedNodeViaID({ commit }, payload) {
      commit('SET_SELECTED_NODE_VIA_ID', payload)
    },
    setInitialIDCounter({ commit }, payload) {
      commit('SET_INITIAL_ID_COUNTER', payload)
    },
    incrementIDCounter({ commit }) {
      commit('INCREMENT_ID_COUNTER')
    },
    setOpenFileContent({ commit }, payload) {
      commit('SET_OPEN_FILE_CONTENT', payload)
    },
    setDarkMode({ commit }, payload) {
      commit('SET_DARK_MODE', payload)
    },
    setSnackBarText({ commit }, payload) {
      commit('SET_SNACKBAR_TEXT', payload)
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
    getNodeIDToObjectMap(state) {
      return state.nodeIDToObjectMap
    },
    getIDCounter(state) {
      return state.idCounter
    },
    getOpenNodeIds(state) {
      //console.log('openNodeIds FIRED')
      //console.log('openNodeIds:' + state.openNodeIds)
      //sleep(2000).then(() => {
      //have a little delay to avoid race condition
      //console.log('DELAY CALLED')
      return state.openNodeIds
      //})
    },
    getForcedOpenNodeIds(state) {
      return state.forcedOpenNodeIds
    },
    getForcedActiveNodeId(state) {
      return state.forcedActiveNodeId
    },
    getOpenNodeIdsLength(state) {
      //console.log('openNodeIds.length FIRED')
      //console.log('openNodeIds:' + state.openNodeIds)
      return state.openNodeIds.length
    },
    getOpenFileContent(state) {
      //console.log('GET OPEN FILE CONTENT: ' + state.getOpenFileContent)
      return state.openFileContent
    },
    getDarkMode(state) {
      return state.darkMode
    },
    getSnackBarOpen(state) {
      return state.snackBarOpen
    },
    getSnackBarText(state) {
      return state.snackBarText
    },
    getSnackBarColor(state) {
      //console.log('SNACKBAR COLOR: ' + state.snackBarColor)
      return state.snackBarColor
    },
  },
})
