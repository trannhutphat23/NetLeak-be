const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'History'
const COLLECTION_NAME = 'Historys'

var historySchema = new Schema({
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

module.exports = model(DOCUMENT_NAME, historySchema);