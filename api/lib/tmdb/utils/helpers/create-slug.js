const latinize = require('latinize')

const { select, update } = require('../queries')()

// A local set of slugs inserted; this will be used to
// avoid race-conflict nonsense.
const slugInventory = []

// Use recursion to ensure slugs stay out of conflict
const renameUntilUnique = async (slug, appendent) => {
  // Ie. slug === unique
  if (!(await select.slugExists(slug)) && !slugInventory.includes(slug)) {
    slugInventory.push(slug)
    return slug
  }

  const hasYearAndIncrementor = new RegExp(/_[0-9]{4}-[0-9]+$/g)
  const hasYear = new RegExp(/_[0-9]{4}$/g)

  if (hasYearAndIncrementor.test(slug)) {
    let [incrementor] = slug.split('-').reverse()
    incrementor = Number(incrementor) + 1
    return renameUntilUnique(
      slug
        .split('-')
        .slice(0, -1)
        .concat(incrementor)
        .join('-'),
    )
  }

  if (hasYear.test(slug)) {
    return renameUntilUnique(`${slug}-1`)
  }

  return renameUntilUnique(`${slug}_${appendent}`)
}

module.exports = async ({
  id, tmdb_id: tmdbId, title, release_date: releaseDate,
}) => {
  let slug = latinize(title)
    .replace(/'/g, '')
    .replace(/\W/g, ' ')
    .replace(/  +/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 8)
    .join(' ')
    .replace(/ /g, '-')
    .toLowerCase() || tmdbId

  const appendent = (([year]) => year || id)(
    releaseDate
      ? releaseDate.split('-')
      : [],
  )

  slug = await renameUntilUnique(slug, appendent)

  return update.slug({ tmdbId, slug })
}
