const knexConfig = require('config').get('database')
const knex = require('knex')

module.exports = knex(knexConfig)
