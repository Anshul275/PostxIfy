const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {
	registerValidation,
	loginValidation,
	forgotPassValidation,
	resetPassValidation,
} = require("./validations/validate");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("generate-password");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GOOGLE_USER,
		pass: process.env.GOOGLE_PASSWORD,
	},
});

router.post("/register", async (req, res) => {
	const { error } = registerValidation(req.body);
	if (error)
		return res.status(400).json({ message: error.details[0].message });
	try {
		// check if entered user_id already exists in database
		const userIdExist = await User.findOne({ userId: req.body.userId });
		if (userIdExist) {
			return res
				.status(409)
				.json({ message: "Provided user_id already taken..." });
		}

		const emailExist = await User.findOne({ email: req.body.email });
		if (emailExist) {
			return res
				.status(409)
				.json({ message: "Provided email_id already taken..." });
		}

		//encrypt the password before storing
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// Create the new user and store into database
		const user = new User({
			userId: req.body.userId,
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			bio: req.body.bio,
		});
		const saveUser = await user.save();
		res.status(201).json({
			message: user.userId + " Registered Successfully...",
		});
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error)
		return res.status(400).json({ message: error.details[0].message });
	try {
		const user = await User.findOne({ userId: req.body.userId });
		if (!user) {
			return res.status(400).json({ message: "User doesn't exists..." });
		}

		//Check if password is correct
		const validPass = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPass) {
			return res.status(400).json({ message: "Invalid Password!" });
		}

		// Get a token to be used for requests after login
		const token = jwt.sign(
			{ userId: user.userId },
			process.env.TOKEN_SECRET
		);
		res.status(200).json({
			message: "Login Successful!",
			userId: user.userId,
			TOKEN: token,
		});
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

router.post("/forgotPassword", async (req, res) => {
	const { error } = forgotPassValidation(req.body);
	if (error)
		return res.status(400).json({ message: error.details[0].message });
	try {
		const user = await User.findOne({ userId: req.body.userId });
		if (!user) {
			return res.status(400).json({ message: "User doesn't exists..." });
		}

		const receipent_email = user.email;
		let password = otpGenerator.generate({
			length: 6,
			numbers: true,
		});

		let html_data = "Hey " + user.userId + ",<br />";
		html_data +=
			"OTP to reset your TrashHUB account password is : <b>" +
			password +
			"</b>\n";
		html_data += "<br /><br />Thanks<br /> TrashHUB Team";

		let details = {
			from: process.env.GOOGLE_USER,
			to: receipent_email,
			subject: "Reset Password",
			html: html_data,
		};

		const res_data = await transporter.sendMail(details);
		let msg = "Otp was sent to : " + receipent_email;
		if (res_data.accepted.length > 0) {
			const updatedUserDetails = await User.updateOne(
				{ userId: req.body.userId },
				{
					$set: {
						otp: password,
					},
				}
			);
			res.status(200).json({ message: msg });
		} else {
			res.status(400).json({ message: "Mail not sent!!" });
		}
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

router.patch("/resetPassword", async (req, res) => {
	const { error } = resetPassValidation(req.body);
	if (error)
		return res.status(400).json({ message: error.details[0].message });
	try {
		const user = await User.findOne({
			userId: req.body.userId,
		});

		if (!user) {
			return res.status(400).json({ message: "User doesn't exists..." });
		}
		if (user.otp != req.body.otp) {
			return res.status(400).json({ message: "Incorrect OTP!!" });
		}

		//encrypt the password before storing
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const updatedUserDetails = await User.updateOne(
			{ userId: req.body.userId },
			{
				$set: {
					otp: "",
					password: hashedPassword,
				},
			}
		);
		res.status(200).json({
			message: "Password was successfully updated....",
		});
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

module.exports = router;
