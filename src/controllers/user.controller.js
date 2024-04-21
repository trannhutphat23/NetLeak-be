const UserService = require('../services/user.service')
const MovieService = require('../services/movie.service')

class UserController {
    // list all users
    listAllUsers = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.listAllUsers())
        } catch (error){
            next(error)
        }
    }
    // update password
    updatePassword = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.updatePassword(req.body))
        } catch (error){
            next(error)
        }
    }

    // get film by genres
    getFilmsByGenres = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.getFilmsByGenres(req.body))
        } catch (error){
            next(error)
        }
    }

    // rating film
    ratingFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.ratingFilm(req.query))
        } catch (error){
            next(error)
        }
    }

    // delete rating film
    deleteRatingFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.deleteRatingFilm(req.query))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new UserController();