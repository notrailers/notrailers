const knex = require('../../../database')

exports.findMoviesByTmdbId = tmdbIds => knex('movies')
  .select([
    'movies.*',
    knex.raw('JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(\'job\', people.job, \'name\', people.name)) AS credits'),
    knex.raw('JSON_AGG(DISTINCT genres.name) AS genres'),
    knex.raw('JSON_AGG(DISTINCT to_jsonb(posters) - \'id\' - \'movie_id\' - \'vote_count\') AS posters'),
  ])
  .whereIn('movies.tmdb_id', tmdbIds)
  .leftJoin('movies_people', 'movies.id', 'movies_people.movie_id')
  .leftJoin('people', 'movies_people.person_id', 'people.id')
  .leftJoin('movies_genres', 'movies.id', 'movies_genres.movie_id')
  .leftJoin('genres', 'movies_genres.genre_id', 'genres.id')
  .leftJoin('posters', 'movies.id', 'posters.movie_id')
  .groupBy('movies.id')
  .catch(console.error)
