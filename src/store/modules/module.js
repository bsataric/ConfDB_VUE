import ModuleService from '@/services/ModuleService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.ts'

export const namespaced = true

export const state = {
  modules: [], //all modules
  modulesTotal: 0,
  moduleParams: {}, //currently selected module params
  moduleName: '', //current selected module name
  moduleId: -1, //current selected module ID
  moduleParamLength: 0,
}
export const mutations = {
  ADD_MODULE(state, module) {
    state.modules.push(module)
  },
  SET_MODULES(state, modules) {
    state.modules = modules
  },
  SET_MODULE(state, payload) {
    state.moduleName = payload.name
    state.moduleId = payload.moduleId
    state.moduleParams = payload.moduleParams
    state.moduleParamLength = payload.moduleParamLength
  },
}
export const actions = {
  createModule({ commit, dispatch }, module) {
    return ModuleService.postModule(module)
      .then(() => {
        commit('ADD_MODULE', module)
        const notification = {
          type: 'success',
          message: 'Your module has been created! ',
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your module ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchModules({ commit, dispatch }, payload) {
    if (!payload.fromFile) {
      return ModuleService.getModules()
        .then((response) => {
          commit('SET_MODULES', response.data)
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching modules ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    } else {
      let modulesData = ModuleService.getModulesFromFile(payload.fileData)
      commit('SET_MODULES', modulesData)
    }
  },
  fetchModuleViaId({ commit, getters, dispatch }, payload) {
    let moduleObj = getters.getModuleById(payload.itemId)
    let moduleId = payload.itemId
    let name = moduleObj.name
    let moduleParams = moduleObj.value
    let moduleParamLength = moduleObj.paramLength
    let forceOpenNode = payload.forceOpenNode
    //console.log('fetchModuleViaId')
    //console.log('FORCE OPEN 1: ' + forceOpenNode)
    //console.log('moduleObj: ' + JSON.stringify(moduleObj))
    //console.log('moduleParams: ' + moduleParams)
    //console.log('moduleParamLength: ' + moduleParamLength)
    if (moduleParams) {
      commit(
        'SET_SELECTED_NODE_VIA_ID',
        {
          selectedNodeId: moduleId,
          forceOpenNode: forceOpenNode,
        },
        { root: true }
      )
      commit('SET_MODULE', {
        name: name,
        moduleId: moduleId,
        moduleParams: moduleParams,
        moduleParamLength: moduleParamLength,
      })
    } else {
      //this assumes that this node doesn't exist
      return ModuleService.getModuleByName(name)
        .then((response) => {
          //TODO: generate moduleId
          // let moduleId = moduleObj.moduleId
          commit(
            'SET_SELECTED_NODE_VIA_ID', //TODO: FIX
            {
              selectedNodeType: 'module',
              selectedNodeName: name,
              selectedNodeId: moduleId,
              selectedNodeParamLength: response.data.length,
            },
            { root: true }
          )
          commit('SET_MODULE', {
            name: name,
            moduleId: -1,
            moduleParams: response.data,
            selectedNodeParamLength: response.data.length,
          })
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching module ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
}
export const getters = {
  moduleLength: (state) => {
    return state.modules.length
  },
  getModuleById: (state, getters, rootState, rootGetters) => (id) => {
    let nodeIDToVuexObjectMap = rootGetters['getNodeIDToVuexObjectMap']
    let name = nodeIDToVuexObjectMap[id].name
    let paramLength = 0

    for (const [key, value] of Object.entries(state.modules)) {
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
  getModules: (state) => {
    //console.log('MODULES' + state.modules)
    return state.modules
  },
  getSelectedModuleParams: (state) => {
    //console.log('CALLED:' + state.moduleParams)
    return state.moduleParams
  },
  getSelectedModuleName: (state) => {
    return state.moduleName
  },
  getSequencesContainingCurrentModule: (
    //TODO: get contained in sequences, paths etc...
    state,
    getters,
    rootState,
    rootGetters
  ) => {
    let sequencesContainingModule = []
    sequencesContainingModule = rootGetters[
      'sequence/getSequencesContainingModule'
    ](state.moduleName)
    return sequencesContainingModule
    //this.$store.getters['path/getPathsContainingModule'](state.module.name)
  },
  getPathsContainingCurrentModule: (state, getters, rootState, rootGetters) => {
    let modulePaths = {}
    let sequencesContainingModule = []
    modulePaths = rootGetters['path/getPathsContainingModule'](state.moduleName)
    console.log('MODULE PATHS: ' + JSON.stringify(modulePaths))
    sequencesContainingModule = rootGetters[
      'sequence/getSequencesContainingModule'
    ](state.moduleName)
    /*     console.log(
      'SEQUENCES CONTAINING MODULE: ' +
        JSON.stringify(sequencesContainingModule)
    ) */
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(sequencesContainingModule)) {
      //console.log('sequencesContainingModule[i] ' + value)
      let sequencePaths = rootGetters['path/getPathsContainingSequence'](value)
      console.log('SEQUENCE PATHS: ' + JSON.stringify(sequencePaths))
      //modulePaths.push(sequencePaths)
      if (
        Object.keys(sequencePaths).length != 0 && //TODO: what is this??
        sequencePaths.constructor != Object
      )
        modulePaths = [...modulePaths, sequencePaths] //TODO: test (config has to change)
    }
    //console.log('ALL MODULE PATHS: ' + JSON.stringify(modulePaths))
    return modulePaths
    //this.$store.getters['path/getPathsContainingModule'](state.module.name)
  },
  //create snippet text here
  getSelectedModuleSnippet: (state) => {
    return SnippetCreator.getModuleSnippet(state.moduleName, state.moduleParams)
  },
}
