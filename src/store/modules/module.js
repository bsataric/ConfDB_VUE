import ModuleService from '@/services/ModuleService.js'

export const namespaced = true

export const state = {
  modules: [],
  modulesTotal: 0,
  module: {},
}
export const mutations = {
  ADD_MODULE(state, module) {
    state.modules.push(module)
  },
  SET_MODULES(state, modules) {
    state.modules = modules
  },
  SET_MODULE(state, module) {
    state.module = module
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
    ModuleService.getModules()
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
    let module = getters.getModuleById(id)
    if (module) {
      commit('SET_MODULE', module)
    } else {
      ModuleService.getModule(id)
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
}
export const getters = {
  moduleLength: (state) => {
    return state.modules.length
  },
  getModuleById: (state) => (id) => {
    return state.modules.find((module) => module.id == id)
  },
}
