const mongoose = require("mongoose")
const Schema = mongoose.Schema



const tweetSchema = Schema(
	{
		username: { type: String, required: true },
		title: { type: String },
		body: { type: String, required: true },
		img: { type: String },
		privacy: Boolean,
	},
	{ timestamps: true }
)

const Tweet = mongoose.model("Tweet", tweetSchema)

module.exports = Tweet
