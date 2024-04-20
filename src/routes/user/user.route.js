const express = require('express')
const AuthService = require('../../services/auth.service')
const UserController = require('../../controllers/user.controller')
const router = express.Router()

// list all users
router.get('/listAllUsers', AuthService.verifyToken, UserController.listAllUsers)
// update password
router.patch('/updatePassword', AuthService.verifyToken, UserController.updatePassword)
// filter film by genre
router.get('/films', AuthService.verifyToken, UserController.getFilmsByGenres)

module.exports = router