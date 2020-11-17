import SequenceService from '@/services/SequenceService.js'
import snippetCreator from '@/store/helpers/snippetCreator.js'

export const namespaced = true

export const state = {
  sequences: [],
  sequencesTotal: 0,
  sequence: {},
}
export const mutations = {
  ADD_SEQUENCE(state, sequence) {
    state.sequences.push(sequence)
  },
  SET_SEQUENCES(state, sequences) {
    state.sequences = sequences
  },
  SET_SEQUENCE(state, sequence) {
    state.sequence = sequence
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
  fetchSequences({ commit, dispatch }) {
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
  },
  fetchSequence({ commit, getters, dispatch }, id) {
    let sequence = getters.getSequenceById(id)
    if (sequence) {
      commit('SET_SEQUENCE', sequence)
    } else {
      return SequenceService.getSequence(id)
        .then((response) => {
          commit('SET_SEQUENCE', response.data)
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
  fetchSequenceByName({ commit, getters, dispatch }, name) {
    let sequence = getters.getSequenceByName(name)
    if (sequence) {
      commit('SET_SEQUENCE', sequence)
    } else {
      return SequenceService.getSequenceByName(name)
        .then((response) => {
          commit('SET_SEQUENCE', response.data)
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
  getSequenceById: (state) => (id) => {
    return state.sequences.find((sequence) => sequence.id == id)
  },
  getSequenceByName: (state) => (name) => {
    //return state.sequences.find((sequences) => sequences.name == name)
    for (const [key, value] of Object.entries(state.sequences)) {
      console.log('KEY ' + key)
      console.log('VALUE ' + value)
      if (key == name) {
        //console.log('VALUE: ' + JSON.stringify(value))
        return value
      }
    }
  },
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
  getSelectedSequenceSnippet: (state) => {
    return snippetCreator.getSequenceSnippet(state.sequence)
  },
}
