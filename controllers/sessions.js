const bcrypt = require("bcrypt")
const express = require("express")
const sessions = express.Router()
const User = require("../models/users.js")

sessions.get("/new", (req, res) => {
	res.render("sessions/new.ejs", {
		currentUser: req.session.currentUser,
	})
})

sessions.post("/", (req, res) => {
	User.findOne({ username: req.body.username }, (err, foundUser) => {
		if (err) {
			console.log(err)
			res.send("oops db had a problem")
		} else if (!foundUser) {
			res.send(
				'<a href="/">Sorry User Not Found. Click Here To Go Back Home</a>'
			)
		} else {
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.currentUser = foundUser
				res.redirect("/")
				// res.redirect(`/home/loggedin/${foundUser._id}`)
			} else {
				res.send(
					'<a href="/">Sorry Incorrect Password. Click Here To Go Back Home</a>'
				)
			}
		}
	})
})

sessions.delete("/", (req, res) => {
	req.session.destroy(() => {
		res.redirect("/")
	})
})

module.exports = sessions
