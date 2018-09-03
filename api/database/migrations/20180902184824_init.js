exports.up = (knex, Promise) => Promise
  .all([
    knex.schema.createTable('people', table => {
      table.increments()
      table.string('name')
      table.enu('job', ['director', 'actor', 'writer'])
      table.unique(['name', 'job'])

      table.timestamps(true, true)
    }),

    knex.schema.createTable('genres', table => {
      table.increments()
      table.string('name')
        .unique()

      table.timestamps(true, true)
    }),

    knex.schema.createTable('movies', table => {
      table.increments()
      table.string('slug')
        .unique()
      table.string('tmdb_id')
        .unique()
        .index()
      table.string('imdb_id')
      table.string('poster_path')
      table.string('title')
      table.string('original_title')
      table.string('year')
      table.json('spoken_languages')
      table.string('tmdb_rating')
      table.string('tmdb_votes')
      table.string('tmdb_popularity')
      table.string('letterboxd_rating')

      table.timestamps(true, true)
    }),

    // Join table for movies & people
    knex.schema.createTable('movies_people', table => {
      table.increments()
      table.integer('person_id')
        .unsigned()
        .references('id')
        .inTable('people')
      table.integer('movie_id')
        .unsigned()
        .references('id')
        .inTable('movies')

      table.timestamps(true, true)
    }),

    // Join table for movies & genres
    knex.schema.createTable('movies_genres', table => {
      table.increments()
      table.integer('movie_id')
        .unsigned()
        .references('id')
        .inTable('movies')
      table.integer('genre_id')
        .unsigned()
        .references('id')
        .inTable('genres')

      table.timestamps(true, true)
    }),
  ])

exports.down = (knex, Promise) => Promise
  .all([
    knex.schema.dropTable('movies_people'),
    knex.schema.dropTable('movies_genres'),
    knex.schema.dropTable('people'),
    knex.schema.dropTable('genres'),
    knex.schema.dropTable('movies'),
  ])
