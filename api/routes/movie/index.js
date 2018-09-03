const express = require('express')

const router = express.Router()

const log = require('../../utils/log')

const { getMovieBySlug } = require('../../database/movies')

router.get('/movie/:slug', async (req, res) => {
  const {
    params: {
      slug,
    },
  } = req

  log.add(`Looking up movie by slug: ${slug}`)
  log.timer()
  const [movie] = await getMovieBySlug(slug)

  if (!movie) {
    log.add('=> nnable to locate movie in databas')
    log.send('slack')

    res
      .status(404)
      .json({
        movie: false,
      })
    return
  }

  log.add(`=> Found movie: ${movie.title} (${movie.year}`)
  log.timer('=> database query took:')
  log.send('slack')

  res.json({ movie })
})

module.exports = router
