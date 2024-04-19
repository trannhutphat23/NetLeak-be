const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Rating'
const COLLECTION_NAME = 'Ratings'

var ratingScheme = new Schema({
    email: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    film_id: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true,
    },
    rate: {
        type: Number,
        min: 0,
        max: 10,
        require: true,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, ratingScheme);