const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

var userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    password:{
        type:String,
        required:true,
        trim: true,
        minLength: 6
    },
    name:{
        type:String,
        required:true,
        trim: true,
    },
    age:{
        type: Number,
        required:true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Movie",
        },
    ],
    roles: {
        type: [String],
        enum: ["user", "admin"],
        default: ["user"]
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);