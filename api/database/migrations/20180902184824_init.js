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
      table.integer('tmdb_id')
        .unique()
        .index()
      table.string('imdb_id')
      table.string('poster_path')
      table.string('title')
      table.string('original_title')
      table.date('release_date')
      table.string('original_language')
      table.json('spoken_languages')
      table.float('tmdb_rating')
      table.integer('tmdb_votes')
        .unsigned()
      table.float('tmdb_popularity')
      table.string('itunes_affiliate_link')

      table.timestamps(true, true)
    }),

    // Join table for movies & people
    knex.schema.createTable('movies_people', table => {
      table.increments()
      table.integer('person_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('people')
        .onDelete('CASCADE')
      table.integer('movie_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE')

      table.timestamps(true, true)
    }),

    // Join table for movies & genres
    knex.schema.createTable('movies_genres', table => {
      table.increments()
      table.integer('movie_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE')
      table.integer('genre_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('genres')
        .onDelete('CASCADE')

      table.timestamps(true, true)
    }),

    knex.schema.createTable('posters', table => {
      table.increments()
      table.integer('movie_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE')
      table.string('path')
      table.string('language')
      table.float('aspect_ratio')
      table.float('vote_average')
      table.integer('vote_count')
        .unsigned()

      table.timestamps(true, true)
    }),
  ])

exports.down = (knex, Promise) => Promise
  .all([
    knex.schema.dropTable('movies_people'),
    knex.schema.dropTable('movies_genres'),
    knex.schema.dropTable('posters'),
    knex.schema.dropTable('people'),
    knex.schema.dropTable('genres'),
    knex.schema.dropTable('movies'),
  ])
