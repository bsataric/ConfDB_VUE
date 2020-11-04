import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getModules() {
    return apiClient.get('/mods')
  },
  getModule(id) {
    return apiClient.get('/mods/' + id)
  },
  postModule(module) {
    return apiClient.post('/mods', module)
  },
}
