const express = require("express")
const Tweet = require("../models/tweets")
const home = express.Router()

const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
		return next()
	} else {
		res.redirect("/session/new")
	}
}

home.get("/", (req, res) => {
	res.render("home.ejs", {
		currentUser: req.session.currentUser,
	})
})

home.get('/new', isAuthenticated, (req, res) => {
	res.render('tweets/new.ejs', {
	  currentUser = req.session.currentUser
  })
})

home.get("/seed", isAuthenticated, (req, res) => {
	Tweet.create(
		[
			{
				username: req.session.currentUser.username,
				userimg: req.session.currentUser.img,
				title: "Test Tweet",
				body: "This is a test",
			},
		],
		(err, data) => {
			res.send(data)
		}
	)
})

module.exports = home
