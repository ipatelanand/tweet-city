const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tweetSchema = Schema({
	title: { type: String, required: true },
	body: { type: String, required: true },
})

const Tweet = mongoose.model("Tweet", tweetSchema)

module.exports = Tweet
