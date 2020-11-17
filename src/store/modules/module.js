import ModuleService from '@/services/ModuleService.js'

export const namespaced = true

export const state = {
  modules: [], //all modules
  modulesTotal: 0,
  moduleParams: {}, //currently selected module params
  moduleName: '', //current selected module name
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
    state.moduleParams = payload.moduleParams
  },
}
export const actions = {
  createPath({ commit, dispatch }, module) {
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
  fetchModule({ commit, getters, dispatch }, id) {
    //not working for now
    let module = getters.getModuleById(id)
    if (module) {
      commit('SET_MODULE', module)
    } else {
      return ModuleService.getModule(id)
        .then((response) => {
          commit('SET_MODULE', response.data)
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
  fetchModuleByName({ commit, getters, dispatch }, name) {
    let moduleParams = getters.getModuleByName(name)
    if (module) {
      commit('SET_MODULE', { name: name, moduleParams: moduleParams })
    } else {
      return ModuleService.getModuleByName(name)
        .then((response) => {
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
  },
}
export const getters = {
  moduleLength: (state) => {
    return state.modules.length
  },
  getModuleById: (state) => (id) => {
    return state.modules.find((module) => module.id == id)
  },
  getModuleByName: (state) => (name) => {
    //console.log('getModuleByName ' + name)
    //return state.modules.find((module) => module.name == name)
    for (const [key, value] of Object.entries(state.modules)) {
      if (key == name) {
        //console.log('VALUE: ' + JSON.stringify(value))
        return value
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
  getSelectedModulePath: (state, getters, rootState, rootGetters) => {
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
}
