require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

// For server initMessage
const ip = require('ip')
const { version } = require('../package.json')

// For database/knex
const knexConfig = require('../knexfile')[env]

module.exports = {
  // NODE_ENV
  env,

  // Self-explanatory
  ip: ip.address(),

  // Port express is listening on
  port: 4000,

  // NPM version
  version,

  // TMDb-related
  tmdbAPI: {
    key: process.env.TMDB_API_KEY,
    buildURL: resource => `https://api.themoviedb.org/3${resource}?api_key=${process.env.TMDB_API_KEY}`,
  },

  // Database config (auto NODE_ENV-dependent)
  database: {
    ...knexConfig,
  },
}
