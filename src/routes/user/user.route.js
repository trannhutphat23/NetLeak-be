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
// rating film
router.post('/rating', AuthService.verifyToken, UserController.ratingFilm)
// delete rating film
router.delete('/rating', AuthService.verifyToken, UserController.deleteRatingFilm)

module.exports = router