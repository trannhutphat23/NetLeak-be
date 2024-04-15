const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Cast'
const COLLECTION_NAME = 'Casts'

var castScheme = new Schema({
    avatar: {
        type: String,
        require: true,
    },
    name: {
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

module.exports = model(DOCUMENT_NAME, castScheme);