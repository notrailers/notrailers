const config = require('config')
const express = require('express')

const router = express.Router()

const difference = require('lodash.difference')
const get = require('../../utils/get')
const log = require('../../utils/log')

const movies = require('../../database/movies')
const people = require('../../database/people')
const genres = require('../../database/genres')

const mapMovieResultData = require('./map-movie-result-data')
const createSlugs = require('./create-slugs')
const processExternalMovie = require('./process-external-movie')
const mediateSlugConflict = require('./mediate-slug-conflict')

const buildTmdbURL = config.get('tmdbAPI.buildURL')

router.get('/search', async (req, res) => {
  // Assign page (p) and query (q)
  const {
    query: {
      p,
      q,
    },
  } = req

  // Fetch search fesults from TMDb by query, q
  const {
    // Keep for use later, maybe
    // page = 0,
    // totalPages = 0,
    total_results: totalResults = 0,
    results: tmdbResults = [],
  } = await get(
    `${buildTmdbURL('/search/movie')}&language=en-US&query=${q}&page=${p}&include_adult=false`,
  )

  // Duck out if there's nada
  if (totalResults === 0) {
    log.add(`0 search results found for query: ${q}`)
    log.add('=> returning []')
    log.send('slack')

    res.json({ totalResults: 0 })
    return
  }

  // Array o IDs
  const tmdbIds = tmdbResults
    .slice(0, 8)
    .map(({ id }) => String(id))

  // Fetch movies local to the db
  const localMovieTmdbIds = await movies.getTmdbIdsByTmdbIds(tmdbIds)

  // Which movies do we need to fetch?
  const missingMovieTmdbIds = difference(tmdbIds, localMovieTmdbIds)

  // None?
  if (missingMovieTmdbIds.length === 0) {
    log.add(`Results for query '${q}' already indexed in database`)
    log.add(`=> Returning ${localMovieTmdbIds.length} suggestion(s)`)

    log.timer()
    const results = await movies.getMoviesByTmdbIds(localMovieTmdbIds)
    log.timer('=> database query took:')
    log.send('slack')

    res.json({
      config: {
        totalResults,
      },
      results,
    })
    return
  }

  log.add(`Fetching movie details for search results from TMDb for query '${q}'`)
  log.add(`=> ${missingMovieTmdbIds.length} out of ${totalResults > 8 ? 8 : totalResults} results require fetching from TMDb`)

  const getTmdbMovieByID = id => get(
    `${buildTmdbURL(`/movie/${id}`)}&append_to_response=credits&include_image_language=en`,
  )

  // Fetch still-necessary movies from TMDb, and then:
  // 1. Map the object props to something more desirable
  // 2. Create slugs (naively)
  // 3. Shape the data for our purposes
  const externalMovies = await Promise
    .all(missingMovieTmdbIds.map(getTmdbMovieByID))
    .then(tmdbMovies => tmdbMovies
      .map(mapMovieResultData)
      .map(createSlugs)
      .map(processExternalMovie))
    .catch(console.error)

  // Have a go at inserting movies
  const insertedMovieIds = await Promise.all(
    movies.insert(externalMovies, mediateSlugConflict),
  )

  // Ensures that if there were any failed movie inserts, no people
  // or genres will be inserted for the corresponding TMDb IDs
  const enduringExternalMovies = externalMovies
    .filter(({ tmdb_id: tmdbId }) => insertedMovieIds
      .map(insertedMovieId => insertedMovieId && Number(insertedMovieId.tmdb_id))
      .includes(tmdbId))

  // Promises some people/genre inserts
  const peopleInsertions = people
    .insert(enduringExternalMovies)
  const genreInsertions = genres
    .insert(enduringExternalMovies)

  // Promises resolve
  const [
    insertedPeopleIds,
    insertedGenreIds,
  ] = await Promise.all([
    Promise.all(
      peopleInsertions,
    ),
    Promise.all(
      genreInsertions,
    ),
  ])

  // `insertedMovieIds` is currently structured as follows:
  //    {
  //      id: 1,
  //      tmdb_id: 329
  //    }
  //  which is not useful for what follows; map it out so
  //  we're only left with `id`
  const insertedMovieLocalIds = insertedMovieIds
    .map(({ id }) => id)

  // Promises for movies_people insertions
  const moviesGenresInsertions = movies
    .insertMoviesAndOthers({
      movieIds: insertedMovieLocalIds,
      otherIds: insertedGenreIds,
      otherName: {
        singular: 'genre',
        plural: 'genres',
      },
    })

  // Promises for movies_genres insertions
  const moviesPeopleInsertions = movies
    .insertMoviesAndOthers({
      movieIds: insertedMovieLocalIds,
      otherIds: insertedPeopleIds,
      otherName: {
        singular: 'person',
        plural: 'people',
      },
    })

  // Promises resolve again
  const [
    insertedMoviesPeopleIds,
    insertedMoviesGenreIds,
  ] = await Promise.all([
    Promise.all(moviesGenresInsertions),
    Promise.all(moviesPeopleInsertions).catch(console.error),
  ])

  // Warns when insertion arrays aren't the same length. This probably means
  // that there was an error in an insertion somewhere along the way, which
  // definitely means a more robust means of catching these scenarios must be
  // considered some more, implemented.
  if (
    (
      insertedMoviesPeopleIds.length
      + insertedMoviesGenreIds.length
      + insertedMovieIds.length
      + insertedPeopleIds.length
      + insertedGenreIds.length
    ) !== (insertedMovieIds.length * 5)
  ) {
    log.add('**********************************************')
    log.add('*** Discrepancy in insertion lengths found ***')
    log.add('**********************************************')
  }


  const insertedMovieTMDbIds = insertedMovieIds
    .map(({ tmdb_id: tmdbId }) => tmdbId)

  log.timer()
  const results = await movies.getMoviesByTmdbIds(insertedMovieTMDbIds)
  log.timer('=> database query took:')
  log.send('slack')

  res.json({
    config: {
      totalResults,
    },
    results,
  })
})

module.exports = router
