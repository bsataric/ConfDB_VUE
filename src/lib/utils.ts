export default {
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },
  isEmpty(obj) {
    return Object.keys(obj).length === 0
  },
}
