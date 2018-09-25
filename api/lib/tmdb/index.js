const moment = require('moment')
const difference = require('lodash.difference')

const log = require('../../utils/log')

const initScrape = require('./scrape')

const { getSeedTmdbIds } = require('./utils/helpers')
const { select } = require('./utils/queries')()

module.exports = {
  scrape: async (inputTmdbIds = undefined) => {
    log.add('  Initializing fetch from TMDb  ', 'center')
    log.separator('-')

    const localTmdbIds = await select.tmdbIds()

    const tmdbIdsToScrape = difference(inputTmdbIds, localTmdbIds)

    if (tmdbIdsToScrape.length === 0) {
      log.detail('All TMDb IDs already indexed in database')
      return { mode: 'partial', success: true, tmdbIds: inputTmdbIds }
    }

    log.detail(`TMDb IDs: [${inputTmdbIds.slice(0, 3).join(', ')} ...]`)

    const scrape = initScrape({
      tmdbIdsNotToScrape: difference(inputTmdbIds, tmdbIdsToScrape),
      mode: 'partial',
    })

    return scrape({ tmdbIds: tmdbIdsToScrape })
  },
  seed: async () => {
    log.add('Initillizing fetch from TMDb export file', 'center')
    log.separator('-')

    const localTmdbIds = await select.tmdbIds()

    const tmdbMovieIdsUrl = (date => `http://files.tmdb.org/p/exports/movie_ids_${date}.json.gz`)(
      moment().subtract(9, 'hours').format('MM_DD_YYYY'),
    )
    const externalTmdbIds = await getSeedTmdbIds({ tmdbMovieIdsUrl })

    log.add('Info:')
    log.detail(`Number of IDs found: ${externalTmdbIds.length}`)

    const tmdbIdsToScrape = difference(externalTmdbIds, localTmdbIds)
    if (tmdbIdsToScrape.length === 0) {
      return { success: true }
    }
    log.detail(`Number of IDs not already indexed: ${tmdbIdsToScrape.length}`)
    return initScrape()({ tmdbIds: tmdbIdsToScrape })
  },
}
