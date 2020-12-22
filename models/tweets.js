const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = require("./users.js")

const tweetSchema = Schema({
	user: User.username,
	profileimg: User.img,
	title: { type: String, required: true },
	body: { type: String, required: true },
	img: { type: String },
	timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
})

const Tweet = mongoose.model("Tweet", tweetSchema)

module.exports = Tweet
