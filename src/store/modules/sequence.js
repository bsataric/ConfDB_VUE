import SequenceService from '@/services/SequenceService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.js'

export const namespaced = true

export const state = {
  sequences: [],
  sequencesTotal: 0,
  sequenceParams: {},
  sequenceName: '',
  sequenceId: -1, //current selected module ID
  sequenceParamLength: 0,
}
export const mutations = {
  ADD_SEQUENCE(state, sequence) {
    state.sequences.push(sequence)
  },
  SET_SEQUENCES(state, sequences) {
    state.sequences = sequences
  },
  SET_SEQUENCE(state, payload) {
    state.sequenceName = payload.name
    state.sequenceId = payload.sequenceId
    state.sequenceParams = payload.sequenceParams
    state.sequenceParamLength = payload.sequenceParamLength
  },
}
export const actions = {
  createSequence({ commit, dispatch }, sequence) {
    return SequenceService.postSequence(sequence)
      .then(() => {
        commit('ADD_SEQUENCE', sequence)
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
  },
  fetchSequences({ commit, dispatch }, payload) {
    if (!payload.fromFile) {
      return SequenceService.getSequences()
        .then((response) => {
          commit('SET_SEQUENCES', response.data)
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
    }
  },
  fetchSequenceAndSequenceId({ commit, dispatch, getters }, payload) {
    let sequenceObj = getters.getSequenceAndSequenceId(payload.itemName)
    let name = payload.itemName
    let sequenceParams = sequenceObj.value
    let sequenceId = sequenceObj.sequenceId
    let sequenceParamLength = sequenceObj.paramLength
    //console.log('sequenceObj: ' + JSON.stringify(sequenceObj))
    //console.log('sequenceId: ' + sequenceId)
    console.log('sequenceParamLength' + sequenceParamLength)
    if (sequenceParams) {
      commit(
        'SET_SELECTED_NODE',
        {
          selectedNodeType: 'sequence',
          selectedNodeName: name,
          selectedNodeId: sequenceId,
          selectedNodeParamLength: sequenceParamLength,
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
      return SequenceService.getSequenceByName(name)
        .then((response) => {
          //TODO: generate sequenceId
          // let sequenceId = sequenceObj.sequenceId
          commit(
            'SET_SELECTED_NODE',
            {
              selectedNodeType: 'sequence',
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
  getSequenceAndSequenceId: (state, getters, rootState, rootGetters) => (
    name
  ) => {
    let nodeNameIdMap = rootGetters['getNodeNameIdMap']
    let sequenceId = nodeNameIdMap['sequence.' + name]
    let paramLength = 0

    for (const [key, value] of Object.entries(state.sequences)) {
      /*    console.log('KEY ' + key)
      console.log('VALUE ' + value) */

      if (key == name) {
        /*    for (const [key1, value1] of Object.entries(value)) {
          console.log('key1 ' + key1)
          console.log('value1 ' + value1)
        } */
        //console.log('PARAMLENGTH: ' + Object.entries(value).length)
        paramLength = Object.entries(value).length
        return { value, sequenceId, paramLength }
      }
    }
  },
  /*   getSequenceByName: (state) => (name) => {
    //return state.sequences.find((sequences) => sequences.name == name)
    for (const [key, value] of Object.entries(state.sequences)) {
      //console.log('KEY ' + key)
      //console.log('VALUE ' + value)
      if (key == name) {
        //console.log('VALUE: ' + JSON.stringify(value))
        return value
      }
    }
  }, */
  getSequences: (state) => {
    return state.sequences
  },

  getSequencesContainingModule: (state) => (moduleName) => {
    //some logic here
    let sequences = []

    for (const [key, value] of Object.entries(state.sequences)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('value1: ' + value1[0])
        //console.log('value2: ' + value1[1])
        if (value1[0] == 'modules') {
          if (value1[1] == moduleName) sequences.push(key)
        }
      }
    }
    //console.log('getSequencesContainingModule SEQUENCES: ' + sequences)
    return sequences //if module is not direct part of the path (but part of the sequence etc)
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
