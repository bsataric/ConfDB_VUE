import Vue from 'vue'
import Vuex from 'vuex'
import { MainVuexState, NodeObject, NodeBasicInfo } from '../types'
import Utils from '@/lib/utils'
import MapToJSONParser from '@/store/helpers/MapToJSONParser'
import GlobalService from '@/services/GlobalService'
import SnippetCreator from '@/store/helpers/SnippetCreator'

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
  selectedNodeParentParentId: 0,
  //nodePreviousReferenceId: -1,
  //node ID to Object map containing all information about every node in the configuration tree
  nodeIDToNodeObjectMap: {},
  //arrays holding IDs of specific node types
  topLevelNodeTypeIds: {},
  //nested node name - array of IDs map
  nonTopLevelNodeNameIdMap: {},
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
      console.log('SET_SELECTED_NODE_VIA_ID : ' + payload.selectedNodeId)
      /*console.log(
        'SELECTED NODE ROOT ID: ' +
          state.nodeIDToNodeObjectMap[payload.selectedNodeId].rootNodeId
      ) */
      //if (state.nodePreviousReferenceId != -1) {
      //splice prefious reference from open nodes if it exists
      //}

      let referenceNode =
        payload.selectedNodeId ==
        state.nodeIDToNodeObjectMap[payload.selectedNodeId].rootNodeId
          ? false
          : true
      //console.log('state.openNodeIds: ' + state.openNodeIds)
      console.log('REFERENCE NODE: ' + referenceNode)

      /*   if (!referenceNode) */ state.selectedNodeId = payload.selectedNodeId
      /*       else
        state.selectedNodeId =
          state.nodeIDToNodeObjectMap[payload.selectedNodeId].rootNodeId */

      //get all info just via ID
      //console.log('state.selectedNodeId: ' + state.selectedNodeId)
      //console.log(typeof state.selectedNodeId)
      //override leaf nodes
      state.selectedNodeType =
        state.nodeIDToNodeObjectMap[state.selectedNodeId].type
      state.selectedNodeName =
        state.nodeIDToNodeObjectMap[state.selectedNodeId].name
      //console.log('state.selectedNodeName ' + state.selectedNodeName)
      state.selectedNodeCType =
        state.nodeIDToNodeObjectMap[state.selectedNodeId].ctype
      state.selectedNodeParamLength =
        state.nodeIDToNodeObjectMap[state.selectedNodeId].children.length

      if (!referenceNode)
        state.selectedNodeParentId =
          state.nodeIDToNodeObjectMap[state.selectedNodeId].parentNodeId
      else {
        state.selectedNodeParentId =
          state.nodeIDToNodeObjectMap[state.selectedNodeId].parentNodeId
        state.selectedNodeParentParentId =
          state.nodeIDToNodeObjectMap[state.selectedNodeParentId].parentNodeId
      }
      let forceOpenNode = payload.forceOpenNode //if node is opened by foce open it's parent as well
      let forceOpenReferenceIds = payload.forceOpenReferenceIds

      //console.log('state.selectedNodeParentId ' + state.selectedNodeParentId)
      //console.log('FORCED OPEN NODE: ' + forceOpenNode)
      let idIndex = -1
      //if (!referenceNode) {
      if (forceOpenNode) state.forcedActiveNodeId = state.selectedNodeId
      idIndex = state.openNodeIds.indexOf(state.selectedNodeId)
      //}
      //root and selected are same
      //else {
      /*    if (forceOpenNode) state.forcedActiveNodeId = payload.selectedNodeId //selected is reference, different then root
        idIndex = state.openNodeIds.indexOf(payload.selectedNodeId) */

      /*      console.log('state.forcedActiveNodeId: ' + state.forcedActiveNodeId)
          console.log('idIndex: ' + idIndex) */
      // }
      //console.log('FORCED NODE ID: ' + state.forcedActiveNodeId)

      //console.log('SELECTED NODE ID: ' + state.selectedNodeId)
      //console.log('OPEN NODES BEFORE: ' + state.openNodeIds)
      console.log('IDINDEX: ' + idIndex)

      if (idIndex == -1) {
        //console.log('OVDE USAO')
        if (forceOpenNode) {
          //if force is enwoked both node and it's parent have to be opened
          //console.log('SELECTED NODE TYPE: ' + state.selectedNodeType)

          //console.log('PARENT NODE ID: ' + state.selectedNodeParentId)
          let parentNodeIndex = state.openNodeIds.indexOf(
            state.selectedNodeParentId
          )
          let parentParentNodeIndex = -1
          if (referenceNode) {
            parentParentNodeIndex = state.openNodeIds.indexOf(
              state.selectedNodeParentParentId
            )
          }
          /*     console.log('PARENT NODE INDEX: ' + parentNodeIndex)
          console.log(
            'state.selectedNodeParentId ' + state.selectedNodeParentId
          )  */
          if (parentNodeIndex == -1) {
            //push parent node on array as well
            state.openNodeIds.push(state.selectedNodeParentId)
          }
          if (referenceNode && parentParentNodeIndex == -1) {
            //if reference push parent's parent on array as well (hopefully only 2 levels)
            state.openNodeIds.push(state.selectedNodeParentParentId)
          }
        }
        //if (!referenceNode) {
        console.log('state.openNodeIds.push ' + state.selectedNodeId)
        state.openNodeIds.push(state.selectedNodeId)
        //console.log('NON REFERENCE NODE INSERTED!')
        //console.log('state.openNodeIds: ' + state.openNodeIds)
        //} else {
        //for reference node we have to open parent of parent as well
        //state
        //state.openNodeIds.push(payload.selectedNodeId)
        //console.log('REFERENCE NODE INSERTED!')
        //console.log('state.openNodeIds: ' + state.openNodeIds)
        //}
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
        if (!forceOpenNode) {
          console.log('state.openNodeIds.splice at index ' + idIndex)
          state.openNodeIds.splice(idIndex, 1) //close the node if already open (not if forced)
        }
      }

      console.log('OPEN NODES AFTER: ' + state.openNodeIds)
      if (forceOpenNode) {
        //console.log('FORCED OPEN!')
        state.forcedOpenNodeIds = [...state.openNodeIds] //cannot assign by reference, but copy whole array
        //console.log('FORCED ARRAY: ' + state.forcedOpenNodeIds)
      }

      //state.openNodeIds = [1]
    },
    SET_SELECTED_NODE_FOCUS_VIA_ID(state: MainVuexState, payload) {},
    SET_ID_TO_NODE_OBJECT_MAP(state: MainVuexState, payload) {
      state.nodeIDToNodeObjectMap = payload
    },
    SET_TOP_LEVEL_NODE_TYPE_IDS(state: MainVuexState, payload) {
      state.topLevelNodeTypeIds = payload
    },
    SET_NON_TOP_LEVEL_NODE_NAME_ID_MAP(state: MainVuexState, payload) {
      state.nonTopLevelNodeNameIdMap = payload
    },
    CREATE_NODE_ID_TO_OBJECT_REFERENCES(state: MainVuexState) {
      //console.log('CREATING REFERENCES')
      //now pass through all the parameters of
      //console.log('MAP 1: ' + state.nodeIDToNodeObjectMap[1].globalType)
      let nodeNameArray = [
        'sequences',
        'tasks',
        'paths',
        'modules',
        'esproducers',
        'psets',
        'essources',
        'services',
      ]

      //go through all top level nodes
      for (
        let nameCounter = 0;
        nameCounter < nodeNameArray.length;
        nameCounter++
      ) {
        for (
          //go through all top level node IDs of a particular type
          let i = 0;
          i < state.topLevelNodeTypeIds[nodeNameArray[nameCounter]].length;
          i++
        ) {
          let topLevelNodeId =
            state.topLevelNodeTypeIds[nodeNameArray[nameCounter]][i]
          let topLevelNodeName =
            state.nodeIDToNodeObjectMap[topLevelNodeId].name
          //console.log('TOP LEVEL SEQUENCE: ' + topLevelNodeName)
          let referenceIds = state.nonTopLevelNodeNameIdMap[topLevelNodeName] //get all references of a node name
          if (referenceIds != undefined)
            state.nodeIDToNodeObjectMap[
              topLevelNodeId
            ].referencedByIds = referenceIds.slice() //copy all reference IDs in node map object reference IDs
          /*   if (nodeNameArray[nameCounter] == 'modules')
            console.log(
              'TOP LEVEL ' + nodeNameArray[nameCounter] + ' referenceIds: ' +
                JSON.stringify(
                  state.nodeIDToNodeObjectMap[topLevelNodeId].referencedByIds
                )
            ) */
          for (
            let j = 0;
            j <
            state.nodeIDToNodeObjectMap[topLevelNodeId].referencedByIds.length; //go through all references
            j++
          ) {
            let nonTopLevelId =
              state.nodeIDToNodeObjectMap[topLevelNodeId].referencedByIds[j] //take the id of reference
            state.nodeIDToNodeObjectMap[
              nonTopLevelId
            ].rootNodeId = topLevelNodeId //connect the root node to this reference
            /*       if (nodeNameArray[nameCounter] == 'modules')
              console.log(
                'Leaf' +
                  nodeNameArray[nameCounter] +
                  'root ID: ' +
                  state.nodeIDToNodeObjectMap[nonTopLevelId].rootNodeId
              ) */
          }
        }
      }
    },
    SET_JSON_CONFIGURATION(state: MainVuexState, payload) {
      state.JSONconfiguration = payload
      //console.log('JSON: ' + JSON.stringify(state.JSONconfiguration))
    },
    DELETE_JSON_CONFIGURATION(state: MainVuexState) {
      //delete state.JSONconfiguration
    },
    ADD_NODE(state: MainVuexState, payload) {
      /*       console.log('ADD_NODE')
      console.log(
        'payload.nodeIDToObject' + JSON.stringify(payload.nodeIDToObject)
      )
      console.log('payload.id ' + payload.nodeId)
      console.log(
        'payload.nodeIDToObject.parentNodeId ' +
          payload.nodeIDToObject.parentNodeId
      ) */

      //add new node both to children of the parent and in the main map
      state.nodeIDToNodeObjectMap[
        payload.nodeIDToObject.parentNodeId
      ].children.push(payload.nodeIDToObject)
      state.nodeIDToNodeObjectMap[payload.nodeId] = payload.nodeIDToObject
      /*      console.log('NEW NODE ID: ' + payload.nodeId)
      console.log(
        'NEW nodeIDToNodeObjectMap:' +
          JSON.stringify(state.nodeIDToNodeObjectMap[payload.nodeId])
      ) */
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
      for (const [nodeId, childNodeObject] of Object.entries(
        nodeToDelete.children as NodeObject
      )) {
        //console.log('KEY: ' + nodeId)
        //console.log('VALUE: ' + JSON.stringify(childNodeObject))
        //take rootNodeId of each child, go to that node and delete reference to this child
        let childIdToDelete = childNodeObject.id
        let rootNodeId = childNodeObject.rootNodeId
        //console.log('CHILD TO DELETE: ' + childIdToDelete)
        //console.log('ROOT NODE ID: ' + rootNodeId)
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
        for (const [key, referenceParentChildNodeObject] of Object.entries(
          state.nodeIDToNodeObjectMap[referenceParentNodeId]
            .children as NodeObject
        )) {
          //console.log('REFERENCE PARENT CHILD KEY: ' + key)
          /*      console.log(
            'REFERENCE PARENT CHILD VALUE: ' + referenceParentChildNodeObject
          ) */
          //if referenceParentChildNodeObject.id is the reference id splice that child from the parent
          if (
            referenceParentChildNodeObject.id == nodeToDelete.referencedByIds[i]
          ) {
            state.nodeIDToNodeObjectMap[referenceParentNodeId].children.splice(
              childIndex,
              1
            )
            //then we have to delete the node object from the map
            delete state.nodeIDToNodeObjectMap[
              referenceParentChildNodeObject.id
            ]
          }
          childIndex++
        }
      }
      //now we can delete the root node (first from it's parents children and then from the map)
      let parentId = nodeToDelete.parentNodeId
      console.log('PARENT ID: ' + parentId)
      let childIndex = 0
      for (const [key, parentChildNodeObject] of Object.entries(
        state.nodeIDToNodeObjectMap[parentId].children as NodeObject
      )) {
        if (parentChildNodeObject.id == nodeToDelete.id) {
          state.nodeIDToNodeObjectMap[parentId].children.splice(childIndex, 1)
          //then we have to delete the node object from the map
          delete state.nodeIDToNodeObjectMap[parentChildNodeObject.id]
          break
        }
        childIndex++
      }
    },
    INSERT_NODE_REFERENCE(state: MainVuexState, payload) {
      //we need parent node ID plus inserted node ID. Calculate the references
      //create new child node (it cannot be the same as every node needs unique ID)
      let newChildNodeObject: NodeObject = Object.assign(
        {},
        state.nodeIDToNodeObjectMap[payload.rootNodeId]
      )
      newChildNodeObject.id = state.idCounter
      newChildNodeObject.parentNodeId = payload.parentId //parent is the passed parent
      //console.log('CHILD CHILDREN BEFORE: ' + childNodeObject.children)
      newChildNodeObject.children = []
      newChildNodeObject.referencedByIds = []
      //console.log('CHILD CHILDREN AFTER: ' + childNodeObject.children)
      //add reference to root node references
      //console.log('newChildNodeObject: ' + JSON.stringify(newChildNodeObject))
      state.nodeIDToNodeObjectMap[
        newChildNodeObject.rootNodeId
      ].referencedByIds.push(newChildNodeObject.id)
      state.nodeIDToNodeObjectMap[payload.parentId].children.push(
        newChildNodeObject
      )
      //console.log('newChildNodeObject.id:' + newChildNodeObject.id)
      state.nodeIDToNodeObjectMap[newChildNodeObject.id] = newChildNodeObject
      /*  console.log(
        'state.nodeIDToNodeObjectMap[newChildNodeObject.id]: ' +
          JSON.stringify(state.nodeIDToNodeObjectMap[newChildNodeObject.id])
      ) */
      //Utils.sleep(1000)
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
      state.savedFileContent = MapToJSONParser.parseMapToJSON(
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
    createTopLevelNodeTypeIds({ commit }, payload) {
      commit('SET_TOP_LEVEL_NODE_TYPE_IDS', payload)
    },
    createNonTopLevelNodeNameIdMap({ commit }, payload) {
      commit('SET_NON_TOP_LEVEL_NODE_NAME_ID_MAP', payload)
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
    setSelectedNodeFocusViaID({ commit }, payload) {
      commit('SET_SELECTED_NODE_FOCUS_VIA_ID', payload)
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
      for (let i = 0; i < state.topLevelNodeTypeIds[nodeType].length; i++) {
        if (
          state.nodeIDToNodeObjectMap[state.topLevelNodeTypeIds[i]].name ==
          nodeName
        )
          return state.nodeIDToNodeObjectMap[state.topLevelNodeTypeIds[i]]
      }
      return undefined
    },
    getNodeIDToNodeObjectMap(state: MainVuexState): Object {
      return state.nodeIDToNodeObjectMap
    },
    getNodeTypeIds(state: MainVuexState): Object {
      return state.topLevelNodeTypeIds
    },
    getNonTopLevelNodeNameIdMap(state: MainVuexState): Object {
      return state.nonTopLevelNodeNameIdMap
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
      //console.log('SELECTED NODE: ' + state.selectedNodeName)
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
        //TODO: check what happens here with added node IDs and children
        /*         console.log('state.selectedNodeId: ' + state.selectedNodeId)
        console.log('state.selectedNodeName: ' + state.selectedNodeName)
        console.log(
          'state.nodeIDToNodeObjectMap[state.selectedNodeId].ctype: ' +
            state.nodeIDToNodeObjectMap[state.selectedNodeId].ctype
        )
        console.log(
          'state.nodeIDToNodeObjectMap[state.selectedNodeId].pytype: ' +
            state.nodeIDToNodeObjectMap[state.selectedNodeId].pytype
        )
        console.log(
          'state.nodeIDToNodeObjectMap[state.selectedNodeId].children: ' +
            state.nodeIDToNodeObjectMap[state.selectedNodeId].children
        ) */
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
      for (let i = 0; i < state.topLevelNodeTypeIds['modules'].length; i++) {
        modulesArray.push({
          id:
            state.nodeIDToNodeObjectMap[state.topLevelNodeTypeIds['modules'][i]]
              .id,
          type:
            state.nodeIDToNodeObjectMap[state.topLevelNodeTypeIds['modules'][i]]
              .type,
          name:
            state.nodeIDToNodeObjectMap[state.topLevelNodeTypeIds['modules'][i]]
              .name,
        })
      }
      return modulesArray
    },
  },
})
