const express = require('express')
const AccessController = require('../../controllers/access.controller')
const AuthController = require('../../controllers/auth.controller')
const router = express.Router()

// signup
router.post('/signup', AccessController.signUp)
// login
router.post('/login', AccessController.login)
// refresh token
router.post('/refreshToken', AuthController.handleRefreshToken)

module.exports = router