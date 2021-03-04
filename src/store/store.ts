import Vue from 'vue'
import Vuex from 'vuex'
import { MainVuexState, NodeObject, NodeBasicInfo } from '../types'
import Utils from '@/lib/utils.ts'
import JSONParser from '@/store/helpers/JSONParser'
import GlobalService from '@/services/GlobalService.ts'
import SnippetCreator from '@/store/helpers/SnippetCreator.ts'

Vue.use(Vuex)

/* async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
} */

const state: MainVuexState = {
  JSONconfiguration: {}, //JSON data from server/to save on server
  //selected node information
  selectedNodeType: '',
  selectedNodeName: '',
  selectedNodeCType: '',
  selectedNodeId: -1,
  selectedNodeParamLength: 0,
  selectedNodeParentId: 0,
  //node ID to Object map containing all information about every node in the configuration tree
  nodeIDToNodeObjectMap: {},
  //arrays holding IDs of specific node types
  nodeTypeIds: {},
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
  configLoaded: false,
}

export default new Vuex.Store({
  state,
  mutations: {
    SET_SELECTED_NODE_VIA_ID(state: MainVuexState, payload) {
      //console.log('SELECTED NODE ID: ' + payload.selectedNodeId)
      //console.log('state.openNodeIds: ' + state.openNodeIds)
      state.selectedNodeId = payload.selectedNodeId //get all info just via ID
      //console.log(typeof state.selectedNodeId)
      //override leaf nodes
      state.selectedNodeType =
        state.nodeIDToNodeObjectMap[payload.selectedNodeId].type
      state.selectedNodeName =
        state.nodeIDToNodeObjectMap[payload.selectedNodeId].name
      //console.log('state.selectedNodeName ' + state.selectedNodeName)
      state.selectedNodeCType =
        state.nodeIDToNodeObjectMap[payload.selectedNodeId].ctype
      state.selectedNodeParamLength =
        state.nodeIDToNodeObjectMap[payload.selectedNodeId].children.length
      state.selectedNodeParentId =
        state.nodeIDToNodeObjectMap[payload.selectedNodeId].parentNodeId
      let forceOpenNode = payload.forceOpenNode //if node is opened by foce open it's parent as well

      //console.log('FORCED OPEN NODE: ' + forceOpenNode)
      if (forceOpenNode) {
        state.forcedActiveNodeId = state.selectedNodeId
        //console.log('FORCED NODE ID: ' + state.forcedActiveNodeId)
      }

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
          //console.log('state.selectedNodeParentId' + state.selectedNodeParentId)
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
          //console.log('PARENT NODE INDEX: ' + parentNodeIndex)
          //console.log('state.selectedNodeParentId' + state.selectedNodeParentId)

          if (parentNodeIndex == -1) {
            //push parent node on array as well
            state.openNodeIds.push(state.selectedNodeParentId)
          }
          //else do nothing (both nodes are already open - TODO MAYBE FOCUS OR ACTIVATE)
        }
        //console.log('SPLICE')
        if (!forceOpenNode) state.openNodeIds.splice(idIndex, 1) //close the node if already open (not if forced)
      }

      //console.log('OPEN NODES AFTER: ' + state.openNodeIds)
      if (forceOpenNode) {
        //console.log('FORCED OPEN!')
        state.forcedOpenNodeIds = [...state.openNodeIds] //cannot assign by reference, but copy whole array
        //console.log('FORCED ARRAY: ' + state.forcedOpenNodeIds)
      }
      //state.openNodeIds = [1]
    },
    SET_ID_TO_NODE_OBJECT_MAP(state: MainVuexState, payload) {
      state.nodeIDToNodeObjectMap = payload
    },
    CREATE_NODE_ID_TO_OBJECT_REFERENCES(state: MainVuexState) {
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
      //console.log('CREATING REFERENCES')
      //now pass through all the parameters of
      //console.log('MAP 1: ' + state.nodeIDToNodeObjectMap[1].globalType)
      for (const [nodeId, nodeObject] of Object.entries(
        state.nodeIDToNodeObjectMap as Map<number, NodeObject>
      )) {
        /*       if (Number.parseInt(nodeId) == 3818) {
          console.log('ID: ' + nodeObject.id)
          console.log('NAME: ' + nodeObject.name)
          console.log('TYPE: ' + nodeObject.type)
          console.log('GLOBALTYPE: ' + nodeObject.globalType)
          console.log('PARENTNODEID:' + nodeObject.parentNodeId)
        } */

        //parse top level sequences first
        if (nodeObject.parentNodeId > 0) {
          /*  console.log(
            'TYPE:' + state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type
          ) */
          if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type == 'seqs'
          ) {
            //TOP LEVEL SEQUENCE REFERENCES
            let sequenceName = nodeObject.name
            for (const [key1, sequenceNodeObject] of Object.entries(
              //search through all nodes for references
              state.nodeIDToNodeObjectMap as Map<number, NodeObject>
            )) {
              if (sequenceNodeObject.parentNodeId > 0) {
                let parentType: string =
                  state.nodeIDToNodeObjectMap[sequenceNodeObject.parentNodeId]
                    .type
                if (
                  (parentType == 'sequences' || parentType == 'paths') &&
                  sequenceName == sequenceNodeObject.name
                ) {
                  //nesting
                  nodeObject.referencedByIds.push(sequenceNodeObject.id)
                  sequenceNodeObject.rootNodeId = nodeObject.id
                }
              }
            }
            //push this sequence ID in sequence IDs array
            if (state.nodeTypeIds['sequences'] == undefined) {
              state.nodeTypeIds['sequences'] = []
              state.nodeTypeIds['sequences'].push(nodeObject.id)
            } else state.nodeTypeIds['sequences'].push(nodeObject.id)

            //console.log('TOP SEQUENCE NAME: ' + nodeObject.name)
            //console.log('REFERENCES: ' + nodeObject.referencedByIds)
          } else if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type == 'tsks'
          ) {
            //TOP LEVEL SEQUENCE REFERENCES
            let taskName = nodeObject.name
            for (const [key1, taskNodeObject] of Object.entries(
              //search through all nodes for references
              state.nodeIDToNodeObjectMap as Map<number, NodeObject>
            )) {
              if (taskNodeObject.parentNodeId > 0) {
                //console.log('PARENT NODE ID: ' + taskNodeObject.parentNodeId)

                let parentType: string =
                  state.nodeIDToNodeObjectMap[taskNodeObject.parentNodeId].type
                if (
                  (parentType == 'sequences' ||
                    parentType == 'tasks' ||
                    parentType == 'paths') &&
                  taskName == taskNodeObject.name
                ) {
                  //nesting
                  nodeObject.referencedByIds.push(taskNodeObject.id)
                  taskNodeObject.rootNodeId = nodeObject.id
                }
              }
            }

            if (state.nodeTypeIds['tasks'] == undefined) {
              state.nodeTypeIds['tasks'] = []
              state.nodeTypeIds['tasks'].push(nodeObject.id)
            } else state.nodeTypeIds['tasks'].push(nodeObject.id)
            //console.log('TOP SEQUENCE NAME: ' + nodeObject.name)
            //console.log('REFERENCES: ' + nodeObject.referencedByIds)
          } else if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type == 'pts' //TOP LEVEL PATH REFERENCES
          ) {
            let pathName = nodeObject.name
            for (const [key1, pathNodeObject] of Object.entries(
              //search through all nodes for references
              state.nodeIDToNodeObjectMap as Map<number, NodeObject>
            )) {
              if (pathNodeObject.parentNodeId > 0) {
                let parentType: string =
                  state.nodeIDToNodeObjectMap[pathNodeObject.parentNodeId].type
                if (parentType == 'paths' && pathName == pathNodeObject.name) {
                  //nesting
                  nodeObject.referencedByIds.push(pathNodeObject.id)
                  pathNodeObject.rootNodeId = nodeObject.id
                }
              }
            }
            if (state.nodeTypeIds['paths'] == undefined) {
              state.nodeTypeIds['paths'] = []
              state.nodeTypeIds['paths'].push(nodeObject.id)
            } else state.nodeTypeIds['paths'].push(nodeObject.id)
            //console.log('TOP PATH NAME: ' + nodeObject.name)
            //console.log('REFERENCES: ' + nodeObject.referencedByIds)
          } else if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type == 'mods' //TOP LEVEL MODULE REFERENCES
          ) {
            //console.log('AAAAAAAAAAAAAA')
            let moduleName = nodeObject.name
            for (const [key1, moduleNodeObject] of Object.entries(
              //search through all nodes for references
              state.nodeIDToNodeObjectMap as Map<number, NodeObject>
            )) {
              if (moduleNodeObject.parentNodeId > 0) {
                let parentType: string =
                  state.nodeIDToNodeObjectMap[moduleNodeObject.parentNodeId]
                    .type
                if (
                  (parentType == 'sequences' ||
                    parentType == 'paths' ||
                    parentType == 'tasks') &&
                  moduleName == moduleNodeObject.name
                ) {
                  //nesting
                  nodeObject.referencedByIds.push(moduleNodeObject.id)
                  moduleNodeObject.rootNodeId = nodeObject.id
                }
              }
            }
            if (state.nodeTypeIds['modules'] == undefined) {
              state.nodeTypeIds['modules'] = []
              state.nodeTypeIds['modules'].push(nodeObject.id)
            } else state.nodeTypeIds['modules'].push(nodeObject.id)
            //console.log('TOP MODULE NAME: ' + nodeObject.name)
            //console.log('REFERENCES: ' + nodeObject.referencedByIds)
          } else if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type ==
            'esprods' //TOP LEVEL ESPRODUCER REFERENCES
          ) {
            //TODO: not sure if ESP can have references appart from tags
            if (state.nodeTypeIds['esproducers'] == undefined) {
              state.nodeTypeIds['esproducers'] = []
              state.nodeTypeIds['esproducers'].push(nodeObject.id)
            } else state.nodeTypeIds['esproducers'].push(nodeObject.id)
          } else if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type == 'psets' //TOP LEVEL PSET REFERENCES
          ) {
            //TODO: not sure if PSETS can have references appart from tags
            if (state.nodeTypeIds['psets'] == undefined) {
              state.nodeTypeIds['psets'] = []
              state.nodeTypeIds['psets'].push(nodeObject.id)
            } else state.nodeTypeIds['psets'].push(nodeObject.id)
          } else if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type ==
            'essour' //TOP LEVEL ESSOURCE REFERENCES
          ) {
            //TODO: not sure if ESSOURCES can have references appart from tags
            if (state.nodeTypeIds['essources'] == undefined) {
              state.nodeTypeIds['essources'] = []
              state.nodeTypeIds['essources'].push(nodeObject.id)
            } else state.nodeTypeIds['essources'].push(nodeObject.id)
          } else if (
            state.nodeIDToNodeObjectMap[nodeObject.parentNodeId].type == 'serv' //TOP LEVEL SERVICE REFERENCES
          ) {
            //TODO: not sure if SERVICES can have references appart from tags
            if (state.nodeTypeIds['services'] == undefined) {
              state.nodeTypeIds['services'] = []
              state.nodeTypeIds['services'].push(nodeObject.id)
            } else state.nodeTypeIds['services'].push(nodeObject.id)
          }
        }
        //take each node name and iterate through all the other nodes recurcivly to find possible references
      }
      //console.log('state.nodeTypeIds: ' + JSON.stringify(state.nodeTypeIds))
    },
    SET_JSON_CONFIGURATION(state: MainVuexState, payload) {
      state.JSONconfiguration = payload
      //console.log('JSON: ' + JSON.stringify(state.JSONconfiguration))
    },
    DELETE_JSON_CONFIGURATION(state) {
      //delete state.JSONconfiguration
    },
    ADD_NODE(state: MainVuexState, payload) {
      console.log('ADD_NODE')
      console.log(
        'payload.nodeIDToObject' + JSON.stringify(payload.nodeIDToObject)
      )
      console.log('payload.id ' + payload.nodeId)
      console.log(
        'payload.nodeIDToObject.parentNodeId ' +
          payload.nodeIDToObject.parentNodeId
      )

      //add new node both to children of the parent and in the main map
      state.nodeIDToNodeObjectMap[
        payload.nodeIDToObject.parentNodeId
      ].children.push(payload.nodeIDToObject)
      state.nodeIDToNodeObjectMap[payload.nodeId] = payload.nodeIDToObject
      console.log('NEW NODE ID: ' + payload.nodeId)
      console.log(
        'NEW nodeIDToNodeObjectMap:' +
          JSON.stringify(state.nodeIDToNodeObjectMap[payload.nodeId])
      )
    },
    RENAME_NODE(state: MainVuexState, payload) {
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
    DELETE_NODE(state: MainVuexState, payload) {
      let nodeToDelete = state.nodeIDToNodeObjectMap[payload.nodeId]
      //console.log('NODE TO DELETE: ' + JSON.stringify(nodeToDelete))
      //first delete references to node's children as well as children nodes
      //console.log('NODE CHILDREN: ' + nodeToDelete.children)
      for (const [nodeId, nodeObject] of Object.entries(
        nodeToDelete.children as NodeObject
      )) {
        //console.log('KEY: ' + nodeId)
        //console.log('VALUE: ' + JSON.stringify(nodeObject))
        //take rootNodeId of each child, go to that node and delete reference to this child
        let childIdToDelete = nodeObject.id
        let rootNodeId = nodeObject.rootNodeId
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
        for (const [key, nodeObject] of Object.entries(
          state.nodeIDToNodeObjectMap[referenceParentNodeId]
            .children as NodeObject
        )) {
          //console.log('REFERENCE PARENT CHILD KEY: ' + key)
          console.log('REFERENCE PARENT CHILD VALUE: ' + nodeObject)
          //if nodeObject.id is the reference id splice that child from the parent
          if (nodeObject.id == nodeToDelete.referencedByIds[i]) {
            state.nodeIDToNodeObjectMap[referenceParentNodeId].children.splice(
              childIndex,
              1
            )
            //then we have to delete the node object from the map
            delete state.nodeIDToNodeObjectMap[nodeObject.id]
          }
          childIndex++
        }
      }
      //now we can delete the root node (first from it's parents children and then from the map)
      let parentId = nodeToDelete.parentNodeId
      console.log('PARENT ID: ' + parentId)
      let childIndex = 0
      for (const [key, nodeObject] of Object.entries(
        state.nodeIDToNodeObjectMap[parentId].children as NodeObject
      )) {
        if (nodeObject.id == nodeToDelete.id) {
          state.nodeIDToNodeObjectMap[parentId].children.splice(childIndex, 1)
          //then we have to delete the node object from the map
          delete state.nodeIDToNodeObjectMap[nodeObject.id]
        }
        childIndex++
      }
    },
    INSERT_NODE_REFERENCE(state: MainVuexState, payload) {
      //we need parent node ID plus inserted node ID. Calculate the references
      let parentNodeObject: NodeObject =
        state.nodeIDToNodeObjectMap[payload.parentId]
      let childNodeObject: NodeObject =
        state.nodeIDToNodeObjectMap[payload.childId]

      //create new child node (it cannot be the same as every node needs unique ID)
      let newChildNodeObject: NodeObject = Object.assign(childNodeObject)
      newChildNodeObject.id = state.idCounter
      newChildNodeObject.parentNodeId = payload.parentId //parent is the passed parent
      newChildNodeObject.children = []
      //add reference to root node references
      console.log('newChildNodeObject: ' + JSON.stringify(newChildNodeObject))
      state.nodeIDToNodeObjectMap[
        newChildNodeObject.rootNodeId
      ].referencedByIds.push(newChildNodeObject.id)
      parentNodeObject.children.push(childNodeObject)
      console.log('newChildNodeObject.id:' + newChildNodeObject.id)
      state.nodeIDToNodeObjectMap[newChildNodeObject.id] = newChildNodeObject
      Utils.sleep(200)
    },
    TEST_ACTION(state: MainVuexState, payload) {
      //console.log(JSON.stringify(state.nodeIDToNodeObjectMap[1]))
      state.nodeIDToNodeObjectMap[1]['name'] = 'AAA'
      //console.log(JSON.stringify(state.nodeIDToNodeObjectMap[1]))
    },
    SET_INITIAL_ID_COUNTER(state: MainVuexState, payload) {
      //console.log('SETTING INITIAL ID COUNTER: ' + payload)
      state.idCounter = payload
    },
    INCREMENT_ID_COUNTER(state: MainVuexState) {
      //console.log('INCREMENTING ID COUNTER')
      state.idCounter++
    },
    SET_OPEN_FILE_CONTENT(state: MainVuexState, payload) {
      //console.log('SETTING OPEN FILE CONTENT:')
      state.openFileContent = payload
      //console.log('OPEN FILE CONTENT SET:' + payload)
    },
    PARSE_MAP_TO_JSON_FILE(state: MainVuexState) {
      //parse the map here
      state.savedFileContent = JSONParser.parseMapToJSON(
        state.nodeIDToNodeObjectMap
      )
    },
    SET_DARK_MODE(state: MainVuexState, payload) {
      state.darkMode = payload
    },
    SET_SNACKBAR_TEXT(state: MainVuexState, payload) {
      state.snackBarOpen = true
      //console.log('SNACKBAR COLOR: ' + payload.snackBarColor)
      state.snackBarText = payload.snackBarText
      state.snackBarColor = payload.snackBarColor
      Utils.sleep(4000).then(() => {
        state.snackBarOpen = false
      })
    },
    SET_SNACKBAR_OPEN(state: MainVuexState, payload: boolean) {
      state.snackBarOpen = payload
    },
    SET_CONFIG_LOADED(state: MainVuexState, payload: boolean) {
      //console.log('CONFIG LOADED: ' + payload)
      state.configLoaded = payload
    },
  },
  actions: {
    createNodeIDToNodeObjectMap({ commit }, payload) {
      commit('SET_ID_TO_NODE_OBJECT_MAP', payload)
    },
    createObjectReferences({ commit }) {
      commit('CREATE_NODE_ID_TO_OBJECT_REFERENCES')
    },
    deleteJSONConfiguration({ commit }) {
      commit('DELETE_JSON_CONFIGURATION')
    },
    fetchConfiguration({ commit, dispatch }, payload) {
      if (!payload.fromFile) {
        return GlobalService.getConfiguration()
          .then((response) => {
            commit('SET_JSON_CONFIGURATION', response.data)
            //console.log('SEQUENCE JSON DATA: ' + JSON.stringify(response.data))
          })
          .catch((error) => {
            const notification = {
              type: 'error',
              message:
                'There was a problem fetching configuration ' + error.message,
            }
            dispatch('notification/add', notification, { root: true })
          })
      } else {
        let configurationsData = GlobalService.getAllFromFile(payload.fileData)
        commit('SET_JSON_CONFIGURATION', configurationsData)
        //console.log('SEQUENCE FILE DATA: ' + JSON.stringify(sequenesData))
      }
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
    insertNodeReference({ commit }, payload) {
      commit('INSERT_NODE_REFERENCE', payload)
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
    parseMapToJSONFile({ commit }) {
      commit('PARSE_MAP_TO_JSON_FILE')
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
    setConfigLoaded({ commit }, payload) {
      //console.log('setConfigLoaded: ' + payload)
      commit('SET_CONFIG_LOADED', payload)
    },
    testAction({ commit }, payload) {
      commit('TEST_ACTION', payload)
    },
  },
  getters: {
    getConfiguration(state: MainVuexState): any {
      return state.JSONconfiguration
    },
    getSelectedNodeType(state: MainVuexState): string {
      return state.selectedNodeType
    },
    getSelectedNodeName(state: MainVuexState): string {
      return state.selectedNodeName
    },
    getSelectedNodeCType(state: MainVuexState): string {
      return state.selectedNodeCType
    },
    getSelectedNodeId(state: MainVuexState): number {
      return state.selectedNodeId
    },
    getSelectedNodeParamLength(state: MainVuexState): number {
      return state.selectedNodeParamLength
    },
    getNodeByName: (state: MainVuexState) => (
      nodeType: string,
      nodeName: string
    ) => {
      for (let i = 0; i < state.nodeTypeIds[nodeType].length; i++) {
        if (state.nodeIDToNodeObjectMap[state.nodeTypeIds[i]].name == nodeName)
          return state.nodeIDToNodeObjectMap[state.nodeTypeIds[i]]
      }
      return undefined
    },
    getNodeIDToNodeObjectMap(state: MainVuexState): Object {
      return state.nodeIDToNodeObjectMap
    },
    getNodeTypeIds(state: MainVuexState): Object {
      return state.nodeTypeIds
    },
    getIDCounter(state: MainVuexState): number {
      return state.idCounter
    },
    getOpenNodeIds(state: MainVuexState): Array<number> {
      //console.log('openNodeIds FIRED')
      //console.log('openNodeIds:' + state.openNodeIds)
      //sleep(2000).then(() => {
      //have a little delay to avoid race condition
      //console.log('DELAY CALLED')
      return state.openNodeIds
      //})
    },
    getForcedOpenNodeIds(state: MainVuexState): Array<number> {
      return state.forcedOpenNodeIds
    },
    getForcedActiveNodeId(state: MainVuexState): number {
      return state.forcedActiveNodeId
    },
    getOpenNodeIdsLength(state: MainVuexState): number {
      //console.log('openNodeIds.length FIRED')
      //console.log('openNodeIds:' + state.openNodeIds)
      return state.openNodeIds.length
    },
    getOpenFileContent(state: MainVuexState): string {
      //console.log('GET OPEN FILE CONTENT: ' + state.getOpenFileContent)
      return state.openFileContent
    },
    getSavedFileContent(state: MainVuexState): string {
      return state.savedFileContent
    },
    getDarkMode(state: MainVuexState): boolean {
      return state.darkMode
    },
    getSnackBarOpen(state: MainVuexState): boolean {
      return state.snackBarOpen
    },
    getSnackBarText(state: MainVuexState): string {
      return state.snackBarText
    },
    getSnackBarColor(state: MainVuexState): string {
      //console.log('SNACKBAR COLOR: ' + state.snackBarColor)
      return state.snackBarColor
    },
    getSelectedNodeSnippetText(state: MainVuexState): string {
      //console.log('SELECTED NODE: ' + state.selectedNodeType)
      if (state.selectedNodeType == 'sequences') {
        return SnippetCreator.getSequenceSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      } else if (state.selectedNodeType == 'tasks') {
        return SnippetCreator.getTaskSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      } else if (state.selectedNodeType == 'paths') {
        return SnippetCreator.getPathSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      } else if (state.selectedNodeType == 'modules') {
        return SnippetCreator.getModuleSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].ctype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].pytype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      } else if (state.selectedNodeType == 'pset') {
        return SnippetCreator.getPSetSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      } else if (state.selectedNodeType == 'esproducers') {
        return SnippetCreator.getESProducerSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].ctype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].pytype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      } else if (state.selectedNodeType == 'essources') {
        return SnippetCreator.getESSourceSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].ctype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].pytype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      } else if (state.selectedNodeType == 'services') {
        return SnippetCreator.getServiceSnippet(
          state.selectedNodeName,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].ctype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].pytype,
          state.nodeIDToNodeObjectMap[state.selectedNodeId].children as Array<
            NodeObject
          >
        )
      }
      return ''
    },
    getSequencesContainingCurrentNode(state: MainVuexState): Object {
      let sequencesContainingNode = {}

      let references =
        state.nodeIDToNodeObjectMap[state.selectedNodeId].referencedByIds
      //console.log('REFERENCES: ' + references)
      for (let i = 0; i < references.length; i++) {
        let referenceParentId =
          state.nodeIDToNodeObjectMap[references[i]].parentNodeId
        /*     console.log(
          'REFERENCE TYPE: ' +
            state.nodeIDToNodeObjectMap[referenceParentId].type
        ) */
        if (state.nodeIDToNodeObjectMap[referenceParentId].type == 'sequences')
          sequencesContainingNode[
            state.nodeIDToNodeObjectMap[referenceParentId].id
          ] = state.nodeIDToNodeObjectMap[referenceParentId].name
      }
      /*   console.log(
        'sequencesContainingNode' + JSON.stringify(sequencesContainingNode)
      ) */
      return sequencesContainingNode
    },
    getDirectPathsContainingCurrentNode(state: MainVuexState): Object {
      let pathsContainingNode = {}

      let references =
        state.nodeIDToNodeObjectMap[state.selectedNodeId].referencedByIds
      //console.log('REFERENCES: ' + references)
      for (let i = 0; i < references.length; i++) {
        let referenceParentId =
          state.nodeIDToNodeObjectMap[references[i]].parentNodeId
        /*     console.log(
        'REFERENCE TYPE: ' +
          state.nodeIDToNodeObjectMap[referenceParentId].type
      ) */
        if (state.nodeIDToNodeObjectMap[referenceParentId].type == 'paths')
          pathsContainingNode[
            state.nodeIDToNodeObjectMap[referenceParentId].id
          ] = state.nodeIDToNodeObjectMap[referenceParentId].name
      }
      return pathsContainingNode
    },
    getPathsContainingCurrentNode(state: MainVuexState, getters) {
      let pathsContainingNode = {}
      let sequencesContainingNode = {}
      let pathsContianingSequence = {}

      pathsContainingNode = getters.getDirectPathsContainingCurrentNode
      /*       console.log(
        'PATHS CONTAINING MODULE: ' + JSON.stringify(pathsContainingNode)
      ) */

      sequencesContainingNode = getters.getSequencesContainingCurrentNode
      // eslint-disable-next-line no-unused-vars
      for (const [nodeId, nodeName] of Object.entries(
        sequencesContainingNode
      )) {
        //console.log('sequencesContainingModule[i] ' + nodeObject)
        let references = state.nodeIDToNodeObjectMap[nodeId].referencedByIds
        //console.log('REFERENCES: ' + references)
        for (let i = 0; i < references.length; i++) {
          let referenceParentId =
            state.nodeIDToNodeObjectMap[references[i]].parentNodeId
          /*     console.log(
        'REFERENCE TYPE: ' +
          state.nodeIDToNodeObjectMap[referenceParentId].type
      ) */
          if (state.nodeIDToNodeObjectMap[referenceParentId].type == 'paths')
            pathsContianingSequence[
              state.nodeIDToNodeObjectMap[referenceParentId].id
            ] = state.nodeIDToNodeObjectMap[referenceParentId].name
        }
        /*    console.log(
          'SEQUENCE PATHS: ' + JSON.stringify(pathsContianingSequence)
        ) */
        //modulePaths.push(sequencePaths)
        if (
          Object.keys(pathsContianingSequence).length != 0 && //TODO: what is this??
          pathsContianingSequence.constructor != Object
        )
          pathsContainingNode = {
            ...pathsContainingNode,
            pathsContianingSequence,
          } //TODO: test (config has to change)
      }
      //console.log('ALL MODULE PATHS: ' + JSON.stringify(pathsContainingNode))
      return pathsContainingNode
    },
    getSelectedNodeChildren(state: MainVuexState): Array<NodeObject> {
      return state.nodeIDToNodeObjectMap[state.selectedNodeId].children
    },
    getConfigLoaded(state: MainVuexState): boolean {
      //console.log('CONFIG LOADED: ' + state.configLoaded)
      return state.configLoaded
    },
    getModulesInfo(state: MainVuexState): Array<NodeBasicInfo> {
      let modulesArray: Array<NodeBasicInfo> = []
      for (let i = 0; i < state.nodeTypeIds['modules'].length; i++) {
        modulesArray.push({
          id: state.nodeIDToNodeObjectMap[state.nodeTypeIds['modules'][i]].id,
          type:
            state.nodeIDToNodeObjectMap[state.nodeTypeIds['modules'][i]].type,
          name:
            state.nodeIDToNodeObjectMap[state.nodeTypeIds['modules'][i]].name,
        })
      }
      return modulesArray
    },
  },
})
