const knex = require('../')

module.exports = (
  movies,
  mediateSlugConflict,
) => movies
  .map(({
    credits,
    genres,
    ...rest
  }) => knex('movies')
    .insert(rest, ['id', 'tmdb_id'])
    .then(([ids]) => ids)
    .catch(err => mediateSlugConflict({
      err,
      movie: rest,
    })))
