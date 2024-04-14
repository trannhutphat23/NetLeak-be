const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Genre'
const COLLECTION_NAME = 'Genres'

var genreSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    movies: {
        type: [Types.ObjectId],
        ref: 'Movie',
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, genreSchema);