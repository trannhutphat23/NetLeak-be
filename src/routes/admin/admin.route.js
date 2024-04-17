const express = require('express')
const AdminController = require('../../controllers/admin.controller')
const GenreController = require('../../controllers/genre.controller')
const CastController = require('../../controllers/cast.controller')
const StudioController = require('../../controllers/studio.controller')
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
router.post('/studios', StudioController.addStudio)

// list studios
router.get('/studios', StudioController.getStudios)

// get studio by id
router.get('/studios/:id', StudioController.getStudio)

// delete studio by id
router.delete('/studios/:id', StudioController.deleteStudio)

module.exports = router