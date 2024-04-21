const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Saved_movie'
const COLLECTION_NAME = 'Saved_movies'

var savedMovieSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filmId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie',
            required: true,
        }
    ]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, savedMovieSchema);