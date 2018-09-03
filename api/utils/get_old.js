const axios = require('axios')
const mem = require('mem')
const StatsMap = require('stats-map')

const log = require('./log')
const cache = new StatsMap()

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

instance.interceptors.response.use(null, error => {
  const {
    config,
    response: {
      status,
      headers: { 'retry-after': retryAfter },
    },
  } = error
  if (config && status === 429) {
    log.add('*=====================*')
    log.add('* Hit TMDb rate limit *')
    log.add('*=====================*')
    log.add(config)
    log.send('slack')

    return new Promise(
      resolve => setTimeout(resolve, retryAfter * 1000),
    ).then(() => instance.request(config))
  }

  return Promise.reject(error)
})

const makeRequestCreator = () => {
  let call
  return url => {
    if (call) {
      call.cancel({
        cancelled: true,
      })
    }
    call = axios.CancelToken.source()
    return instance
      .get(url, { cancelToken: call.token })
      .then(({ data }) => data)
      .catch(() => {
        console.warn(`Expediting new request (cancelling: ${url})`)
        return {
          cancelled: true,
        }
      })
  }
}

const get = makeRequestCreator()
