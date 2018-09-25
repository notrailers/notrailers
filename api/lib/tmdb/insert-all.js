const log = require('../../utils/log')
const knex = require('../../database')

const queries = require('./utils/queries')
const { createSlug } = require('./utils/helpers')

module.exports = ({ tmdbMovies }) => Promise.all(
  tmdbMovies
    .map(({
      credits: people, genres, posters, ...movie
    }) => knex
      .transaction(tx => (query => tx('movies')
        .insert(movie, 'id')
        .then(([movieId]) => (
          genres.length
            ? (
              query.insert.onConflictDoNothing({
                table: 'genres', rows: genres, transform: genre => ({ name: genre }),
              }).then(() => query.select.genreIds(genres))
                .then(genreIds => ({ movieId, genreIds }))
            ) : ({
              movieId, genreIds: [],
            })
        ))
        .then(({ movieId, genreIds }) => (
          people.length
            ? (
              query.insert.onConflictDoNothing({
                table: 'people', rows: people,
              }).then(() => query.select.peopleIds(people))
                .then(peopleIds => ({ movieId, genreIds, peopleIds }))
            ) : ({
              movieId, genreIds, peopleIds: [],
            })
        ))
        .then(({ movieId, genreIds, ...rest }) => (
          genreIds.length
            ? (
              query.insert.join({
                movieId, otherIds: genreIds, otherName: { singular: 'genre', plural: 'genres' },
              }).then(moviesGenresIds => ({
                movieId, genreIds, moviesGenresIds, ...rest,
              }))
            ) : ({
              movieId, genreIds, moviesGenresIds: [], ...rest,
            })
        ))
        .then(({ movieId, peopleIds, ...rest }) => (
          peopleIds.length
            ? (
              query.insert.join({
                movieId, otherIds: peopleIds, otherName: { singular: 'person', plural: 'people' },
              }).then(moviesPeopleIds => ({
                movieId, peopleIds, moviesPeopleIds, ...rest,
              }))
            ) : ({
              movieId, peopleIds, moviesPeopleIds: [], ...rest,
            })
        ))
        .then(({ movieId, ...rest }) => (
          posters.length
            ? (
              query.insert.posters({ movieId, posters })
                .then(posterIds => ({
                  movieId, posterIds, ...rest,
                }))
            ) : ({
              movieId, posterIds: [], ...rest,
            })
        )))(queries(tx)))
      .then(() => createSlug(movie))
      .then(() => movie.tmdb_id)
      .catch(err => {
        log.add(`knex.js: Main Insertion Transaction: ${err}`)
        log.send('slack')
      })),
).catch(console.error)
