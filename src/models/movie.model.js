const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Movie'
const COLLECTION_NAME = 'Movies'

var movieSchema = new Schema({
    plot: {
        type: String,
        required: true,
    },
    genres: [
        {
            type: Types.ObjectId,
            ref: 'Genre'
        }
    ],
    cast: [
        {
            type: Types.ObjectId,
            ref: 'Cast'
        }
    ],
    image: {
        img: [
            {
                type: String
            }
        ],
        poster: {
            type: String
        },
        banner: {
            type: String
        }
    },
    title: {
        type: String,
        required: true,
    },
    fullplot: {
        type: String,
    },
    released: {
        type: Date,
    },
    directors: [
        {
            type: Types.ObjectId,
            trim: true,
            ref: 'Studio'
        }
    ],
    imdb: {
        rating: {
            type: Number
        },
        vote: {
            type: Number
        }
    },
    type: {
        type: String,
        enum: ['movie', 'series'],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, movieSchema);