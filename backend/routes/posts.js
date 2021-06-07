const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyAccess = require("./verifications/verifyToken");
const verifyPostOpn = require("./verifications/verifyPostOpns");

router.get("/latestPosts", verifyAccess, async (req, res) => {
    try {
        const posts = await Post.find({}).sort({_id: -1}).limit(100);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get("/mostAdored", verifyAccess, async (req, res) => {
    try {
        const posts = await Post.find({}).sort({likes: -1}).limit(100);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get("/:postId", verifyAccess, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get("/users/:userId", verifyAccess, async (req, res) => {
    try {
        const posts = await Post.find({userId: req.params.userId}).sort({_id: -1});
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post("/", verifyPostOpn, async (req, res) => {
    try {
        const post = await Post.findOne(req.body);
        if(post) {
            res.status(409).json({ message: "Similar Post Found..." });
        }
        else {
            const post = new Post({
                userId: req.body.userId,
                url: req.body.url,
                caption: req.body.caption
            });
            const savePost = await post.save();
            res.status(201).json(savePost);
        }
    } catch (err) {
        res.sendStatus(500).json({ message: err });
    }
});

router.patch("/:postId", verifyPostOpn, async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            { 
                $set: {
                    url: req.body.url,
                    caption: req.body.caption
                }
            }
        );
        res.status(200).json({ message: "Post updated..." });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.patch("/like/:postId", verifyPostOpn, async (req, res) => {
    try {
        const find  = await Post.findById(req.params.postId);
        if(find.likedBy.includes(req.body.userId)) {
            return res.status(400).send({ message: "Access Denied! Already Liked" });
        }
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            {
                $addToSet: { likedBy: [req.body.userId] },
                $inc: { "likes": 1 }
            }
        );
        res.status(200).json({ message: "LIKED" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.patch("/unlike/:postId", verifyPostOpn, async (req, res) => {
    try {
        const find  = await Post.findById(req.params.postId);
        if(!find.likedBy.includes(req.body.userId)) {
            return res.status(400).send({ message: "Access Denied! Already Unliked" });
        }
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            {
                $pull: { likedBy: req.body.userId },
                $inc: { "likes": -1 }
            }
        );
        res.status(200).json({ message: "UNLIKED" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.delete('/:postId', verifyPostOpn, async (req, res) => {
    try{
        const removedPost = await Post.deleteOne({ _id: req.params.postId });
        res.status(200).json(removedPost);
    } catch (err){
        res.status(500).json({ message: err });
    }
});

module.exports = router;