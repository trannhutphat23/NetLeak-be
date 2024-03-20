const express = require('express')
const AdminController = require('../../controllers/admin.controller')
const router = express.Router()

// list all users
router.get('/listAllUsers', AdminController.listAllUsers)

module.exports = router