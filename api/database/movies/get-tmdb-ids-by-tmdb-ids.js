const knex = require('../')

module.exports = tmdbIds => knex('movies')
  .select('tmdb_id')
  .whereIn('tmdb_id', tmdbIds)
  .then(rows => rows
    .map(({ tmdb_id: id }) => id))
  .catch(console.error)
