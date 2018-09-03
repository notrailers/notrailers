const express = require('express')

const router = express.Router()

router.get('/movie/:slug', (req, res) => {
  res.json({ movie: true })
})

module.exports = router
