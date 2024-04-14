const GenreService = require('../services/genre.service')
const { model, Schema, Types } = require('mongoose');

class GenreController {

    // add new Genre
    addGenre = async (req, res, next) => {
        try {
            return res.status(201).json(await GenreService.addGenre(req.body))
        } catch (error){
            next(error)
        }
    }

    listGenres = async (req, res, next) => {
        try {
            return res.status(201).json(await GenreService.listGenres())
        } catch (error){
            next(error)
        }
    }

    getGenre = async (req, res, next) => {
        try {
            return res.status(201).json(await GenreService.getGenre(req.params))
        } catch (error){
            next(error)
        }
    }

    updateGenre = async (req, res, next) => {
        try {
            return res.status(201).json(await GenreService.updateGenre(req.params, req.body))
        } catch (error){
            next(error)
        }
    }

    deleteGenre = async (req, res, next) => {
        try {
            return res.status(201).json(await GenreService.deleteGenre(req.params))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new GenreController();