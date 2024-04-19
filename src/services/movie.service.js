const movieModel = require('../models/movie.model')
const genreModel = require('../models/genre.model')
const directorModel = require('../models/studio.model')
const castModel = require('../models/cast.model');
const uploadImage = require('../utils/uploadImage')
const deleteImage = require('../utils/deleteImage')
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
}

module.exports = MovieService;