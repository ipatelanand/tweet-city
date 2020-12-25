const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	biography: { type: String },
	backgroundimg:{type: String} ,
	img: { type: String },
	followers: { type: Array },
	following: { type: Array },
})

const User = mongoose.model("User", userSchema)

module.exports = User
