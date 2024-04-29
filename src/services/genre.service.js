const genreModel = require('../models/genre.model')
const getData = require('../utils/formatRes')
const _ = require('lodash');

class GenreService {
    static addGenre = async ({title, description}) => {
        try {
            const existGenre = await genreModel.findOne({title}).lean();
            if (existGenre){
                return {
                    success: false,
                    message: "Genre already exists"
                }
            }

            const newGenre = new genreModel({
                title,
                description
            })
            return getData({ fields: ['_id', 'title', 'description', 'movies'], object: await newGenre.save()})
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static listGenres = async () => {
        try {
            const Genres = await genreModel.find({}).populate({
                path: "movies",
                select: '_id image plot title fullplot released lastupdated type'
            }).lean();

            return _.map(Genres, obj => getData({ 
                fields: ["_id", "title", "description", "movies"], 
                object: obj }))
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getGenre = async (params = {id}) => {
        try {
            const ID = params.id;

            const genre = await genreModel.findById(ID);

            return getData({ fields: ['_id', 'title', 'description', 'movies'], object: genre}) 
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateGenre = async (params = {id},body = {title, description}) => {
        try {
            const ID = params.id;

            const data = {
                title: body.title,
                description: body.description
            }

            const updatedGenre = await genreModel.findByIdAndUpdate(ID, data, {new: true});
            
            return {
                success: true,
                message: "Update successfully",
                user: getData({ fields: ['_id', 'title', 'description', 'movies'], object: updatedGenre})
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteGenre = async (params = {id}) => {
        try {
            const ID = params.id

            const genre = await genreModel.findByIdAndDelete(ID)
            if (!genre){
                return {
                    success: false,
                    message: "Genre not exist"
                }
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

module.exports = GenreService;
