const express = require('express')
const AccessController = require('../../controllers/access.controller')
const AuthService = require('../../services/auth.service')
const AuthController = require('../../controllers/auth.controller')
const router = express.Router()

// signup
router.post('/signup', AccessController.signUp)
// login
router.post('/login', AccessController.login)
// refresh token
router.post('/refreshToken', AuthController.handleRefreshToken)
// logout
router.post('/logout', AccessController.logout)

module.exports = router