const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Payment'
const COLLECTION_NAME = 'Payments'

var paymentScheme = new Schema({
    email: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    package_id: {
        type: Schema.Types.ObjectId,
        ref: 'Payment_package',
        required: true,
    },
    method: {
        type: String,
        require: true,
    },
    total: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    expired: {
        type: Date,
        default: () => {
            var currentDate = new Date();
            var nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return nextMonth;
        }
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, paymentScheme);