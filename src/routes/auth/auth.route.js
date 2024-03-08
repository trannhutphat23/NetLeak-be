const express = require('express')
const AccessController = require('../../controllers/access.controller')
const router = express.Router()

// signup
router.post('/signup', AccessController.signUp)
// login
router.post('/login', AccessController.login)

module.exports = router