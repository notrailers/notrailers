const express = require('express')
const moment = require('moment')
const log = require('../../utils/log')
const { findMovieBySlug } = require('./queries')

const router = express.Router()

router.get('/movie/:slug', async (req, res) => {
  const {
    params: {
      slug,
    },
  } = req

  if (!slug) {
    log.detail(`Received bad/malformed request (slug: ${slug})`, 'center')
    log.send('slack')

    res.status(400).json({ movie: false })
    return
  }

  log.separator('=')
  log.add(`Received request for slug: ${slug}`, 'center')
  log.separator('-')

  const [movie] = await findMovieBySlug(slug)

  if (!movie) {
    log.detail('Unable to locate slug in database; returning')
    log.separator('-')
    log.send('slack')

    res.status(404).json({ movie: false })
    return
  }

  log.add(`Found movie: ${movie.title} (${moment(movie.release_date).format('YYYY-MM-DD')})`, 'center')
  log.separator('-')
  log.send('slack')

  res.json({ movie })
})

module.exports = router
