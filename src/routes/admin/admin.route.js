const express = require('express')
const AdminController = require('../../controllers/admin.controller')
const GenreController = require('../../controllers/genre.controller')
const CastController = require('../../controllers/cast.controller')
const StudioController = require('../../controllers/studio.controller')
const MovieController = require('../../controllers/movie.controller')
const PaymentController = require('../../controllers/payment.controller')
const VideoController = require('../../controllers/video.controller')
const uploadImage  = require('../../utils/uploadImage')
const multer = require('multer')
const cloudinary = require('../../configs/config.cloudinary')
const upload = multer({ dest: 'uploads/' })
const router = express.Router()

// add new genre
router.post('/genres', GenreController.addGenre)

// list genres
router.get('/genres', GenreController.listGenres)

// get genre by id
router.get('/genres/:id', GenreController.getGenre)

// update genre by id
router.put('/genres/:id', GenreController.updateGenre)

// delete genre by id
router.delete('/genres/:id', GenreController.deleteGenre)

// list all users
router.get('/users', AdminController.listAllUsers)

// get user by id
router.get('/users/:id', AdminController.getUser)

// add new cast
router.post('/casts', upload.single('avatar'), CastController.addCast)

// list cast
router.get('/casts', CastController.getCasts)

// get cast by id
router.get('/casts/:id', CastController.getCast)

// delete cast
router.delete('/casts', CastController.deleteCast)

// add new studio
router.post('/studios', upload.single('avatar'), StudioController.addStudio)

// list studios
router.get('/studios', StudioController.getStudios)

// get studio by id
router.get('/studios/:id', StudioController.getStudio)

// delete studio by id
router.delete('/studios', StudioController.deleteStudio)

// add new film
router.post('/films', upload.array('filmImg', 4), MovieController.addMovie)

// list film
router.get('/films', MovieController.getMovies)

// get film by id
router.get('/films/:id', MovieController.getMovie)

// update film by id
router.put('/films/:id', upload.array('filmImg', 4), MovieController.updateMovie)

// delete film by id
router.delete('/films', MovieController.deleteMovie)

// get video of film
router.get('/videos',upload.single(""),VideoController.getVideo)

// add new video of film
router.post('/videos',upload.single(""), VideoController.addVideo)

// delete video of film
router.delete('/videos',upload.single(""), VideoController.deleteVideo)

// add new payment package
router.post('/payments', PaymentController.addPayment)

// update payment package by id
router.put('/payments/:id', PaymentController.updatePayment)

// delete payment package
router.delete('/payments/:id', PaymentController.deletePayment)

// list payment packages
router.get('/payments', PaymentController.listPayments)

// get payment package by id
router.get('/payments/:id', PaymentController.getPayment)

// get revenue
router.get('/revenue', AdminController.getRevenue)

module.exports = router