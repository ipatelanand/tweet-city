const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = require("./users.js")

const tweetSchema = Schema(
	{
		username: { type: String, required: true },
		title: { type: String, required: true },
		body: { type: String, required: true },
		img: { type: String },
		privacy: Boolean,
	},
	{ timestamps: true }
)

const Tweet = mongoose.model("Tweet", tweetSchema)

module.exports = Tweet
