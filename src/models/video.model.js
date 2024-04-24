const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Video'
const COLLECTION_NAME = 'Videos'

var videoScheme = new Schema({
    filmId: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    videoLink: [
        {
            type: String,
            require: true,
        }
    ],
    chapter: [
        {
            type: Number,
        }
    ]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, videoScheme);