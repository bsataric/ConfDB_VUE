import EventService from '@/services/EventService.js'

export const namespaced = true

export const state = {
  events: [
    //could be Processes
    { id: 1, title: '...', organizer: '...' },
    { id: 2, title: '...', organizer: '...' },
    { id: 3, title: '...', organizer: '...' },
    { id: 4, title: '...', organizer: '...' },
  ],
  eventsTotal: 0,
  event: {},
}
export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_EVENT(state, event) {
    state.event = event
  },
}
export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit('ADD_EVENT', event)
        const notification = {
          type: 'success',
          message: 'Yout event has been created! ',
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your event ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchEvents({ commit, dispatch }) {
    //TODO: this could be fetch python processes (for the beginning) no need for paginatnion for treetable
    EventService.getEvents()
      .then((response) => {
        commit('SET_EVENTS', response.data)
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching events ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  fetchEvent({ commit, getters, dispatch }, id) {
    let event = getters.getEventById(id)
    if (event) {
      commit('SET_EVENT', event)
    } else {
      EventService.getEvent(id)
        .then((response) => {
          commit('SET_EVENT', response.data)
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching event ' + error.message,
          }
          dispatch('notification/add', notification, { root: true })
        })
    }
  },
}
export const getters = {
  catLength: (state) => {
    return state.categories.length
  },
  doneTodos: (state) => {
    return state.todos.filter((todo) => todo.done)
  },
  activeTodosCount: (state) => {
    return state.todos.filter((todo) => !todo.done).length
  },
  getEventById: (state) => (id) => {
    return state.events.find((event) => event.id == id)
  },
}
