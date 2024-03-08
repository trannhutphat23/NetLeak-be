const express = require('express')
const router = express.Router()

// auth
router.use('/v1/api', require('./auth/auth.route'))

// user
router.use('/v1/api/user', require('./user/user.route'))

module.exports = router