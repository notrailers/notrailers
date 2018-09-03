const knex = require('../')

module.exports = tmdbIds => knex('movies')
  .select([
    'movies.*',
    knex.raw('JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(\'job\', people.job, \'name\', people.name)) AS credits'),
    knex.raw('JSON_AGG(DISTINCT genres.name) AS genres'),
  ])
  .whereIn('movies.tmdb_id', tmdbIds)
  .join('movies_people', 'movies.id', 'movies_people.movie_id')
  .join('people', 'movies_people.person_id', 'people.id')
  .join('movies_genres', 'movies.id', 'movies_genres.movie_id')
  .join('genres', 'movies_genres.genre_id', 'genres.id')
  .groupBy('movies.id')
