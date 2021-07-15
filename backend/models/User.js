const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			max: 10,
			unique: true,
			required: true,
		},
		name: {
			type: String,
			max: 20,
			required: true,
		},
		email: {
			type: String,
			min: 6,
			max: 30,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			max: 75,
		},
		otp: {
			type: String,
			max: 6,
		},
	},
	{ versionKey: false }
);

module.exports = mongoose.model("users", UserSchema);
