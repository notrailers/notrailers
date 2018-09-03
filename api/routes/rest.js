const express = require('express')

const router = express.Router()

router.get('/*', (req, res) => res
  .status(418)
  .json({
    error: `Unable to locate resource for ${req.path}`,
  }))

module.exports = router
