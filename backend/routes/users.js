const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verifyAccess = require("./verifications/verifyToken");
const verifyOpns = require("./verifications/verifyUserOpns");

const bcrypt = require("bcryptjs");

const { updateUserValidation } = require("./validations/validate");

router.get("/:userId", verifyAccess, async (req, res) => {
	try {
		const user = await User.findOne({ userId: req.params.userId });
		user["password"] = undefined;
		user["otp"] = undefined;
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

router.patch("/:userId", verifyOpns, async (req, res) => {
	const { error } = updateUserValidation(req.body);
	if (error)
		return res.status(400).json({ message: error.details[0].message });
	try {
		const user = await User.findOne({ userId: req.params.userId });

		let user_name = req.body.name;
		let mail = req.body.email;
		let pwd = req.body.password;
		let desc = req.body.bio;

		if (!user_name) user_name = user.name;
		if (!mail) mail = user.email;
		if (!desc) desc = user.bio;
		if (pwd) {
			//encrypt the password before storing
			const salt = await bcrypt.genSalt(10);
			pwd = await bcrypt.hash(pwd, salt);
		} else {
			pwd = user.password;
		}

		const updatedUser = await User.updateOne(
			{ userId: req.params.userId },
			{
				$set: {
					name: user_name,
					email: mail,
					password: pwd,
					bio: desc,
				},
			}
		);
		res.status(200).json({ message: "User Details updated..." });
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

router.delete("/:userId", verifyOpns, async (req, res) => {
	try {
		const removeUser = await User.deleteOne({ userId: req.params.userId });
		const removePosts = await Post.deleteMany({
			userId: req.params.userId,
		});
		res.status(200).json({ message: "User and its posts deleted..." });
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

module.exports = router;
