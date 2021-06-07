const mongoose = require('mongoose');

// Database - Schema to store users info
const UserSchema = mongoose.Schema({
        userId: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            min: 6,
            required: true
        },
        bio: {
            type: String
        }
    },
    { versionKey: false }
);

module.exports = mongoose.model("users", UserSchema);