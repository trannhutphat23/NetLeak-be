const movieModel = require('../models/movie.model')
const genreModel = require('../models/genre.model')
const directorModel = require('../models/studio.model')
const castModel = require('../models/cast.model');
const uploadImage = require('../utils/uploadImage')
const deleteImage = require('../utils/deleteImage')
const getName = require('../utils/getNameImage')
const getData = require('../utils/formatRes')
const _ = require('lodash');
const CastService = require('./cast.service');

class MovieService {
    static addMovie = async (files ,body) => {
        try {
            const movie = await movieModel.findOne({title: body.title}).lean()
            if (movie){
                return {
                    success: false,
                    message: "Movie already exists"
                }
            }

            const cloudinaryFolder = process.env.FOLDER_IMAGE_FILM;
            const filmImgArr = [];
            console.log(files)
            files.forEach((file) => {
                var originalName = "";
                if (file.originalname.includes("poster")){
                    originalName = "poster"
                }else if (file.originalname.includes("banner")){
                    originalName = "banner"
                }else{
                    originalName  = file.originalname.split(".")[0]
                }
                filmImgArr[originalName] = file
            })
            const fileResCloud = {
                img: [],
                poster: "",
                banner: ""
            }
            for (const fileName in filmImgArr){
                if (filmImgArr.hasOwnProperty(fileName)) {
                    const filePath = filmImgArr[fileName].path;
                    const filmUrl = await uploadImage(filePath, cloudinaryFolder);
                    if (fileName === "poster"){
                        fileResCloud.poster = filmUrl
                    }else if (fileName === "banner"){
                        fileResCloud.banner = filmUrl
                    }else {
                        fileResCloud.img.push(filmUrl)
                    }
                }
            }

            const newMovie = new movieModel({
                plot: body.plot,
                genres: body.genres,
                cast: body.cast,
                image: fileResCloud,
                title: body.title,
                fullplot: body.fullplot,
                released: body.released,
                directors: body.directors,
                imdb: { rating: null, vote: null},
                type: body.type
            })

            const savedMovie = await newMovie.save();

            if (body.genres){
                var genre = await genreModel.find({_id: {$in: body.genres}})

                for (const genreEle of genre){
                   await genreEle.updateOne({$push: { movies: savedMovie._id }})
                }
            }

            if (body.cast){
                var castArr = await castModel.find({_id: {$in: body.cast}})
                for (const castEle of castArr){
                    await castEle.updateOne({$push: { movies: savedMovie._id }})
                }
            }

            if (body.directors){
                var director = await directorModel.find({_id: {$in: body.directors}})

                for (const directorEle of director){
                    await directorEle.updateOne({$push: { movies: savedMovie._id }})
                }
            }

            const NewMovie = (await (await savedMovie
                                .populate("genres"))
                                .populate("cast"))
                                .populate("directors")

            return NewMovie;
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
                .populate("genres")
                .populate("cast")
                .populate("directors")

            return Movies;
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
                                        .populate('genres')
                                        .populate('cast')
                                        .populate('directors')

            return film;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateMovie = async (params = {id},body = {plot, title, fullplot, type}) => {
        try {
            const ID = params.id;

            const data = {
                plot: body.plot,
                title: body.title,
                fullplot: body.fullplot,
                type: body.type
            }

            const updatedFilm = await movieModel.findByIdAndUpdate(ID, data, {new: true});

            return updatedFilm;
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
            if (!movie){
                return {
                    success: false,
                    message: "Movie does not exist"
                }
            }
            const imgObj = movie.image
            for (const key in imgObj) {
                if (imgObj.hasOwnProperty(key)){
                    const url = imgObj[key]
                    if (Array.isArray(url)) {
                        url.map(async (u) => {
                            const name = getName(u)
                            const result = "NetLeak/Film_Image/" + name
                            await deleteImage(result)
                        })
                    }else{
                        const name = getName(url)
                        const result = "NetLeak/Film_Image/" + name
                        await deleteImage(result)
                    }
                }
            }
            
            const genreIdArr = movie.genres
            for (const genreId in genreIdArr){
                const genre = await genreModel.findById(genreIdArr[genreId])
                await genre.updateOne({ $pull: { movies: movie._id }})
            }

            const castIdArr = movie.cast
            for (const castId in castIdArr){
                const cast = await castModel.findById(castIdArr[castId])
                await cast.updateOne({ $pull: { movies: movie._id }})
            }

            const directorIdArr = movie.directors
            for (const directorId in directorIdArr){
                const director = await directorModel.findById(directorIdArr[directorId])
                await director.updateOne({ $pull: { movies: movie._id }})
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
}

module.exports = MovieService;