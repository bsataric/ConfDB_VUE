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
  getSequences() {
    return apiClient.get('/seqs')
  },
  getSequence(id) {
    return apiClient.get('/seqs/' + id)
  },
  postSequence(sequence) {
    return apiClient.post('/seqs', sequence)
  },
}
