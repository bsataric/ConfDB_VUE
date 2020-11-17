import PathService from '@/services/PathService.js'

export const namespaced = true

export const state = {
  paths: [],
  pathsTotal: 0,
  path: {},
}
export const mutations = {
  ADD_PATH(state, path) {
    state.paths.push(path)
  },
  SET_PATHS(state, paths) {
    state.paths = paths
  },
  SET_PATH(state, path) {
    state.path = path
  },
}
export const actions = {
  createPath({ commit, dispatch }, path) {
    return PathService.postPath(path)
      .then(() => {
        commit('ADD_PATH', path)
        const notification = {
          type: 'success',
          message: 'Your path has been created! ',
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your path ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchPaths({ commit, dispatch }) {
    return PathService.getPaths()
      .then((response) => {
        commit('SET_PATHS', response.data)
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching paths ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  fetchPath({ commit, getters, dispatch }, id) {
    let path = getters.getPathById(id)
    if (path) {
      commit('SET_PATH', path)
    } else {
      return PathService.getPath(id)
        .then((response) => {
          commit('SET_PATH', response.data)
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching path ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
  fetchPathByName({ commit, getters, dispatch }, name) {
    let path = getters.getPathByName(name)
    if (path) {
      commit('SET_PATH', path)
    } else {
      return PathService.getPathByName(name)
        .then((response) => {
          commit('SET_PATH', response.data)
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching path ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
}
export const getters = {
  pathLength: (state) => {
    return state.paths.length
  },
  getPathById: (state) => (id) => {
    return state.paths.find((path) => path.id == id)
  },
  getPathByName: (state) => (name) => {
    //return state.paths.find((path) => path.name == name)
    for (const [key, value] of Object.entries(state.paths)) {
      console.log('KEY ' + key)
      console.log('VALUE ' + value)
      if (key == name) {
        //console.log('VALUE: ' + JSON.stringify(value))
        return value
      }
    }
  },
  getPaths: (state) => {
    return state.paths
  },
  getPathsContainingModule: (state) => (moduleName) => {
    //some logic here
    let paths = []

    for (const [key, value] of Object.entries(state.paths)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('value1: ' + value1[0])
        if (value1[0] == 'modules') {
          if (value1[1] == moduleName) paths.push(key)
        }
      }
    }
    return paths //if module is not direct part of the path (but part of the sequence etc)
  },

  getPathsContainingSequence: (state) => (sequenceName) => {
    //some logic here
    let paths = []

    for (const [key, value] of Object.entries(state.paths)) {
      //console.log('KEY: ' + JSON.stringify(key))
      //console.log('VALUE: ' + JSON.stringify(value))
      // eslint-disable-next-line no-unused-vars
      for (const [key1, value1] of Object.entries(value)) {
        //console.log('KEY1: ' + key1)
        //console.log('value1: ' + value1[0])
        if (value1[0] == 'sequences') {
          if (value1[1] == sequenceName) paths.push(key)
        }
      }
    }
    return paths
  },
}
