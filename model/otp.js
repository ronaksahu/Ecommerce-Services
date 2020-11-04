const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OtpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    otp: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('OTP', OtpSchema);