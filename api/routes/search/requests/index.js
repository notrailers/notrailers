const config = require('config')
const get = require('../../../utils/get')

const buildTmdbURL = config.get('tmdbAPI.buildURL')

exports.searchTmdb = (q, p = 1) => get(
  `${buildTmdbURL('/search/movie')}&language=en-US&query=${q}&page=${p}&include_adult=false`,
)
