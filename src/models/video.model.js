const { model, Schema, Types } = require('mongoose');
const movieModel = require('./movie.model')
const DOCUMENT_NAME = 'Video'
const COLLECTION_NAME = 'Videos'

var videoScheme = new Schema({
    filmId: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    videoList: [
        {
            videoLink: {
                type: String,
                require: true,
            },
            chapter: {
                type: String,
            }
        }
    ],
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

videoScheme.pre('save',async function(next) {
  const film = await movieModel.findById(this.filmId);
  this.videoList.chapter
  console.log(this.videoList.chapter)
  next();
});

module.exports = model(DOCUMENT_NAME, videoScheme);