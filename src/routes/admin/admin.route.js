const express = require('express')
const AdminController = require('../../controllers/admin.controller')
const GenreController = require('../../controllers/genre.controller')
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
router.get('/customers', AdminController.listAllUsers)

module.exports = router