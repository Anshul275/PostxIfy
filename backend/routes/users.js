const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verifyAccess = require("./verifications/verifyToken");
const verifyDelete = require("./verifications/verifyUserDelete");

// verified
router.get("/:userId", verifyAccess, async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(200).json({ message: "User not present in database....." });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// verified
router.delete('/:userId', verifyDelete, async (req, res) => {
    try{
        // also there must be password to delete those posts
        const removeUser = await User.deleteOne({ userId: req.params.userId });
        const removePosts = await Post.deleteMany({ userId: req.params.userId });
        res.status(200).json({ message: "User and its posts deleted..." });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;