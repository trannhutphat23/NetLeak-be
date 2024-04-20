const UserService = require('../services/user.service')
const MovieService = require('../services/movie.service')

class UserController {
    // list all users
    listAllUsers = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.listAllUsers())
        } catch (error) {
            next(error)
        }
    }
    // update password
    updatePassword = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.updatePassword(req.body))
        } catch (error) {
            next(error)
        }
    }

    //get films
    getMovies = async (req, res, next) => {
        try {
            if (req.query.type)
                return res.status(201).json(await MovieService.getMovieByType(req.query.type))

            return res.status(201).json(await MovieService.getMovies())

        } catch (error) {
            next(error)
        }
    }

    //get film by id
    getMovie = async (req, res, next) => {
        try {
            return res.status(201).json(await CastService.getMovie(req.params));
        }
        catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();