const express = require('express')
const log = require('../../utils/log')
const TMDb = require('../../lib/tmdb')
const { searchTmdb } = require('./requests')
const { findMoviesByTmdbId } = require('./queries')

const router = express.Router()

router.get('/search', async (req, res) => {
  // Assign page (p) and query (q)
  const {
    query: {
      p,
      q,
    },
  } = req

  if (!q) {
    log.detail(`Received bad/malformed request (query: ${q})`, 'center')
    res.status(400).json({
      meta: {
        totalResults: 0,
      },
      results: [],
    })
    return
  }

  log.separator('=')
  const truncatedQ = q.split('').slice(0, 20).join('')
  log.add(`Received request for query: '${truncatedQ}'`, 'center')
  log.separator('-')

  // Fetch search results from TMDb by query, q
  const {
    total_results: totalResults = 0,
    results: tmdbResults = [],
  } = await searchTmdb(q, p)

  // Duck out if there's nada
  if (totalResults === 0) {
    log.detail(`0 search results found for query: ${truncatedQ}...`)
    log.detail('Returning: []')
    log.separator('-')
    log.send('slack')

    res.json({
      meta: {
        totalResults: 0,
      },
      results: [],
    })
    return
  }

  // Array o IDs
  let tmdbIds = tmdbResults
    .slice(0, 8)
    .map(({ id }) => id);

  ({ tmdbIds } = await TMDb.scrape(tmdbIds))

  const results = await findMoviesByTmdbId(tmdbIds)

  log.detail(`Returning ${tmdbIds.length} movie(s):`)
  log.add(`    [${tmdbIds}]`)
  log.separator('-')
  log.send('slack')

  res.json({
    meta: {
      totalResults,
    },
    results,
  })
})

module.exports = router
