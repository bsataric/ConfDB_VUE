import PSetService from '@/services/PSetService.js'

export const namespaced = true

export const state = {
  psets: [],
  psetsTotal: 0,
  pset: {},
}
export const mutations = {
  ADD_PSET(state, pset) {
    state.psets.push(pset)
  },
  SET_PSETS(state, psets) {
    state.psets = psets
  },
  SET_PSET(state, pset) {
    state.pset = pset
  },
}
export const actions = {
  createPSet({ commit, dispatch }, pset) {
    return PSetService.postPSet(pset)
      .then(() => {
        commit('ADD_PSET', pset)
        const notification = {
          type: 'success',
          message: 'Your pset has been created! ',
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your pset ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchPSets({ commit, dispatch }) {
    return PSetService.getPSets()
      .then((response) => {
        commit('SET_PSETS', response.data)
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching psets ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  fetchPSet({ commit, getters, dispatch }, id) {
    let pset = getters.getPSetById(id)
    if (pset) {
      commit('SET_PSET', pset)
    } else {
      return PSetService.getPSet(id)
        .then((response) => {
          commit('SET_PSET', response.data)
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching pset ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
  fetchPSetByName({ commit, getters, dispatch }, name) {
    let pset = getters.getPSetByName(name)
    if (pset) {
      commit('SET_PSET', pset)
    } else {
      return PSetService.getPSetByName(name)
        .then((response) => {
          commit('SET_PSET', response.data)
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching pset ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
}
export const getters = {
  psetLength: (state) => {
    return state.psets.length
  },
  getPSetById: (state) => (id) => {
    return state.psets.find((pset) => pset.id == id)
  },
  getPSetByName: (state) => (name) => {
    return state.psets.find((pset) => pset.name == name)
  },
  getPSets: (state) => {
    return state.psets
  },
}
