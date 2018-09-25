module.exports = knex => ({
  posters: ({
    movieId, posters,
  }) => knex('posters')
    .insert(
      posters
        .map(poster => ({ movie_id: movieId, ...poster })),
      'id',
    )
    .then(ids => ids
      .map(({ id }) => id))
    .catch(console.error),

  // Inserts or does nothing
  onConflictDoNothing: ({
    table = '', rows = [], transform = item => item,
  }) => knex.raw('? ON CONFLICT DO NOTHING', [
    knex(table)
      .insert(rows
        .map(transform)),
  ])
    .catch(console.error),

  // Inserts rows for join tables
  join: ({
    movieId, otherIds, otherName: { singular, plural },
  }) => Promise.all(
    otherIds
      .map(otherId => ({
        [`${singular}_id`]: otherId,
        movie_id: movieId,
      }))
      .map(moviesPlusOtherIds => knex(`movies_${plural}`)
        .insert(moviesPlusOtherIds, 'id')
        .then(ids => ids
          .map(({ id }) => id))
        .catch(console.error)),
  ),
})
