import ModuleService from '@/services/ModuleService.js'
import SnippetCreator from '@/store/helpers/SnippetCreator.js'

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
  fetchModules({ commit, dispatch }) {
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
  },
  fetchModuleAndModuleId({ commit, getters, dispatch }, name) {
    let moduleObj = getters.getModuleAndModuleId(name)
    let moduleParams = moduleObj.value
    let moduleId = moduleObj.moduleId
    let moduleParamLength = moduleParams.length
    //console.log('moduleObj: ' + JSON.stringify(moduleObj))
    //console.log('moduleId: ' + moduleId)
    console.log('moduleParamLength: ' + Object.entries(moduleParams).length) //TODO FIX THIS
    if (moduleParams) {
      commit(
        'SET_SELECTED_NODE',
        {
          selectedNodeType: 'module',
          selectedNodeName: name,
          selectedNodeId: moduleId,
          selectedNodeParamLength: moduleParamLength,
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
      return ModuleService.getModuleByName(name)
        .then((response) => {
          //TODO: generate moduleId
          // let moduleId = moduleObj.moduleId
          commit(
            'SET_SELECTED_NODE',
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
  /*   fetchModuleByName({ commit, getters, dispatch }, name) {
    let moduleParams = getters.getModuleByName(name)
    if (moduleParams) {
      commit('SET_SELECTED_NODE_TYPE', 'module', { root: true })
      commit('SET_SELECTED_NODE_NAME', name, { root: true })
      commit('SET_MODULE', { name: name, moduleParams: moduleParams })
    } else {
      //this is hardly executed ever... it's like a backup
      return ModuleService.getModuleByName(name)
        .then((response) => {
          commit('SET_SELECTED_NODE_TYPE', 'module', { root: true })
          commit('SET_SELECTED_NODE_NAME', name, { root: true })
          commit('SET_MODULE', { name: name, moduleParams: response.data })
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching module ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  }, */
}
export const getters = {
  moduleLength: (state) => {
    return state.modules.length
  },
  getModuleAndModuleId: (state, getters, rootState, rootGetters) => (name) => {
    let nodeNameIdMap = rootGetters['getNodeNameIdMap']
    let moduleId = nodeNameIdMap['module.' + name]

    for (const [key, value] of Object.entries(state.modules)) {
      //console.log('KEY ' + key)
      //console.log('VALUE ' + value)
      if (key == name) {
        //console.log('VALUE: ' + JSON.stringify(value))
        return { value, moduleId }
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
  getSelectedModuleSequences: (state, getters, rootState, rootGetters) => {
    let sequencesContainingModule = []
    sequencesContainingModule = rootGetters[
      'sequence/getSequencesContainingModule'
    ](state.moduleName)
    return sequencesContainingModule
    //this.$store.getters['path/getPathsContainingModule'](state.module.name)
  },
  getSelectedModulePaths: (state, getters, rootState, rootGetters) => {
    let modulePaths = []
    let sequencesContainingModule = []
    modulePaths = rootGetters['path/getPathsContainingModule'](state.moduleName)
    sequencesContainingModule = rootGetters[
      'sequence/getSequencesContainingModule'
    ](state.moduleName)
    for (let i = 0; i < sequencesContainingModule.length; i++) {
      let sequencePath = rootGetters['path/getPathsContainingSequence'](
        sequencesContainingModule[i]
      )
      modulePaths.push(sequencePath)
    }
    return modulePaths
    //this.$store.getters['path/getPathsContainingModule'](state.module.name)
  },
  //create snippet text here
  getSelectedModuleSnippet: (state) => {
    return SnippetCreator.getModuleSnippet(state.moduleName, state.moduleParams)
  },
}
