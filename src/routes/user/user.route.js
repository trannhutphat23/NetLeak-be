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
// get video of film
router.get('/video',AuthService.verifyToken,UserController.getVideo)
// get detail film
router.get('/films/detailFilm', AuthService.verifyToken, UserController.getDetailFilm)
// filter film by genre
router.get('/films', AuthService.verifyToken, UserController.getFilmsByGenres)
// list rating
router.get('/ratings', AuthService.verifyToken, UserController.getRatings)
// rating film
router.post('/rating', AuthService.verifyToken, UserController.ratingFilm)
// delete rating film
router.delete('/rating', AuthService.verifyToken, UserController.deleteRatingFilm)
// save film
router.post('/save', AuthService.verifyToken, UserController.saveFilm)
// get film in savedFilm by user_id
router.get('/savedFilm/:id', AuthService.verifyToken, UserController.getSavedFilm)
// get film ranking
router.get('/ranking', AuthService.verifyToken, UserController.getFilmByRating)
// unsave film
router.delete('/unsaved', AuthService.verifyToken, UserController.unsaveFilm)
// get favorite film by userId
router.get('/favorite/:userId', AuthService.verifyToken, UserController.getFavoriteFilmByUserId)
// get favorite film
router.get('/favorite', AuthService.verifyToken, UserController.getFavoriteFilm)
// add favorite film
router.post('/favorite', AuthService.verifyToken, UserController.addFavoriteFilm)
// delete favorite film
router.delete('/favorite', AuthService.verifyToken, UserController.deleteFavoriteFilm)
// get recommend list film from favorite list film
router.get('/recommendFavorite/:userId', AuthService.verifyToken, UserController.getRecommendFromFavorite)
// get recommend list film from history list film
router.get('/recommend', AuthService.verifyToken, UserController.getRecommend)
// add to history view
router.post('/history', AuthService.verifyToken, UserController.addHistory)
// get film in history by user_id
router.get('/historyFilm/:id', AuthService.verifyToken, UserController.getHistoryFilm)
// delete film from history
router.delete('/historyFilm', AuthService.verifyToken, UserController.deleteHistoryFilm)
// payment
router.post('/payment', UserController.payment)
// add a new payment
router.post('/payment/add', UserController.addPayment)

module.exports = router