const knex = require('../../database')

module.exports = ({
  err,
  movie: {
    slug,
    ...rest
  },
}) => (
  err.constraint === 'movies_slug_unique'
    ? (
      knex('movies')
        .insert({
          slug: `${slug}_${rest.year.split('-')[0]}`,
          ...rest,
        }, ['id', 'tmdb_id'])
        .then(([ids]) => ids)
        .catch(({ constraint }) => (
          constraint === 'movies_slug_unique'
            ? (
              (currentSlug => (
                new RegExp(/[0-9]{4}-[0-9]+/g).test(currentSlug)
                  ? (
                    knex('movies')
                      .insert({
                        slug: `${currentSlug.split('-').slice(0, -1).join('-')}-${Number(currentSlug.split('-').reverse()[0]) + 1}`,
                        ...rest,
                      }, ['id', 'tmdb_id'])
                      .then(([ids]) => ids)
                      .catch(console.error)
                  ) : (
                    knex('movies')
                      .insert({
                        slug: `${slug}_${rest.year.split('-')[0]}-2`,
                        ...rest,
                      }, ['id', 'tmdb_id'])
                      .then(([ids]) => ids)
                      .catch(console.error)
                  )
              ))(
                knex('movies')
                  .select('slug')
                  .where('slug', '~*', `${slug}_${rest.year.split('-')[0]}`)
                  .orderBy('created_at', 'desc')
                  .then(([{ slug: s }]) => s),
              )
            ) : (
              console.error('Error during second pass of slug conflict', err)
            )
        ))
    ) : (
      console.error('Error unrelated to slug conflict resolution', err)
    )
)
