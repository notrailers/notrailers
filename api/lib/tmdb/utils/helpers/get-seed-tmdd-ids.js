const zlib = require('zlib')

const { fetchExternalTmdbIds } = require('../requests')

// Extract .gz (TMDb file export)
const unGunzip = file => new Promise(
  (resolve, reject) => zlib
    .gunzip(file, (err, data) => (
      err ? reject(err) : resolve(data.toString())
    )),
)

// Fix up the extracted .gz
const repairJSON = damaged => (needsBrackets => `[${needsBrackets}]`)(
  damaged
    .replace(/}\n/g, '},')
    .split(',')
    .slice(0, -1)
    .join(','),
)

const opts = { responseType: 'arraybuffer' }
module.exports = ({ tmdbMovieIdsUrl }) => fetchExternalTmdbIds({ tmdbMovieIdsUrl, opts })
  .then(unGunzip)
  .then(repairJSON)
  .then(repaired => JSON.parse(repaired))
  .then(tmdbMovies => tmdbMovies
    .filter(({ adult }) => adult === false)
    .map(({ id }) => id))
