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
  getPaths() {
    return apiClient.get('/paths')
  },
  getPathsFromFile(fileData) {
    let jsonObject = JSON.parse(fileData)
    //console.log(jsonObject['mods'])
    return jsonObject['paths']
  },
  getPath(id) {
    return apiClient.get('/paths/' + id)
  },
  getPathByName(name) {
    return apiClient.get('/paths/' + name)
  },
  postPath(path) {
    return apiClient.post('/paths', path)
  },
}
