const log = require('../log')

module.exports = (error, instance) => {
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
}
