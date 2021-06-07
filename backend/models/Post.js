const mongoose = require('mongoose');

// Database - Schema to store user's post info
const PostSchema = mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            required: true
        },
        likedBy: {
            type: Array,
            default: []
        },
        likes: {
            type: Number,
            default: 0
        },
        date: {
            type: String,
            default: Date.now
        }
    },
    { versionKey: false }
);

module.exports = mongoose.model("posts", PostSchema);