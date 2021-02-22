import SequenceService from '@/services/SequenceService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.ts'

export const namespaced = true

export const state = {
  sequences: [], //JSON data from server/to save on server
  sequencesTotal: 0,
  //current selected sequence info
  sequenceParams: {},
  sequenceName: '',
  sequenceId: -1, //current selected module ID
  sequenceParamLength: 0,
}
export const mutations = {
  ADD_SEQUENCE(state, payload) {
    state.sequences[payload.sequenceName] = payload.sequenceParams
  },
  RENAME_SEQUENCE(state, payload, getters) {
    //first get the Sequence object from object map
    let oldSequenceObj = getters.getSequenceById(payload.sequenceNodeId)
    delete state.sequences[oldSequenceObj.name] //delete existing sequence object
    state.sequences[payload.newSequenceName] = oldSequenceObj.value

    //now rename sequence in sequences that contain it (assuming two levels of nesting - TODO TEST)
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(state.sequences)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        /* console.log('KEY1: ' + key1)
        console.log('value1: ' + value1[0])
        console.log('value2: ' + value1[1]) */
        if (value1[0] == 'sequences') {
          if (value1[1] == oldSequenceObj.name) {
            value1[1] = payload.newSequenceNam
          }
        }
      }
    }
    //now rename sequence in paths that contain it (dispatch path action)
  },
  SET_SEQUENCES(state, payload) {
    state.sequences = payload
  },
  SET_SEQUENCE(state, payload) {
    state.sequenceName = payload.name
    state.sequenceId = payload.sequenceId
    state.sequenceParams = payload.sequenceParams
    state.sequenceParamLength = payload.sequenceParamLength
  },
}
export const actions = {
  createSequenceOnServer({ commit, dispatch }, payload) {
    return SequenceService.postSequence(payload)
      .then(() => {
        commit('ADD_SEQUENCE', payload)
        const notification = {
          type: 'success',
          message: 'Your sequence has been created! ',
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message:
            'There was a problem creating your sequence ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  }, //actions always return promises!!!
  createSequenceLocally({ commit }, payload) {
    commit('ADD_SEQUENCE', payload)
  },
  renameSequenceLocally({ commit }, payload) {
    commit('RENAME_SEQUENCE', payload)
  },
  fetchSequences({ commit, dispatch }, payload) {
    if (!payload.fromFile) {
      return SequenceService.getSequences()
        .then((response) => {
          commit('SET_SEQUENCES', response.data)
          //console.log('SEQUENCE JSON DATA: ' + JSON.stringify(response.data))
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching sequences ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    } else {
      let sequenesData = SequenceService.getSequencesFromFile(payload.fileData)
      commit('SET_SEQUENCES', sequenesData)
      //console.log('SEQUENCE FILE DATA: ' + JSON.stringify(sequenesData))
    }
  },
  fetchSequenceViaId({ commit, dispatch, getters }, payload) {
    let sequenceObj = getters.getSequenceById(payload.itemId)
    let sequenceId = payload.itemId
    let name = sequenceObj.name
    let sequenceParams = sequenceObj.value
    let sequenceParamLength = sequenceObj.paramLength
    let forceOpenNode = payload.forceOpenNode
    //console.log('fetchSequenceViaId')
    //console.log('sequenceObj: ' + JSON.stringify(sequenceObj))
    //console.log('sequenceId: ' + sequenceId)
    //console.log('sequenceParamLength' + sequenceParamLength)
    if (sequenceParams) {
      commit(
        'SET_SELECTED_NODE_VIA_ID',
        {
          selectedNodeId: sequenceId,
          forceOpenNode: forceOpenNode,
        },
        { root: true }
      )
      //commit('SET_SELECTED_NODE_TYPE', 'sequence', { root: true })
      //commit('SET_SELECTED_NODE_NAME', name, { root: true })
      commit('SET_SEQUENCE', {
        name: name,
        sequenceId: sequenceId,
        sequenceParams: sequenceParams,
        sequenceParamLength: sequenceParamLength,
      })
    } else {
      //this assumes that this node doesn't exist
      return SequenceService.getSequenceByName(name)
        .then((response) => {
          //TODO: generate sequenceId
          // let sequenceId = sequenceObj.sequenceId
          commit(
            'SET_SELECTED_NODE_VIA_ID', //TODO: FIX
            {
              selectedNodeType: 'sequences',
              selectedNodeName: name,
              selectedNodeId: sequenceId,
              selectedNodeParamLength: response.data.length,
            },
            { root: true }
          )
          //commit('SET_SELECTED_NODE_TYPE', 'sequence', { root: true })
          //commit('SET_SELECTED_NODE_NAME', name, { root: true })
          //DUMMY
          commit('SET_SEQUENCE', {
            name: name,
            sequenceId: -1,
            sequenceParams: response.data,
            sequenceParamLength: response.data.length,
          })
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching sequence ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
}
export const getters = {
  seqLength: (state) => {
    return state.sequences.length
  },
  getSequenceById: (state, getters, rootState, rootGetters) => (id) => {
    let nodeIDToVuexObjectMap = rootGetters['getNodeIDToVuexObjectMap']
    let name = nodeIDToVuexObjectMap[id].name
    let value = state.sequences[name]
    let paramLength = state.sequences[name].length //TODO: eliminate key - value loops where possible

    return { value, name, paramLength }
  },
  getSequenceByName: (state) => (name) => {
    return state.sequences[name]
  },
  getSequences: (state) => {
    console.log('GET SEQUENCES CALLED')
    return state.sequences
  },

  getSequencesContainingModule: (state, getters, rootState, rootGetters) => (
    moduleName
  ) => {
    //some logic here
    //let sequences = []
    let sequencesIdNameMap = {} //this is reduntant but we miss ID from server
    let nodeIDToVuexObjectMap = rootGetters['getNodeIDToVuexObjectMap']

    for (const [key, value] of Object.entries(state.sequences)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        /* console.log('KEY1: ' + key1)
        console.log('value1: ' + value1[0])
        console.log('value2: ' + value1[1]) */
        if (value1[0] == 'modules') {
          if (value1[1] == moduleName) {
            /*  console.log('KEY1: ' + key1)
            console.log('value1: ' + value1[0])
            console.log('value2: ' + value1[1]) */
            //now go through main map and find IDs for the names
            for (const [key2, value2] of Object.entries(
              nodeIDToVuexObjectMap
            )) {
              if (value2.name == key && value2.itemChildrenLength != 0) {
                //sequences.push(key)
                //console.log('VALUE2: ' + JSON.stringify(value2))
                //console.log('PARAMLENGTH: ' + value2.itemChildrenLength)
                sequencesIdNameMap[key2] = key
                break
              }
            }
          }
        }
      }
    }
    //console.log('getSequencesContainingModule SEQUENCES: ' + sequences)
    return sequencesIdNameMap //if module is not direct part of the path (but part of the sequence etc)
  },
  getSequencesContainingCurrentSequence: (
    state,
    getters,
    rootState,
    rootGetters
  ) => {
    //some logic here
    //let sequences = []
    let sequencesIdNameMap = {} //this is reduntant but we miss ID from server
    let nodeIDToVuexObjectMap = rootGetters['getNodeIDToVuexObjectMap']

    for (const [key, value] of Object.entries(state.sequences)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        /* console.log('KEY1: ' + key1)
        console.log('value1: ' + value1[0])
        console.log('value2: ' + value1[1]) */
        if (value1[0] == 'sequences') {
          if (value1[1] == state.sequenceName) {
            /*  console.log('KEY1: ' + key1)
            console.log('value1: ' + value1[0])
            console.log('value2: ' + value1[1]) */
            //now go through main map and find IDs for the names
            for (const [key2, value2] of Object.entries(
              nodeIDToVuexObjectMap
            )) {
              if (value2.name == key && value2.itemChildrenLength != 0) {
                //sequences.push(key)
                //console.log('VALUE2: ' + JSON.stringify(value2))
                //console.log('PARAMLENGTH: ' + value2.itemChildrenLength)
                sequencesIdNameMap[key2] = key
                break
              }
            }
          }
        }
      }
    }
    //console.log('getSequencesContainingCurrentSequence SEQUENCES: ' + sequences)
    return sequencesIdNameMap //if sequence is not direct part of the path (but part of the sequence etc)
  },
  getPathsContainingCurrentSequence: (
    state,
    getters,
    rootState,
    rootGetters
  ) => {
    let sequencePaths = {}

    // eslint-disable-next-line no-unused-vars
    sequencePaths = rootGetters['path/getPathsContainingSequence'](
      state.sequenceName
    )
    console.log('SEQUENCE PATHS: ' + JSON.stringify(sequencePaths))

    //console.log('ALL MODULE PATHS: ' + JSON.stringify(sequencePaths))
    return sequencePaths
  },
  //create snippet text here
  // eslint-disable-next-line no-unused-vars
  getSelectedSequenceSnippet: (state) => {
    return SnippetCreator.getSequenceSnippet(
      state.sequenceName,
      state.sequenceParams
    )
  },
}
