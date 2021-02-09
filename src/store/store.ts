import Vue from 'vue'
import Vuex from 'vuex'
import { MainVuexState, NodeObject } from '../types'
import * as sequence from '@/store/modules/sequence.js'
import * as path from '@/store/modules/path.js'
import * as module from '@/store/modules/module.js'
import * as pset from '@/store/modules/pset.js'
import Utils from '@/lib/utils.ts'
import JSONParser from '@/store/helpers/JSONParser'

Vue.use(Vuex)

/* async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
} */

const state: MainVuexState = {
  //selected node information
  selectedNodeType: '',
  selectedNodeName: '',
  selectedNodeId: -1,
  selectedNodeParamLength: 0,
  selectedNodeParentId: 0,
  //node ID to Object map containing (type, name, itemChildrenLength, parentNodeId) with node id as key
  nodeIDToVuexObjectMap: {},
  //node ID to Object map containing all information about every node in the configuration tree
  nodeIDToNodeObjectMap: {},
  //arrays with node id's - open nodes and forced open nodes
  openNodeIds: [],
  forcedOpenNodeIds: [],
  forcedActiveNodeId: 0,
  //content of the opened JSON file
  openFileContent: '',
  //content of the saved JSON file
  savedFileContent: '',
  darkMode: false,
  //global node ID counter
  idCounter: 0,
  //snackbar variables
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
      /* console.log(
        'state.nodeIDToVuexObjectMap[payload.selectedNodeId]' +
          JSON.stringify(state.nodeIDToVuexObjectMap[payload.selectedNodeId])
      ) */
      state.selectedNodeType =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].type
      state.selectedNodeName =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].name
      //console.log('state.selectedNodeName ' + state.selectedNodeName)
      state.selectedNodeParamLength =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].itemChildrenLength
      state.selectedNodeParentId =
        state.nodeIDToVuexObjectMap[payload.selectedNodeId].parentNodeId
      let forceOpenNode = payload.forceOpenNode //if node is opened by foce open it's parent as well

      //console.log('FORCED OPEN NODE: ' + forceOpenNode)
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
          //console.log('PARENT NODE INDEX: ' + parentNodeIndex)
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
    SET_ID_TO_VUEX_OBJECT_MAP(state, payload) {
      state.nodeIDToVuexObjectMap = payload
      /*      console.log(
        'nodeIDToVuexObjectMap:' + JSON.stringify(state.nodeIDToVuexObjectMap)
      ) */
    },
    SET_ID_TO_NODE_OBJECT_MAP(state, payload) {
      state.nodeIDToNodeObjectMap = payload
    },
    CREATE_NODE_ID_TO_OBJECT_REFERENCES(state) {
      //TODO
      /*    id: number
      name: string
      type: string
      globalType: string
      children: Array<Object>
      parentNodeId: number
      referencedByIds: Array<number>
      iconType: string
      iconColor: string
      value: string */
      console.log('CREATING REFERENCES')
      //now pass through all the parameters of
      //console.log('MAP 1: ' + state.nodeIDToNodeObjectMap[1].globalType)
      for (const [key, value] of Object.entries(
        state.nodeIDToNodeObjectMap as Map<number, NodeObject>
      )) {
        /*       if (Number.parseInt(key) == 3818) {
          console.log('ID: ' + value.id)
          console.log('NAME: ' + value.name)
          console.log('TYPE: ' + value.type)
          console.log('GLOBALTYPE: ' + value.globalType)
          console.log('PARENTNODEID:' + value.parentNodeId)
        } */

        //parse top level sequences first
        if (value.parentNodeId > 0) {
          /*  console.log(
            'TYPE:' + state.nodeIDToNodeObjectMap[value.parentNodeId].type
          ) */
          if (state.nodeIDToNodeObjectMap[value.parentNodeId].type == 'seqs') {
            //TOP LEVEL SEQUENCE REFERENCES
            let sequenceName = value.name
            for (const [key1, value1] of Object.entries(
              //search through all nodes for references
              state.nodeIDToNodeObjectMap as Map<number, NodeObject>
            )) {
              if (value1.parentNodeId > 0) {
                let parentType: string =
                  state.nodeIDToNodeObjectMap[value1.parentNodeId].type
                if (
                  (parentType == 'sequences' || parentType == 'paths') &&
                  sequenceName == value1.name
                ) {
                  //nesting
                  value.referencedByIds.push(value1.id)
                  value1.rootNodeId = value.id
                }
              }
            }
            //console.log('TOP SEQUENCE NAME: ' + value.name)
            //console.log('REFERENCES: ' + value.referencedByIds)
          } else if (
            state.nodeIDToNodeObjectMap[value.parentNodeId].type == 'pts' //TOP LEVEL PATH REFERENCES
          ) {
            let pathName = value.name
            for (const [key1, value1] of Object.entries(
              //search through all nodes for references
              state.nodeIDToNodeObjectMap as Map<number, NodeObject>
            )) {
              if (value1.parentNodeId > 0) {
                let parentType: string =
                  state.nodeIDToNodeObjectMap[value1.parentNodeId].type
                if (parentType == 'paths' && pathName == value1.name) {
                  //nesting
                  value.referencedByIds.push(value1.id)
                  value1.rootNodeId = value.id
                }
              }
            }
            //console.log('TOP PATH NAME: ' + value.name)
            //console.log('REFERENCES: ' + value.referencedByIds)
          } else if (
            state.nodeIDToNodeObjectMap[value.parentNodeId].type == 'mods' //TOP LEVEL MODULE REFERENCES
          ) {
            //console.log('AAAAAAAAAAAAAA')
            let moduleName = value.name
            for (const [key1, value1] of Object.entries(
              //search through all nodes for references
              state.nodeIDToNodeObjectMap as Map<number, NodeObject>
            )) {
              if (value1.parentNodeId > 0) {
                let parentType: string =
                  state.nodeIDToNodeObjectMap[value1.parentNodeId].type
                if (
                  (parentType == 'sequences' || parentType == 'paths') &&
                  moduleName == value1.name
                ) {
                  //nesting
                  value.referencedByIds.push(value1.id)
                  value1.rootNodeId = value.id
                }
              }
            }
            //console.log('TOP MODULE NAME: ' + value.name)
            //console.log('REFERENCES: ' + value.referencedByIds)
          } //TODO CREATE ADDITINAL MODULE AND PARAMETER REFERENCES
        }
        //take each node name and iterate through all the other nodes recurcivly to find possible references
      }
    },
    ADD_NODE(state, payload) {
      /*      console.log('ADD_NODE')
      console.log(
        'payload.nodeIDToObject' + JSON.stringify(payload.nodeIDToObject)
      )
      console.log('payload.id ' + payload.id) */
      //state.nodeIDToVuexObjectMap[payload.id] = payload.nodeIDToObject

      //add new node both to children of the parent and in the main map
      state.nodeIDToNodeObjectMap[
        payload.nodeIDToObject.parentNodeId
      ].children.push(payload.nodeIDToObject)
      state.nodeIDToNodeObjectMap[payload.nodeId] = payload.nodeIDToObject
      /*   console.log(
        'nodeIDToVuexObjectMap:' + JSON.stringify(state.nodeIDToVuexObjectMap)
      ) */
    },
    RENAME_NODE(state, payload) {
      state.nodeIDToNodeObjectMap[payload.nodeId].name = payload.newNodeName
      for (
        //go through all the node references and rename them all
        let i = 0;
        i < state.nodeIDToNodeObjectMap[payload.nodeId].referencedByIds.length;
        i++
      ) {
        let referenceId =
          state.nodeIDToNodeObjectMap[payload.nodeId].referencedByIds[i]
        state.nodeIDToNodeObjectMap[referenceId].name = payload.newNodeName
      }
    },
    DELETE_NODE(state, payload) {
      let nodeToDelete = state.nodeIDToNodeObjectMap[payload.nodeId]
      //console.log('NODE TO DELETE: ' + JSON.stringify(nodeToDelete))
      //first delete references to node's children as well as children nodes
      //console.log('NODE CHILDREN: ' + nodeToDelete.children)
      for (const [key, value] of Object.entries(
        nodeToDelete.children as NodeObject
      )) {
        //console.log('KEY: ' + key)
        //console.log('VALUE: ' + JSON.stringify(value))
        //take rootNodeId of each child, go to that node and delete reference to this child
        let childIdToDelete = value.id
        let rootNodeId = value.rootNodeId
        console.log('CHILD TO DELETE: ' + childIdToDelete)
        console.log('ROOT NODE ID: ' + rootNodeId)
        /*         console.log(
          'ROOT NODE REFERENCES BEFORE DELETE: ' +
            state.nodeIDToNodeObjectMap[rootNodeId].referencedByIds
        ) */
        const referenceIndex = state.nodeIDToNodeObjectMap[
          rootNodeId
        ].referencedByIds.indexOf(childIdToDelete)
        if (referenceIndex > -1) {
          state.nodeIDToNodeObjectMap[rootNodeId].referencedByIds.splice(
            referenceIndex,
            1
          )
        }
        //delete child from children array
        /* console.log(
          'NODE CHILDREN BEFORE: ' + JSON.stringify(nodeToDelete.children)
        ) */
        //const childIndex = nodeToDelete.children.indexOf(childIdToDelete)
        //if (childIndex > -1) {
        nodeToDelete.children.splice(0, 1) //delete one child by one child
        //}
        //delete child from the map as well
        /*  console.log(
          'CHILD NODE BEFORE DELETE FROM MAP: ' +
            state.nodeIDToNodeObjectMap[childIdToDelete]
        ) */
        delete state.nodeIDToNodeObjectMap[childIdToDelete]
        /*  console.log(
          'CHILD NODE AFTER DELETE FROM MAP: ' +
            state.nodeIDToNodeObjectMap[childIdToDelete]
        ) */

        /* console.log(
          'NODE CHILDREN AFTER: ' + JSON.stringify(nodeToDelete.children)
        ) */

        /*         console.log(
          'ROOT NODE REFERENCES AFTER DELETE: ' +
            state.nodeIDToNodeObjectMap[rootNodeId].referencedByIds
        ) */
      }
      //then delete main node and all it's references (references first)
      //we can assume that references have no children but are just a mirror of the root node (for now)
      for (let i = 0; i < nodeToDelete.referencedByIds.length; i++) {
        //first we have to delete node from the children of it's parent node so it reflects in gui
        //then we have to delete the node object from the map
        //console.log('REFERENCE NODE ID: ' + nodeToDelete.referencedByIds[i])
        //get the parent node id of the reference
        let referenceParentNodeId =
          state.nodeIDToNodeObjectMap[nodeToDelete.referencedByIds[i]]
            .parentNodeId
        //console.log('REFERENCE PARENT NODE ID: ' + referenceParentNodeId)
        let childIndex = 0
        for (const [key, value] of Object.entries(
          state.nodeIDToNodeObjectMap[referenceParentNodeId]
            .children as NodeObject
        )) {
          //console.log('REFERENCE PARENT CHILD KEY: ' + key)
          console.log('REFERENCE PARENT CHILD VALUE: ' + value)
          //if value.id is the reference id splice that child from the parent
          if (value.id == nodeToDelete.referencedByIds[i]) {
            state.nodeIDToNodeObjectMap[referenceParentNodeId].children.splice(
              childIndex,
              1
            )
            //then we have to delete the node object from the map
            delete state.nodeIDToNodeObjectMap[value.id]
          }
          childIndex++
        }
      }
      //now we can delete the root node (first from it's parents children and then from the map)
      let parentId = nodeToDelete.parentNodeId
      console.log('PARENT ID: ' + parentId)
      let childIndex = 0
      for (const [key, value] of Object.entries(
        state.nodeIDToNodeObjectMap[parentId].children as NodeObject
      )) {
        if (value.id == nodeToDelete.id) {
          state.nodeIDToNodeObjectMap[parentId].children.splice(childIndex, 1)
          //then we have to delete the node object from the map
          delete state.nodeIDToNodeObjectMap[value.id]
        }
        childIndex++
      }
    },
    REMOVE_ID_OBJECT_FROM_MAP(state, payload) {
      delete state.nodeIDToVuexObjectMap[payload]
    },
    SET_INITIAL_ID_COUNTER(state, payload) {
      //console.log('SETTING INITIAL ID COUNTER: ' + payload)
      state.idCounter = payload
    },
    INCREMENT_ID_COUNTER(state) {
      //console.log('INCREMENTING ID COUNTER')
      state.idCounter++
    },
    SET_OPEN_FILE_CONTENT(state, payload) {
      //console.log('SETTING OPEN FILE CONTENT:')
      state.openFileContent = payload
      //console.log('OPEN FILE CONTENT SET:' + payload)
    },
    PARSE_MAP_TO_JSON_FILE(state, payload) {
      //parse the map here
      //console.log('SEQUENCES: ' + JSON.stringify(payload))
      state.savedFileContent = JSONParser.parseMapToJSON(
        state.nodeIDToNodeObjectMap
      )
      //console.log('AFTER CALL: ' + state.savedFileContent)
    },
    SET_DARK_MODE(state, payload) {
      state.darkMode = payload
    },
    SET_SNACKBAR_TEXT(state, payload) {
      state.snackBarOpen = true
      //console.log('SNACKBAR COLOR: ' + payload.snackBarColor)
      state.snackBarText = payload.snackBarText
      state.snackBarColor = payload.snackBarColor
      Utils.sleep(4000).then(() => {
        state.snackBarOpen = false
      })
    },
    SET_SNACKBAR_OPEN(state, payload) {
      state.snackBarOpen = payload
    },
  },
  actions: {
    createNodeIDToVuexObjectMap({ commit }, nodeIDToVuexObjectMap) {
      commit('SET_ID_TO_VUEX_OBJECT_MAP', nodeIDToVuexObjectMap)
    },
    createNodeIDToNodeObjectMap({ commit }, nodeIDToNodeObjectMap) {
      commit('SET_ID_TO_NODE_OBJECT_MAP', nodeIDToNodeObjectMap)
    },
    createObjectReferences({ commit }) {
      commit('CREATE_NODE_ID_TO_OBJECT_REFERENCES')
    },
    addNode({ commit }, payload) {
      commit('ADD_NODE', payload)
    },
    renameNode({ commit }, payload) {
      commit('RENAME_NODE', payload)
    },
    deleteNode({ commit }, payload) {
      commit('DELETE_NODE', payload)
    },
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
    parseMapToJSONFile({ commit, getters }) {
      let payload = getters.getSequences
      commit('PARSE_MAP_TO_JSON_FILE', payload)
    },
    setDarkMode({ commit }, payload) {
      commit('SET_DARK_MODE', payload)
    },
    setSnackBarText({ commit }, payload) {
      commit('SET_SNACKBAR_TEXT', payload)
    },
    setSnackBarOpen({ commit }, payload) {
      //console.log('CLOSING SNACKBAR')
      commit('SET_SNACKBAR_OPEN', payload)
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
    getNodeIDToVuexObjectMap(state) {
      return state.nodeIDToVuexObjectMap
    },
    getNodeIDToNodeObjectMap(state) {
      return state.nodeIDToNodeObjectMap
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
    getSavedFileContent(state) {
      return state.savedFileContent
    },
    getSequences: (state, getters, rootState, rootGetters) => {
      return rootGetters['sequence/getSequences']
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
