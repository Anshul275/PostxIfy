const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			max: 10,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		caption: {
			type: String,
			max: 75,
			required: true,
		},
		likedBy: {
			type: Array,
			default: [],
		},
		likes: {
			type: Number,
			default: 0,
		},
		date: {
			type: String,
			default: Date.now,
		},
	},
	{ versionKey: false }
);

module.exports = mongoose.model("posts", PostSchema);
