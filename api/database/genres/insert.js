const knex = require('../')

module.exports = externalMovies => externalMovies
  .map(({ genres }) => (
    genres.length !== 0
      ? (
        knex
          .raw('? ON CONFLICT DO NOTHING', [
            knex('genres')
              .insert(genres
                .map(genre => ({ name: genre }))),
          ])
          .then(() => knex('genres')
            .select('id')
            .whereIn('name', genres)
            .then(ids => ids
              .map(({ id }) => id))
            .catch(console.error))
          .catch(console.error)
      ) : (
        []
      )
  ))
