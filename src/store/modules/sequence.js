import SequenceService from '@/services/SequenceService.js'

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
    SequenceService.getSequences()
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
      SequenceService.getSequence(id)
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
}
