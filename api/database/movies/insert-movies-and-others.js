const knex = require('../')

module.exports = ({
  movieIds,
  otherIds,
  otherName: {
    singular,
    plural,
  },
}) => otherIds
  .map((otherIdSet, i) => otherIdSet
    .map(otherId => ({
      [`${singular}_id`]: otherId,
      movie_id: movieIds[i],
    })))
  .map(moviesOtherIds => (
    moviesOtherIds.length !== 0
      ? (
        knex(`movies_${plural}`)
          .insert(moviesOtherIds, 'id')
          .catch(console.error)
      ) : (
        []
      )))
