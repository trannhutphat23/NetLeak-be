const express = require('express')
const AuthService = require('../../services/auth.service')
const UserController = require('../../controllers/user.controller')
const router = express.Router()

// list all users
router.get('/listAllUsers', AuthService.verifyToken, UserController.listAllUsers)
// update password
router.patch('/updatePassword', AuthService.verifyToken, UserController.updatePassword)

// list film
// router.get('/movies', AuthService.verifyToken, UserController.getMovies)
router.get('/movies', UserController.getMovies)

// get film by id
router.get('/movies/:id', AuthService.verifyToken, UserController.getMovie)

module.exports = router