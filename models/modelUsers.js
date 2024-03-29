// user model

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
        //     isOnline: {
        //         type: Boolean,
        //         default: false,
        //         required: true
        //     },
    }, { timestamps: true }
);

const User = mongoose.model('users', userSchema);

module.exports = User;
