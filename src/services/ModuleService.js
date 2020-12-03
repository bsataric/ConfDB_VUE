import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
/* 
apiClient.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    console.log('AXIOS SUCCESS')
    console.log(config)
    return config
  },
  function(error) {
    // Do something with request error
    console.log('AXIOS ERROR' + error)
    return Promise.reject(error)
  }
) */

export default {
  getModules() {
    return apiClient.get('/mods')
  },
  getModulesFromFile(fileData) {
    let jsonObject = JSON.parse(fileData)
    //console.log(jsonObject['mods'])
    return jsonObject['mods']
  },
  getModule(id) {
    return apiClient.get('/mods/' + id)
  },
  getModuleByName(name) {
    return apiClient.get('/mods/' + name)
  },
  postModule(module) {
    return apiClient.post('/mods', module)
  },
}
