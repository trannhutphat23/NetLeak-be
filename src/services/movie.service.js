const movieModel = require('../models/movie.model');
const getData = require('../utils/formatRes')
const _ = require('lodash');

class MovieService {
    static getMovies = async () => {
        try {
            const Movies = await movieModel.find({}).lean();

            return _.map(Movies, obj => getData({ 
                fields: ["_id", "plot", "genres", "cast", "image","title","fullplot","released","directors","lastupdated","imdb","type"], 
                object: obj 
            }));
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getMovieByType = async (query) => {
        try {
            const Movies = await movieModel.find({type: query}).lean();

            return _.map(Movies, obj => getData({ 
                fields: ["_id", "plot", "genres", "cast", "image","title","fullplot","released","directors","lastupdated","imdb","type"], 
                object: obj 
            }));
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = MovieService;