const moment = require('moment')
const time = require('time-ago')

const log = require('../../utils/log')
const { update } = require('./utils/log-messages')
const insertAll = require('./insert-all')
const { fetchTmdbMovies } = require('./utils/requests')
const { mapMovieKeys, transformMovieData } = require('./utils/helpers')

// Local config
const config = {
  RATE_LIMIT_IN_SECONDS: 5.5,
  MAX_NUMBER_OF_REQUESTS_ALLOWED_PER_ITERATION: 20,
  UPDATE_MESSAGE_INTERVAL_IN_MINUTES: 5,
}

module.exports = ({ tmdbIdsNotToScrape = [], mode = 'full' } = {}) => {
  // Some closure
  let tmdbIdsInserted = []
  const baseTime = moment()
  let lastLogged = baseTime

  const next = async ({ tmdbIds: ids = [] }) => {
    log.separator('-')
    log.add('Fetching movies from TMDb', 'center')
    log.separator('-')
    // Kick off
    const start = moment()

    // These IDs are what we're going to do stuff w/ during
    // this iteration
    const currentTmdbIds = ids.slice(0, config.MAX_NUMBER_OF_REQUESTS_ALLOWED_PER_ITERATION)

    // Fetch the movie data from TMDb and then process it
    const tmdbMovies = await Promise.all(currentTmdbIds.map(fetchTmdbMovies))
      .then(movies => movies
        .map(mapMovieKeys)
        .map(transformMovieData))

    // Insert the movies and return some IDs
    const insertedTmdbIds = await insertAll({ tmdbMovies })

    // Add the IDs to the thing so we know where we are
    tmdbIdsInserted = tmdbIdsInserted.concat(insertedTmdbIds)

    // These IDs are what we're going to do stuff w/ during
    // the next iteration
    const tmdbIds = ids.slice(tmdbMovies.length)

    // A message, an update: once every
    // UPDATE_MESSAGE_INTERVAL_IN_MINUTES
    const minutesSinceLastUpdateMessage = ((moment() - lastLogged) / 1000 / 60)
    if (minutesSinceLastUpdateMessage > config.UPDATE_MESSAGE_INTERVAL_IN_MINUTES) {
      log.add(update({ baseTime, tmdbIdsInsertedLength: tmdbIdsInserted.length }))
      lastLogged = moment()
    }

    // A message, an update: once every interation
    log.detail(`Number of new TMDb IDs inserted: ${tmdbIdsInserted.length}`)
    tmdbIds.length && log.detail(`Number of TMDb IDs remaining: ${tmdbIds.length}`)

    // Stop doing it
    const took = (moment() - start) / 1000
    log.detail(`Iteration duration: ${took * 1000}ms (${took}s)`)

    // Abort recursion?
    if (tmdbIds.length === 0) {
      switch (mode) {
        case 'partial':
          return Promise.resolve({ tmdbIds: tmdbIdsInserted.concat(tmdbIdsNotToScrape) })
        case 'full':
        default:
          return Promise.resolve(true)
      }
    }

    // Continue recursion:
    // Either we take a rest because this iteration
    // finished more quickly than RATE_LIMIT_IN_SECONDS, or
    // else we move on to the next iteration w/out delay.
    if (took < config.RATE_LIMIT_IN_SECONDS) {
      // Wait for the rate-limit to cool itself
      log.detail(`Resting for: ${config.RATE_LIMIT_IN_SECONDS - took}s`)

      await new Promise(resolve => setTimeout(
        resolve,
        ((config.RATE_LIMIT_IN_SECONDS - took) * 1000),
      ))

      log.separator('-')
      log.add(`Scrape started: ${time.ago(moment() - (moment() - baseTime))}`, 'center')
      log.separator('-')
      log.send('slack')
      // And then go again
      return next({ tmdbIds })
    }
    // In case it was already cool
    log.detail('=> No rest necessary')
    log.separator('-')
    log.send('slack')

    return next({ tmdbIds })
  }

  // Instead of two anon arrow functions:
  // We need to assign the second function a name (next)
  // in order to call it recursively. This explains the
  // explicit return below.
  return next
}
