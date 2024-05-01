const userModel = require('../models/user.model');
const movieModel = require('../models/movie.model');
const savedMovieModel = require('../models/saved_movie.model')
const historyModel = require('../models/history.model')
const videoModel = require('../models/video.model');
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const https = require('https');
const qs = require('querystring');
const getData = require('../utils/formatRes');
const { move, use } = require('../routes/user/user.route');

class UserService {
    // [GET]/v1/api/user/listAllUsers
    static listAllUsers = async () => {
        try {
            const Users = await userModel.find({}).lean();
            const ModifiedUsers = Users.map(obj => {
                const { createdAt, updatedAt, __v, password, ...rest } = obj
                return rest;
            })

            return ModifiedUsers;
        } catch (error) {
            console.log(error);
        }
    }
    // [PATCH]/v1/api/user/updatePassword
    static updatePassword = async ({ id, password }) => {
        try {
            const existUser = await userModel.findById(id);
            if (!existUser) {
                return {
                    message: "User not registered"
                }
            }

            const salt = await bcrypt.genSalt()
            const newPasswordHash = await bcrypt.hash(password, salt)

            await userModel.updateOne({ _id: id }, {
                $set: { password: newPasswordHash }
            })

            return {
                message: "update password successfully",
                user: getData({ fields: ['_id', 'email', 'favorites', 'roles'], object: existUser })
            }
        } catch (error) {
            console.log(error)
        }

    }
    
    static updateAccount = async ({id}, {name, sexuality, phone}) => {
        try {
            if (id.length > 24) {
                return {
                    success: false,
                    message: "User does not exist"
                }
            }
            const existUser = await userModel.findById(id).lean()

            if (!existUser) {
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const data = {
                name: name,
                sexuality: sexuality,
                phone: phone
            }

            const updatedUser = await userModel.findByIdAndUpdate(existUser._id, data, { new: true })

            return {
                success: true,
                message: "Update successfully",
                user: getData({ fields: ['_id', 'email', 'name', 'sexuality', 'phone', 'favorites', 'roles'], object: updatedUser })
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
    
    static saveFilm = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            const film = await movieModel.findById(filmId)
            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            const existSavedFilm = await savedMovieModel.findOne({ userId: user._id })
            if (existSavedFilm) {
                const savedFilm = await savedMovieModel.findOneAndUpdate({ userId: user._id, filmId: { $nin: [film._id] } }, {
                    $push: { filmId: film._id }
                });
                if (savedFilm) {
                    const formatSavedFilm = await (await savedFilm.populate({
                        path: "filmId",
                        select: '_id plot title fullplot released lastupdated type'
                    })).
                    populate({
                        path: "userId",
                        select: '_id email name sexuality phone favorites roles'
                    })
                    return getData({ fields: ['_id', 'userId', 'filmId'], object: formatSavedFilm });
                }
                return {
                    success: false,
                    message: "Film already saved"
                }
            } else {
                const newSavedFilm = new savedMovieModel({
                    userId: user._id,
                    filmId: [film._id]
                })
                const savedFilm = await newSavedFilm.save()
                const formatSavedFilm = await (await savedFilm.populate({
                    path: "filmId",
                    select: '_id plot title fullplot released lastupdated type'
                })).
                    populate({
                        path: "userId",
                        select: '_id email name sexuality phone favorites roles'
                    })

                return {
                    success: true,
                    message: "Save successfully",
                    film: getData({ fields: ['_id', 'userId', 'filmId'], object: formatSavedFilm })
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static unsaveFilm = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }
            const film = await movieModel.findById(filmId)
            const existSavedFilm = await savedMovieModel.findOne({ userId: user._id, filmId: film._id })
            if(existSavedFilm){
                const unSavedFilm = await savedMovieModel.findOneAndUpdate({ userId: user._id, filmId: { $in: [film._id] } }, {
                    $pull: { filmId: film._id }
                });
                return {
                    success: true,
                    message: "Delete successfully",
                }
            }
            return {
                success: false,
                message: "Film not saved"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static addFavoriteFilm = async ({ filmId, userId }) => {
        try {
            const movie = await movieModel.findById(filmId)
            const user = await userModel.findById(userId)

            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            if (!movie){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            const checkIsSaveAlready = user.favorites.some((id) => {
                return id.toString() == movie._id.toString()
            })

            if (checkIsSaveAlready) {
                return {
                    success: false,
                    message: "Film already saved",
                }
            }
            else {
                user.favorites.push(filmId)
                await user.save()
                return {
                    success: true,
                    message: "add favorite film successfully",
                    movie: getData({
                        fields: ['_id', 'plot', 'genres', 'cast', 'image', 'title', 'fullplot', 'released',
                            'directors', 'imdb', 'type'],
                        object: movie
                    })
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteFavoriteFilm = async ({ filmId, userId }) => {
        try {
            const movie = await movieModel.findById(filmId)
            const user = await userModel.findById(userId)

            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            if (!movie){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            const checkIsSaveAlready = user.favorites.some((id) => {
                return id.toString() === movie._id.toString()
            })

            if (checkIsSaveAlready) {
                for (let i = 0; i < user.favorites.length; i++) {
                    if (user.favorites[i].toString() === movie._id.toString())
                    {
                        user.favorites.splice(i,1)
                        await user.save()
                        break
                    }
                }
                return {
                    success: true,
                    message: "Film has been deleted successfully",
                    movie: getData({
                        fields: ['_id', 'plot', 'genres', 'cast', 'image', 'title', 'fullplot', 'released',
                            'directors', 'imdb', 'type'],
                        object: movie
                    })
                }
            }
            else {
                return {
                    success: false,
                    message: "Film have not been added to favorites before",
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getFavoriteFilm = async ({ userId }) => {
        try {
            const user = await userModel.findById(userId).populate({
                path: "favorites",
                select: '_id plot genres cast image title fullplot released directors imdb type'
            })

            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const movies = user.favorites

            return movies

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static getVideo = async ({ filmId }) => {
        try {
            const video = await videoModel.findOne({ filmId: filmId })
            
            let videoList = []

            if(video){
                videoList = video.videoList
            }

            if (video) {
                return videoList
            }
            else {
                return {
                    success: false,
                    message: "Can not find film",
                }

            }

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static getDetailFilm = async ({ filmId }) => {
        try {
            const film = await movieModel.findById(filmId).populate({
                path: "cast",
                select: '_id avatar name description movies'
            }).populate({
                path: "directors",
                select: '_id name movies'
            })
            const video = await videoModel.findOne({filmId: filmId})
            const allFilms = await movieModel.find()

            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            let detailFilm = getData({
                fields: ['cast', 'directors'],
                object: film
            })

            detailFilm.videoList = video.videoList

            const genreList = film.genres
            console.log(genreList)
            let recommendedFilms = []

            //đề xuất 15 bộ
            // for(let i=0;i<15;i++)
            //test
            for(let i=0;i<3;i++)
            {
                const ranNumGenre = Math.floor(Math.random() * genreList.length)

                do{
                    const ranNumFilm = Math.floor(Math.random() * allFilms.length)

                    if (allFilms[ranNumFilm].genres.some(genre => genre.toString() == genreList[ranNumGenre].toString())) {
                        if (
                            recommendedFilms.some(id => {
                                return id.toString() == allFilms[ranNumFilm]._id.toString()
                            })
                        ) { }
                        else {
                            recommendedFilms.push(allFilms[ranNumFilm]._id)
                            break
                        }   
                    }
                }
                while(true)
            }

            detailFilm.recommendedFilms = recommendedFilms

            return detailFilm

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static addHistory = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            const film = await movieModel.findById(filmId)
            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            const existHistoryFilm = await historyModel.findOne({ userId: user._id })
            if (existHistoryFilm) {
                const historyFilm = await historyModel.findOneAndUpdate({ userId: user._id, filmId: { $nin: [film._id] } }, {
                    $push: { filmId: film._id }
                });

                

                if (historyFilm) {
                    const formatHistoryFilm = await (await historyFilm.populate({
                        path: "filmId",
                        select: '_id plot title fullplot released lastupdated type'
                    })).
                    populate({
                        path: "userId",
                        select: '_id email name sexuality phone favorites roles'
                    })
                    return getData({ fields: ['_id', 'userId', 'filmId'], object: formatHistoryFilm });
                }
                else{
                    const haveHistoryFilm = await historyModel.findOne({ userId: user._id})
                
                    haveHistoryFilm.filmId.forEach((id, index) => {
                        if(id.toString() == filmId.toString()){
                            haveHistoryFilm.filmId.splice(index, 1);
                            haveHistoryFilm.filmId.unshift(filmId)

                        }
                    })
                    await haveHistoryFilm.save()

                    return {
                        success: true,
                        message: "Film already stored in history"
                    }
                }
                // const HistoryFilm = await movieModel.findById({$in: existHistoryFilm.filmId})
                // return {
                //     success: false,
                //     message: "Film already stored in history"
                // }
            } else {
                const newHistoryFilm = new historyModel({
                    userId: user._id,
                    filmId: [film._id]
                })
                const historyFilm = await newHistoryFilm.save()
                const formatHistoryFilm = await (await historyFilm.populate({
                    path: "filmId",
                    select: '_id plot title fullplot released lastupdated type'
                })).
                populate({
                    path: "userId",
                    select: '_id email name sexuality phone favorites roles'
                })

                return {
                    success: true,
                    message: "Add history successfully",
                    film: getData({ fields: ['_id', 'userId', 'filmId'], object: formatHistoryFilm })
                }

            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static deleteHistoryFilm = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const film = await movieModel.findById(filmId)
            const existHistoryFilm = await historyModel.findOne({ userId: user._id, filmId: film._id })
            if(existHistoryFilm){
                const delHistoryFilm = await historyModel.findOneAndUpdate({ userId: user._id, filmId: { $in: [film._id] } }, {
                    $pull: { filmId: film._id }
                });
                return {
                    success: true,
                    message: "Delete successfully",
                }
            }
            return {
                success: false,
                message: "Film not in history"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }
}

module.exports = UserService;