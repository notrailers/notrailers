const knex = require('../')

module.exports = movies => movies
  .map(({ credits }) => (
    credits.length !== 0
      ? (
        knex
          .raw('? ON CONFLICT DO NOTHING', [
            knex('people').insert(credits),
          ])
          .then(() => Promise
            .all(
              credits
                .map(({ name, job }) => knex('people')
                  .select('id')
                  .where('name', name)
                  .andWhere('job', job)
                  .then(personIds => personIds
                    .map(({ id }) => id)
                    .join())
                  .catch(console.error)),
            ))
          .catch(console.error)
      ) : (
        []
      )
  ))
