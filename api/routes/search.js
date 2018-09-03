const express = require('express')

const router = express.Router()

router.get('/search', (req, res) => {
  res.json({ search: true })
})

module.exports = router
