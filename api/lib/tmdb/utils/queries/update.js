module.exports = knex => ({
  slug: ({ tmdbId, slug }) => knex('movies')
    .where({ tmdb_id: tmdbId })
    .update({ slug })
    .then(() => Promise.resolve(slug))
    .catch(console.error),
})
