const log = require('../log')

module.exports = (error, instance) => {
  const {
    code = undefined,
    config = {},
    response: {
      status = NaN,
      headers: { 'retry-after': retryAfter = 0 } = {},
    } = {},
    syscall = undefined,
  } = error

  const sleepAndRetry = ms => new Promise(resolve => setTimeout(resolve, ms))
    .then(() => instance.request(config))

  if (config && status === 429) {
    log.separator('/')
    log.add('    Hit TMDb rate limit    ', 'center', '*')
    log.separator('/')
    log.send('slack')

    return sleepAndRetry(retryAfter * 1000)
  }

  if (syscall === 'getaddrinfo' && code === 'ENOTFOUND') {
    log.separator('/')
    log.add('    Error: ENOTFOUND: getaddrinfo    ', 'center', '*')
    log.separator('/')
    log.send('slack')

    return sleepAndRetry(100)
  }

  return Promise.reject(error)
}
