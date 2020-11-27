import PSetService from '@/services/PSetService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.js'

export const namespaced = true

export const state = {
  psets: [],
  psetsTotal: 0,
  psetParams: {}, //currently selected pset params
  psetName: '', //current selected pset name
}
export const mutations = {
  ADD_PSET(state, pset) {
    state.psets.push(pset)
  },
  SET_PSETS(state, psets) {
    state.psets = psets
  },
  SET_PSET(state, payload) {
    state.psetName = payload.name
    state.psetParams = payload.psetParams
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
  //NOT USED FOR NOW
  fetchPSetById({ commit, getters, dispatch }, id) {
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
    let psetParams = getters.getPSetByName(name)
    //console.log('GET PSET PARAMS: ' + JSON.stringify(psetParams))
    if (psetParams) {
      commit('SET_SELECTED_NODE_TYPE', 'pset', { root: true })
      commit('SET_SELECTED_NODE_NAME', name, { root: true })
      commit('SET_PSET', { name: name, psetParams: psetParams })
    } else {
      return PSetService.getPSetByName(name)
        .then((response) => {
          commit('SET_SELECTED_NODE_TYPE', 'pset', { root: true })
          commit('SET_SELECTED_NODE_NAME', name, { root: true })
          commit('SET_PSET', { name: name, psetParams: response })
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
    //return state.psets.find((pset) => pset.name == name)
    for (const [key, value] of Object.entries(state.psets)) {
      //console.log('KEY ' + key)
      //console.log('VALUE ' + value)
      if (key == name) {
        //console.log('VALUE: ' + JSON.stringify(value))
        return value
      }
    }
  },
  getPSets: (state) => {
    return state.psets
  },
  getSelectedPSetParams: (state) => {
    //console.log('CALLED:' + state.psetParams)
    return state.psetParams
  },
  getSelectedPSetName: (state) => {
    return state.psetName
  },
  //create snippet text here
  getSelectedPSetSnippet: (state) => {
    //console.log('POZVAN SAM')
    //console.log('SNIPPET CREATOR PARAMS: ' + JSON.stringify(state.psetParams))
    return SnippetCreator.getPSetSnippet(state.psetName, state.psetParams)
  },
}
