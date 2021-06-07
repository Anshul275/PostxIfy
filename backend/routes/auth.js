const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
    try {
        // check if entered user_id already exists in database
        const userIdExist = await User.findOne({ userId: req.body.userId });
        if (userIdExist) {
            return res.status(409).send({ message: "This user_id already exists..." });
        }
        
        //encrypt the password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        // Create the new user and store into database
        const user = new User({
            userId: req.body.userId,
            name: req.body.name,
            password: hashedPassword,
            bio: req.body.bio
        });
        const saveUser = await user.save();
        res.status(201).send({ message: user.userId + " Registered Successfully..." });
    } catch (err) {
        res.status(500).send();
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.body.userId });
        if(!user) {
            return res.status(400).send({ message: "User doesn't exists..." });
        }

        //Check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) {
            return res.status(400).send({ message: "Invalid Password!" });
        }

        // Get a token to be used for requests after login
        const token = jwt.sign({ userId: user.userId }, process.env.TOKEN_SECRET);
        res.status(200).send({
            message: "Login Successful!",
            userId: user.userId,
            TOKEN: token
        });
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;