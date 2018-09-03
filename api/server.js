/* eslint-disable */
const express    = require('express')
const server     = express()

const path       = require('path')
const knex       = require('./database/')

const cors       = require('cors')
const logger     = require('./middlewares/logger')

const routes     = require('./routes')
/* eslint-enable */

server
  .use(cors())
  .use(logger())
  .use(express.static(path.join(__dirname, '/public')))
  .use('/', routes)

module.exports = server
