module.exports = knex => ({
  tmdbIds: () => knex('movies')
    .select('tmdb_id')
    .then(ids => ids
      .map(({ tmdb_id: id }) => Number(id)))
    .catch(console.error),
  genreIds: (genres = []) => knex('genres')
    .select('id')
    .whereIn('name', genres)
    .then(genreRows => genreRows
      .map(({ id }) => id))
    .catch(console.error),
  peopleIds: (people = []) => Promise
    .all(
      people.map(({ name, job }) => knex('people')
        .select('id')
        .where('name', name)
        .andWhere('job', job)
        .then(peopleRows => peopleRows
          .map(({ id }) => id)
          .join())),
    ),
  slugExists: slug => knex('movies')
    .where('slug', slug)
    .then(rows => !!rows.length)
    .catch(console.error),
})
