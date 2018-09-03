const insert = require('./insert')
const insertMoviesAndOthers = require('./insert-movies-and-others')

const getMovieBySlug = require('./get-movie-by-slug')
const getMoviesByTmdbIds = require('./get-movies-by-tmdb-ids')
const getTmdbIdsByTmdbIds = require('./get-tmdb-ids-by-tmdb-ids')

module.exports = {
  insert,
  insertMoviesAndOthers,
  getMovieBySlug,
  getMoviesByTmdbIds,
  getTmdbIdsByTmdbIds,
}
