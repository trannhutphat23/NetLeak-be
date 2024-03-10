const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'UserToken'
const COLLECTION_NAME = 'UserTokens'

var userTokenSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        required:true,
        trim: true,
        ref: 'USER'
    },
    refreshToken:{
        type:String,
        required:true,
        trim: true,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userTokenSchema);