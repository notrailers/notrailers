const getTmdbIdsByTmdbIds = require('./get-tmdb-ids-by-tmdb-ids')
const getMoviesByTmdbIds = require('./get-movies-by-tmdb-ids')

const insert = require('./insert')
const insertMoviesAndOthers = require('./insert-movies-and-others')

module.exports = {
  getTmdbIdsByTmdbIds,
  getMoviesByTmdbIds,
  insert,
  insertMoviesAndOthers,
}
