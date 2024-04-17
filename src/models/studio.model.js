const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Studio'
const COLLECTION_NAME = 'Studios'

var studioSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    movies: {
        type: [Types.ObjectId],
        ref: 'Movie',
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, studioSchema);