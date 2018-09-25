const knex = require('../../../../database')

const select = require('./select')
const insert = require('./insert')
const update = require('./update')

module.exports = (tx = knex) => ({
  select: select(tx),
  insert: insert(tx),
  update: update(tx),
})
