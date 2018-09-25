const config = require('config')
const get = require('../../../../utils/get')

const buildTmdbURL = config.get('tmdbAPI.buildURL')

// Fetch TMDb movie IDs export (for seeding)
exports.fetchExternalTmdbIds = ({ tmdbMovieIdsUrl, opts }) => get(tmdbMovieIdsUrl, opts)

// Get movie data (+ credits & images) by TMDb ID
exports.fetchTmdbMovies = tmdbId => get(
  `${buildTmdbURL(`/movie/${tmdbId}`)}&append_to_response=credits,images`,
)
