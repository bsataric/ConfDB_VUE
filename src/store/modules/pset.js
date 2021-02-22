import PSetService from '@/services/PSetService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.ts'

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
  fetchPSets({ commit, dispatch }, payload) {
    if (!payload.fromFile) {
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
    } else {
      let psetsData = PSetService.getPSetsFromFile(payload.fileData)
      commit('SET_PSETS', psetsData)
    }
  },
  fetchPSetViaId({ commit, getters, dispatch }, payload) {
    let psetObj = getters.getPSetById(payload.itemId)
    let psetId = payload.itemId
    let name = psetObj.name
    let psetParams = psetObj.value
    let psetParamLength = psetObj.paramLength
    let forceOpenNode = payload.forceOpenNode
    //console.log('fetchPSetViaId')
    //console.log('psetObj: ' + JSON.stringify(psetObj))
    //console.log('psetId: ' + psetId)
    //console.log('psetParams' + psetParams)
    //console.log('psetParamLength: ' + psetParamLength)

    if (psetParams) {
      commit(
        'SET_SELECTED_NODE_VIA_ID',
        {
          selectedNodeId: psetId,
          forceOpenNode: forceOpenNode,
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
            'SET_SELECTED_NODE_VIA_ID', //TODO: FIX
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
}
export const getters = {
  psetLength: (state) => {
    return state.psets.length
  },
  getPSetById: (state, getters, rootState, rootGetters) => (id) => {
    let nodeIDToVuexObjectMap = rootGetters['getNodeIDToVuexObjectMap']
    let name = nodeIDToVuexObjectMap[id].name
    let paramLength = 0

    for (const [key, value] of Object.entries(state.psets)) {
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
