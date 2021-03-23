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
  getConfiguration() {
    console.log(
      'GET CONFIGURATION KEYCLOKAER: ' + JSON.stringify(globalThis.keyCloaker)
    )
    return apiClient.get('configuration')
  },
  getAllFromFile(fileData) {
    let jsonObject = JSON.parse(fileData)
    return jsonObject['configuration']
  },
  postAll(all) {
    return apiClient.post('/', all)
  },
}
