const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Video'
const COLLECTION_NAME = 'Videos'

var videoScheme = new Schema({
    film_id: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    type: {
        type: String,
        enum: ["movie", "series"],
        required: true,
    },
    video: [
        {
            type: String,
            require: true,
        }
    ],
    chapter: [
        {
            type: Number,
            require: function () {
                return this.type === 'series'
            }
        }
    ]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, videoScheme);