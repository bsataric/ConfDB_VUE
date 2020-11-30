import PSetService from '@/services/PSetService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.js'

export const namespaced = true

export const state = {
  psets: [],
  psetsTotal: 0,
  psetParams: {}, //currently selected pset params
  psetName: '', //current selected pset name
  psetId: -1, //current selected pset ID
  psetParamLength: 0,
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
    state.psetId = payload.psetId
    state.psetParams = payload.psetParams
    state.psetParamLength = payload.psetParamLength
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
  fetchPSetAndPSetId({ commit, getters, dispatch }, name) {
    let psetObj = getters.getPSetAndPSetId(name)
    let psetParams = psetObj.value
    let psetId = psetObj.pathId
    let psetParamLength = psetParams.length
    //console.log('psetObj: ' + JSON.stringify(psetObj))
    //console.log('psetId: ' + psetId)
    //console.log('psetParams' + psetParams)

    if (psetParams) {
      commit(
        'SET_SELECTED_NODE',
        {
          selectedNodeType: 'pset',
          selectedNodeName: name,
          selectedNodeId: psetId,
          selectedNodeParamLength: psetParamLength,
        },
        { root: true }
      )
      commit('SET_PSET', {
        name: name,
        psetId: psetId,
        psetParams: psetParams,
        psetParamLength: psetParamLength,
      })
    } else {
      return PSetService.getPSetByName(name)
        .then((response) => {
          //TODO: generate psetId
          // let psetId = psetObj.psetId
          commit(
            'SET_SELECTED_NODE',
            {
              selectedNodeType: 'pset',
              selectedNodeName: name,
              selectedNodeId: psetId,
              selectedNodeParamLength: response.data.length,
            },
            { root: true }
          )
          commit('SET_PSET', {
            name: name,
            psetId: -1,
            pathParams: response.data,
            selectedNodeParamLength: response.data.length,
          })
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
  /*  fetchPSetByName({ commit, getters, dispatch }, name) {
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
  }, */
}
export const getters = {
  psetLength: (state) => {
    return state.psets.length
  },
  getPSetAndPSetId: (state, getters, rootState, rootGetters) => (name) => {
    let nodeNameIdMap = rootGetters['getNodeNameIdMap']
    let psetId = nodeNameIdMap['pset.' + name]

    for (const [key, value] of Object.entries(state.psets)) {
      //console.log('KEY ' + key)
      //console.log('VALUE ' + value)
      if (key == name) {
        //console.log('VALUE: ' + JSON.stringify(value))
        return { value, psetId }
      }
    }
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
