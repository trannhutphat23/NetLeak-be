const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Payment_package'
const COLLECTION_NAME = 'Payment_packages'

var paymentPackageScheme = new Schema({
    title: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, paymentPackageScheme);