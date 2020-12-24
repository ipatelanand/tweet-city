const bcrypt = require("bcrypt")
const express = require("express")
const users = express.Router()
const User = require("../models/users.js")

users.get("/new", (req, res) => {
	res.render("users/new.ejs", {
		currentUser: req.session.currentUser,
	})
})

users.post("/", (req, res) => {
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
	User.create(req.body, (err, createdUser) => {
		console.log(err)
		console.log("User was created", createdUser)
		res.redirect("/")
	})
})

users.get("/edit/:id", (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		res.render("users/edit.ejs", {
			currentUser: req.session.currentUser,
			id: foundUser,
		})
	})
})

users.post("/edit/:id", (req, res) => {
	User.findByIdAndUpdate(
		req.params.id,
		{ $set: { password: req.body.password } },
		{ new: true },
		(err, updatedUser) => {
			if (err) {
				console.log(err)
			} else {
				res.redirect("/")
			}
		}
	)
})

module.exports = users
