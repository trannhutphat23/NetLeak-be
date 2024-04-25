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
            return res.status(201).json(await MovieService.ratingFilm(req.body))
        } catch (error){
            next(error)
        }
    }

    // delete rating film
    deleteRatingFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.deleteRatingFilm(req.body))
        } catch (error){
            next(error)
        }
    }

    // update account
    updateAccount = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.updateAccount(req.params, req.body))
        } catch (error){
            next(error)
        }
    }

    // save film
    saveFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.saveFilm(req.body))
        } catch (error){
            next(error)
        }
    }
    

    // unsave film
    unsaveFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.unsaveFilm(req.body))
        } catch (error){
            next(error)
        }
    }

    // get saved film by id
    getSavedFilm = async (req, res, next) => {
        try {
            console.log(req.params)
            return res.status(201).json(await MovieService.getSavedFilm(req.params))
        } catch (error){
            next(error)
        }
    }

    // get favorite film
    getFavoriteFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.getFavoriteFilm(req.body))
        } catch (error){
            next(error)
        }
    }

    // get favorite film by userId
    getFavoriteFilmByUserId = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.getFavoriteFilm(req.params))
        } catch (error){
            next(error)
        }
    }

    // add favorite film
    addFavoriteFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.addFavoriteFilm(req.body))
        } catch (error){
            next(error)
        }
    }

    // delete favorite film
    deleteFavoriteFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.deleteFavoriteFilm(req.body))
        } catch (error){
            next(error)
        }
    }
    
    getRecommend = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.getRecommend(req.body))
        } catch (error){
            next(error)
        }
    }

    addHistory = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.addHistory(req.body))
        } catch (error){
            next(error)
        }
    }

    getHistoryFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await MovieService.getHistoryFilm(req.params))
        } catch (error){
            next(error)
        }
    }

    deleteHistoryFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.deleteHistoryFilm(req.body))
        } catch (error){
            next(error)
        }
    }

    payment = async (req, res, next) => {
        try {
            return (req.body.type === "momo") ? 
                res.status(201).json(await UserService.paymentByMoMo(req.body))
                :
                res.status(201).json(await UserService.paymentByVNPay(req.body))
        } catch (error){
            next(error)
        }
    }
    
    getDetailFilm = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.getDetailFilm(req.body))
        } catch (error){
            next(error)
        }
    }

    getVideo = async (req, res, next) => {
        try {
            return res.status(201).json(await UserService.getVideo(req.body))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new UserController();