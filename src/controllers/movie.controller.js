const MovieService = require('../services/movie.service')

class MovieController {
    addMovie = async (req, res, next) => {
        try {
            console.log(req.body)
            return res.status(201).json(await MovieService.addMovie(req.files, req.body))
        } catch (error){
            next(error)
        }
    }

    getMovies = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.getMovies())
        } catch (error){
            next(error)
        }
    }

    getMovie = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.getMovie(req.params))
        } catch (error){
            next(error)
        }
    }

    updateMovie = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.updateMovie(req.files, req.params, req.body))
        } catch (error){
            next(error)
        }
    }

    deleteMovie = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.deleteMovie(req.query))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new MovieController();