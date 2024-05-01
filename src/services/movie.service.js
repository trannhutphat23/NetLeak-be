const mongoose = require('mongoose')
const movieModel = require('../models/movie.model')
const genreModel = require('../models/genre.model')
const directorModel = require('../models/studio.model')
const castModel = require('../models/cast.model');
const ratingModel = require('../models/rating.model')
const userModel = require('../models/user.model')
const savedMovieModel = require('../models/saved_movie.model')
const historyModel = require('../models/history.model')
const uploadImage = require('../utils/uploadImage')
const deleteImage = require('../utils/deleteImage')
const getName = require('../utils/getNameImage')
const getData = require('../utils/formatRes')
const _ = require('lodash');
const CastService = require('./cast.service');
const { getRecommend } = require('../controllers/user.controller');

class MovieService {
    static addMovie = async (files, body) => {
        try {
            const movie = await movieModel.findOne({ title: body.title }).lean()
            if (movie) {
                return {
                    success: false,
                    message: "Movie already exists"
                }
            }

            const cloudinaryFolder = process.env.FOLDER_IMAGE_FILM;
            const filmImgArr = [];
            files.forEach((file) => {
                var originalName = "";
                if (file.originalname.includes("poster")) {
                    originalName = "poster"
                } else if (file.originalname.includes("banner")) {
                    originalName = "banner"
                } else {
                    originalName = file.originalname.split(".")[0]
                }
                filmImgArr[originalName] = file
            })
            const fileResCloud = {
                img: [],
                poster: "",
                banner: ""
            }
            for (const fileName in filmImgArr) {
                if (filmImgArr.hasOwnProperty(fileName)) {
                    const filePath = filmImgArr[fileName].path;
                    const filmUrl = await uploadImage(filePath, cloudinaryFolder);
                    if (fileName === "poster") {
                        fileResCloud.poster = filmUrl
                    } else if (fileName === "banner") {
                        fileResCloud.banner = filmUrl
                    } else {
                        fileResCloud.img.push(filmUrl)
                    }
                }
            }
            console.log(fileResCloud)

            const newMovie = new movieModel({
                "plot": body.plot,
                "genres": body.genres,
                "cast": body.cast,
                "image": fileResCloud,
                "title": body.title,
                "fullplot": body.fullplot,
                "released": body.released,
                "directors": body.directors,
                "imdb": { rating: null, vote: null },
                "type": body.type
            })

            const savedMovie = await newMovie.save()

            if (body.genres) {
                var genre = await genreModel.find({ _id: { $in: body.genres } })

                for (const genreEle of genre) {
                    await genreEle.updateOne({ $push: { movies: savedMovie._id } })
                }
            }

            if (body.cast) {
                var castArr = await castModel.find({ _id: { $in: body.cast } })
                for (const castEle of castArr) {
                    await castEle.updateOne({ $push: { movies: savedMovie._id } })
                }
            }

            if (body.directors) {
                var director = await directorModel.find({ _id: { $in: body.directors } })

                for (const directorEle of director) {
                    await directorEle.updateOne({ $push: { movies: savedMovie._id } })
                }
            }

            const NewMovie = (await (await savedMovie
                .populate("genres"))
                .populate("cast"))
                .populate("directors")

            return savedMovie;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getMovies = async () => {
        try {
            const Movies = await movieModel.find({})
                .populate("cast").populate("genres").populate("directors")

            return Movies
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getMovie = async (params) => {
        try {
            const film = await movieModel.findById(params.id)
                .populate('cast').populate("genres").populate("directors")

            return film;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateMovie = async (files, params = { id }, body = { plot, title, fullplot, type, released, genres, cast, directors }) => {
        try {
            const ID = params.id;
            const existMovie = await movieModel.findById(ID)
            
            if (!existMovie) {
                return {
                    success: false,
                    message: "Movie does not exist"
                }
            }

            if (files.length != 0) {
                // UPLOAD NEW IMAGE TO CLOUDINARY
                const cloudinaryFolder = process.env.FOLDER_IMAGE_FILM;
                const filmImgArr = [];
                files.forEach((file) => {
                    var originalName = "";
                    if (file.originalname.includes("poster")) {
                        originalName = "poster"
                    } else if (file.originalname.includes("banner")) {
                        originalName = "banner"
                    } else {
                        originalName = file.originalname.split(".")[0]
                    }
                    filmImgArr[originalName] = file
                })
                const fileResCloud = {
                    img: [],
                    poster: "",
                    banner: ""
                }
                for (const fileName in filmImgArr) {
                    if (filmImgArr.hasOwnProperty(fileName)) {
                        const filePath = filmImgArr[fileName].path;
                        const filmUrl = await uploadImage(filePath, cloudinaryFolder);
                        if (fileName === "poster") {
                            fileResCloud.poster = filmUrl
                        } else if (fileName === "banner") {
                            fileResCloud.banner = filmUrl
                        } else {
                            fileResCloud.img.push(filmUrl)
                        }
                    }
                }
                const data = {
                    image: fileResCloud,
                    plot: body.plot,
                    title: body.title,
                    fullplot: body.fullplot,
                    type: body.type,
                    released: body.released,
                    genres: body.genres,
                    cast: body.cast,
                    directors: body.directors
                }

                // DELETE IMAGE IN CLOUDINARY
                const imgObj = existMovie.image
                for (const key in imgObj) {
                    if (imgObj.hasOwnProperty(key)) {
                        const url = imgObj[key]
                        if (Array.isArray(url)) {
                            url.map(async (u) => {
                                const name = getName(u)
                                const result = "NetLeak/Film_Image/" + name
                                await deleteImage(result)
                            })
                        } else {
                            const name = getName(url)
                            const result = "NetLeak/Film_Image/" + name
                            await deleteImage(result)
                        }
                    }
                }
                // update IN DB
                const updatedFilm = await movieModel.findByIdAndUpdate(ID, data, { new: true });

                return updatedFilm;
            } else {
                const data = {
                    image: existMovie.image,
                    plot: body.plot,
                    title: body.title,
                    fullplot: body.fullplot,
                    type: body.type,
                    released: body.released,
                    genres: body.genres,
                    cast: body.cast,
                    directors: body.directors
                }

                // UPDATE IN DB
                const updatedFilm = await movieModel.findByIdAndUpdate(ID, data, { new: true });

                return updatedFilm;
            }

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteMovie = async (query) => {
        try {
            const id = query.id

            const movie = await movieModel.findByIdAndDelete(id)
            if (!movie) {
                return {
                    success: false,
                    message: "Movie does not exist"
                }
            }
            const imgObj = movie.image
            for (const key in imgObj) {
                if (imgObj.hasOwnProperty(key)) {
                    const url = imgObj[key]
                    if (Array.isArray(url)) {
                        url.map(async (u) => {
                            const name = getName(u)
                            const result = "NetLeak/Film_Image/" + name
                            await deleteImage(result)
                        })
                    } else {
                        const name = getName(url)
                        const result = "NetLeak/Film_Image/" + name
                        await deleteImage(result)
                    }
                }
            }

            const genreIdArr = movie.genres
            for (const genreId in genreIdArr) {
                const genre = await genreModel.findById(genreIdArr[genreId])
                await genre.updateOne({ $pull: { movies: movie._id } })
            }

            const castIdArr = movie.cast
            for (const castId in castIdArr) {
                const cast = await castModel.findById(castIdArr[castId])
                await cast.updateOne({ $pull: { movies: movie._id } })
            }

            const directorIdArr = movie.directors
            for (const directorId in directorIdArr) {
                const director = await directorModel.findById(directorIdArr[directorId])
                await director.updateOne({ $pull: { movies: movie._id } })
            }

            return {
                success: true,
                message: "Delete successfully"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getFilmsByGenres = async (body) => {
        try {
            const genres = await genreModel.find({ _id: { $in: body.genres } }).populate("movies")

            let movies = genres[0].movies
            movies = movies.filter(movie => {
                return movie.type === body.type
            })
            return { movies: movies };
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static ratingFilm = async ({ emailId, filmId, rate }) => {
        try {
            const user = await userModel.findById(emailId)
            const film = await movieModel.findById(filmId)
            const existRating = await ratingModel.find({ email: user._id, film_id: film._id })
            if (existRating) {
                const rating = await ratingModel.findOneAndUpdate({ email: user._id, film_id: film._id },
                    { rate: rate },
                    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
                const result = await ratingModel.aggregate([
                    {
                        $match: {
                            film_id: film._id
                        }
                    },
                    {
                        $group: {
                            _id: "$film_id",
                            averageRate: { $avg: "$rate" }
                        }
                    }
                ]);

                const avgRate = result[0].averageRate;

                await movieModel.findOneAndUpdate({ _id: film._id }, { imdb: { rating: (avgRate*film.imdb.vote + rate)/(film.imdb.vote+1) , vote: film.imdb.vote } })

                return (await rating.populate({
                    path: "email",
                    select: '_id email name sexuality phone favorites roles'
                })).populate({
                    path: "film_id",
                    select: '_id image imdb plot title fullplot released lastupdated type'
                })
            } else {
                const newRating = new ratingModel({
                    email: user._id,
                    film_id: film._id,
                    rate: rate
                })
                const createdrating = await newRating.save();

                return (await createdrating.populate({
                    path: "email",
                    select: '_id email name sexuality phone favorites roles'
                })).populate({
                    path: "film_id",
                    select: '_id image imdb plot title fullplot released lastupdated type'
                })
            }

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteRatingFilm = async ({ userId, filmId }) => {
        try {
            const film = await movieModel.findById(filmId)

            const existRating = await ratingModel.findOne({ email: userId, film_id: filmId })
            if (!existRating) {
                return {
                    success: false,
                    message: "Rating does not exist"
                }
            }

            await ratingModel.findByIdAndDelete(existRating._id)

            const result = await ratingModel.aggregate([
                {
                    $match: {
                        film_id: film._id
                    }
                },
                {
                    $group: {
                        _id: "$film_id",
                        averageRate: { $avg: "$rate" }
                    }
                }
            ]);

            const avgRate = (!result[0]) ? null : result[0].averageRate

            await movieModel.findOneAndUpdate({ _id: film._id }, { imdb: { rating: avgRate, vote: film.imdb.vote } })

            return {
                success: true,
                message: "Delete successfully"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getSavedFilm = async (params) => {
        try {
            const ID = params.id

            const user = await userModel.findById(ID)
            if (!user) {
                return {
                    sucess: false,
                    message: "User does not exist"
                }
            }
            const savedFilm = await savedMovieModel.findOne({ userId: user._id })

            if (!savedFilm) {
                return {
                    success: false,
                    message: "No films have been saved"
                }
            }
            const formatSavedFilm = await savedFilm.populate("filmId")

            return getData({ fields: ['_id', 'userId', 'filmId'], object: formatSavedFilm });
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getHistoryFilm = async (params) => {
        try {
            const ID = params.id

            const user = await userModel.findById(ID)
            if (!user) {
                return {
                    sucess: false,
                    message: "User does not exist"
                }
            }
            const historyFilm = await historyModel.findOne({ userId: user._id })

            if (!historyFilm) {
                return {
                    success: false,
                    message: "No films have been saved"
                }
            }
            const formatHistoryFilm = await historyFilm.populate("filmId")

            return getData({ fields: ['_id', 'userId', 'filmId'], object: formatHistoryFilm });
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getRecommend = async ({ userId }) => {
        try {
            const user = await userModel.findById(userId)
            if (!user) {
                return {
                    sucess: false,
                    message: "User does not exist"
                }
            }

            const history = await historyModel.findOne({ userId: userId }).populate('filmId')

            const watchedFilms = history.filmId
            let genreList = []

            watchedFilms.splice(0, watchedFilms.length - 30)

            watchedFilms.forEach((film) => {
                genreList = [...genreList, ...film.genres]
            })

            let recommendedFilms = []
            const allFilms = await movieModel.find()

            //de xuat 15 bo
            // for (let i = 0; i < 15; i++) {
            //NÀY CHƯA CÓ DATA NÊN TEST
            for (let i = 0; i < 2; i++) {
                const ranNumGenre = Math.floor(Math.random() * genreList.length)

                do {
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
                while (true)
            }
            return recommendedFilms
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getRecommendFromFavorite = async ({ userId }) => {
        try {
            const user = await userModel.findById(userId).populate('favorites')
            if (!user) {
                return {
                    sucess: false,
                    message: "User does not exist"
                }
            }

            const favoriteFilm = user.favorites

            const allFilms = await movieModel.find()

            let recommendedFilms = []

            if (favoriteFilm.length != 0) {

                let genreList = []

                // favoriteFilm.splice(0, favoriteFilm.length - 30)

                favoriteFilm.forEach((film) => {
                    genreList = [...genreList, ...film.genres]
                })

                //de xuat 15 bo
                for (let i = 0; i < 15; i++) {
                    //NÀY CHƯA CÓ DATA NÊN TEST
                    // for (let i = 0; i < 2; i++) {
                    const ranNumGenre = Math.floor(Math.random() * genreList.length)

                    do {
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
                    while (true)
                }
            }
            else {
                for (let i = 0; i < 15; i++) {
                    //NÀY CHƯA CÓ DATA NÊN TEST
                    // for (let i = 0; i < 2; i++) {
                    // const ranNumGenre = Math.floor(Math.random() * genreList.length)

                    do {
                        const ranNumFilm = Math.floor(Math.random() * allFilms.length)

                        // if (allFilms[ranNumFilm].genres.some(genre => genre.toString() == genreList[ranNumGenre].toString())) {
                            if (
                                recommendedFilms.some(id => {
                                    return id.toString() == allFilms[ranNumFilm]._id.toString()
                                })
                            ) { }
                            else {
                                recommendedFilms.push(allFilms[ranNumFilm]._id)
                                break
                            }
                        // }

                    }
                    while (true)
                }
            }

            return recommendedFilms
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getHistoryFilm = async (params) => {
        try {
            const ID = params.id

            const user = await userModel.findById(ID)
            if (!user) {
                return {
                    sucess: false,
                    message: "User does not exist"
                }
            }
            const historyFilm = await historyModel.findOne({ userId: user._id })

            if (!historyFilm) {
                return {
                    success: false,
                    message: "No films have been saved"
                }
            }
            const formatHistoryFilm = await historyFilm.populate("filmId")

            return getData({ fields: ['_id', 'userId', 'filmId'], object: formatHistoryFilm });
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getRecommend = async ({ userId }) => {
        try {
            const user = await userModel.findById(userId)
            if (!user) {
                return {
                    sucess: false,
                    message: "User does not exist"
                }
            }
            const rcmFilm = await historyModel.findOne({ userId: user._id })
            const formatRcmFilm = await rcmFilm.populate("filmId")
            const detailFilmArr = formatRcmFilm.filmId.map((film) => {
                return film
            })
            var genresIdArr = detailFilmArr.map((genre) => {
                return genre.genres
            })
            var genresArr = []
            await Promise.all(genresIdArr.map(async (genre) => {
                await Promise.all(genre.map(async (gen) => {
                    const existGen = await genreModel.findById(gen)
                    if (existGen) {
                        genresArr.push(existGen.title)
                    }
                }))
            }))

            const genres = await genreModel.find({ title: { $in: genresArr } })

            return {
                film: formatRcmFilm.filmId
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getFilmByRating = async () => {
        try {
            const allFilms = await movieModel.aggregate([
                { 
                    $sort: {"imdb.rating": -1}
                }
            ])
            return allFilms;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getRatings = async () => {
        try {
            const ratings = await ratingModel.find({})

            return ratings;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = MovieService;