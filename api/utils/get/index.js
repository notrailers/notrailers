const { Service } = require('axios-middleware')
const instance = require('./config')

const service = new Service(instance)

const hanleResponseError = require('./handle-response-error')

service.register({
  onResponse(response) {
    return JSON.parse(response.data)
  },
  onResponseError(error) {
    return hanleResponseError(error, instance)
  },
})

module.exports = instance
