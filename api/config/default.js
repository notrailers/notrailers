require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

// For server initMessage
const ip = require('ip')
const { version } = require('../package.json')

// For database/knex
const knexConfig = require('../knexfile')[env]

module.exports = {
  env,
  ip: ip.address(),
  port: 4000,
  version,
  tmdbApiKey: process.env.TMDB_API_KEY,
  database: {
    ...knexConfig,
  },
}
