const { Service } = require('axios-middleware')
const instance = require('./config')

const service = new Service(instance)

const handleResponseError = require('./handle-response-error')

service.register({
  onResponse(response) {
    try {
      return JSON.parse(response.data)
    } catch (err) {
      return response.data
    }
  },
  onResponseError(error) {
    return handleResponseError(error, instance)
  },
})

module.exports = instance
