// user model

const mongoose = require('mongoose');

const userSchema = new Schema(
    {
        UID: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        },
        isOnline: {
            type: Boolean,
            default: false,
            required: true
        },
    }, { timestamps: true }
);

const User = mongoose.model('Users', userSchema);

module.exports = User;


