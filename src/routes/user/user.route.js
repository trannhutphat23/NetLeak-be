const express = require('express')
const AuthService = require('../../services/auth.service')
const UserController = require('../../controllers/user.controller')
const router = express.Router()

// list all users
router.get('/listAllUsers', AuthService.verifyToken, UserController.listAllUsers)
// update password
router.patch('/updatePassword', AuthService.verifyToken, UserController.updatePassword)
// update account user by id
router.patch('/update/account/:id', AuthService.verifyToken, UserController.updateAccount)
// filter film by genre
router.get('/films', AuthService.verifyToken, UserController.getFilmsByGenres)
// rating film
router.post('/rating', AuthService.verifyToken, UserController.ratingFilm)
// delete rating film
router.delete('/rating', AuthService.verifyToken, UserController.deleteRatingFilm)
// save film
router.post('/save', AuthService.verifyToken, UserController.saveFilm)
// get film in savedFilm by user_id
router.get('/savedFilm/:id', AuthService.verifyToken, UserController.getSavedFilm)
// unsave film
router.delete('/unsaved', AuthService.verifyToken, UserController.unsaveFilm)
// get favorite film
router.get('/favorite', AuthService.verifyToken, UserController.getFavoriteFilm)
// add favorite film
router.post('/favorite', AuthService.verifyToken, UserController.addFavoriteFilm)
// delete favorite film
router.delete('/favorite', AuthService.verifyToken, UserController.deleteFavoriteFilm)


module.exports = router