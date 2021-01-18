import PathService from '@/services/PathService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.js'

export const namespaced = true

export const state = {
  paths: [],
  pathsTotal: 0,
  pathParams: {}, //currently selected path params
  pathName: '', //current selected path name
  pathId: -1, //current selected path ID
  pathParamLength: 0,
}
export const mutations = {
  ADD_PATH(state, path) {
    state.paths.push(path)
  },
  SET_PATHS(state, paths) {
    state.paths = paths
  },
  SET_PATH(state, payload) {
    state.pathName = payload.name
    state.pathId = payload.pathId
    state.pathParams = payload.pathParams
    state.pathParamLength = payload.pathParamLength
  },
}
export const actions = {
  createPath({ commit, dispatch }, path) {
    return PathService.postPath(path)
      .then(() => {
        commit('ADD_PATH', path)
        const notification = {
          type: 'success',
          message: 'Your path has been created! ',
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your path ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchPaths({ commit, dispatch }, payload) {
    if (!payload.fromFile) {
      return PathService.getPaths()
        .then((response) => {
          commit('SET_PATHS', response.data)
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching paths ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    } else {
      let pathsData = PathService.getPathsFromFile(payload.fileData)
      commit('SET_PATHS', pathsData)
    }
  },
  fetchPathViaId({ commit, getters, dispatch }, payload) {
    let pathObj = getters.getPathById(payload.itemId)
    let pathId = payload.itemId
    let name = pathObj.name
    let pathParams = pathObj.value
    let pathParamLength = pathObj.paramLength
    let forceOpenNode = payload.forceOpenNode
    console.log('fetchPathViaId')
    //console.log('pathObj: ' + JSON.stringify(pathObj))
    //console.log('pathId: ' + pathId)
    //console.log('pathParamLength ' + pathParamLength)

    if (pathParams) {
      commit(
        'SET_SELECTED_NODE_VIA_ID',
        {
          selectedNodeId: pathId,
          forceOpenNode: forceOpenNode,
        },
        { root: true }
      )
      commit('SET_PATH', {
        name: name,
        pathId: pathId,
        pathParams: pathParams,
        pathParamLength: pathParamLength,
      })
    } else {
      //this assumes that this node doesn't exist
      return PathService.getPathByName(name)
        .then((response) => {
          //TODO: generate pathId
          // let pathId = pathObj.pathId
          commit(
            'SET_SELECTED_NODE_VIA_ID', //TODO: FIX
            {
              selectedNodeType: 'path',
              selectedNodeName: name,
              selectedNodeId: pathId,
              selectedNodeParamLength: response.data.length,
            },
            { root: true }
          )
          commit('SET_PATH', {
            name: name,
            pathId: -1,
            pathParams: response.data,
            sequenceParamLength: response.data.length,
          })
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching path ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
}
export const getters = {
  pathLength: (state) => {
    return state.paths.length
  },
  getPathById: (state, getters, rootState, rootGetters) => (id) => {
    let nodeIDToObjectMap = rootGetters['getNodeIDToObjectMap']
    let name = nodeIDToObjectMap[id].name
    let paramLength = 0

    for (const [key, value] of Object.entries(state.paths)) {
      /*    console.log('KEY ' + key)
      console.log('VALUE ' + value) */

      if (key == name) {
        /*    for (const [key1, value1] of Object.entries(value)) {
          console.log('key1 ' + key1)
          console.log('value1 ' + value1)
        } */
        //console.log('PARAMLENGTH: ' + Object.entries(value).length)
        paramLength = Object.entries(value).length
        return { value, name, paramLength }
      }
    }
  },
  /*   getPathByName: (state) => (name) => {
    //return state.paths.find((path) => path.name == name)
    for (const [key, value] of Object.entries(state.paths)) {
      //console.log('KEY ' + key)
      //console.log('VALUE ' + value)
      if (key == name) {
        for (const [key1, value1] of Object.entries(value)) {
          console.log('KEY1 ' + key1)
          console.log('VALUE1 ' + value1)
        }
        //console.log('VALUE: ' + JSON.stringify(value))
        return value
      }
    }
  }, */
  getPaths: (state) => {
    return state.paths
  },
  getPathsContainingModule: (state, getters, rootState, rootGetters) => (
    moduleName
  ) => {
    let pathsIdNameMap = {} //this is reduntant but we miss ID from server
    let nodeIDToObjectMap = rootGetters['getNodeIDToObjectMap']

    for (const [key, value] of Object.entries(state.paths)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('value1: ' + value1[0])
        if (value1[0] == 'modules') {
          if (value1[1] == moduleName) {
            //paths.push(key)
            for (const [key2, value2] of Object.entries(nodeIDToObjectMap)) {
              if (value2.name == key && value2.itemChildrenLength != 0) {
                //sequences.push(key)
                //console.log('VALUE2: ' + JSON.stringify(value2))
                //console.log('PARAMLENGTH: ' + value2.itemChildrenLength)
                pathsIdNameMap[key2] = key
                break
              }
            }
          }
        }
      }
    }
    //console.log('MODULE PATHS: ' + JSON.stringify(pathsIdNameMap))
    return pathsIdNameMap //if module is not direct part of the path (but part of the sequence etc)
  },

  getPathsContainingSequence: (state, getters, rootState, rootGetters) => (
    sequenceName
  ) => {
    //some logic here
    let pathsIdNameMap = {} //this is reduntant but we miss ID from server
    let nodeIDToObjectMap = rootGetters['getNodeIDToObjectMap']

    for (const [key, value] of Object.entries(state.paths)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('value1: ' + value1[0])
        if (value1[0] == 'sequences') {
          if (value1[1] == sequenceName) {
            //paths.push(key)
            for (const [key2, value2] of Object.entries(nodeIDToObjectMap)) {
              if (value2.name == key && value2.itemChildrenLength != 0) {
                //sequences.push(key)
                //console.log('VALUE2: ' + JSON.stringify(value2))
                //console.log('PARAMLENGTH: ' + value2.itemChildrenLength)
                pathsIdNameMap[key2] = key
                break
              }
            }
          }
        }
      }
    }
    return pathsIdNameMap
  },
  //create snippet text here
  getSelectedPathSnippet: (state) => {
    return SnippetCreator.getPathSnippet(state.pathName, state.pathParams)
  },
}
