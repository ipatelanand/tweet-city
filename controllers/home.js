const express = require("express")
const Tweet = require("../models/tweets")
const User = require("../models/users")
const home = express.Router()

const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
		return next()
	} else {
		res.redirect("/session/new")
	}
}

const findTweetsByUser = (id, page, req, res) => {
	User.findById(id, (err, userId) => {
		Tweet.find({ username: userId.username }, (err, allTweetsFromUser) => {
			res.render(page, {
				view_user: userId,
				tweets: allTweetsFromUser,
			})
		})
	})
}

home.get("/", (req, res) => {
	res.render("home.ejs", {
		currentUser: req.session.currentUser,
	})
})

home.get("/allusers", (req, res) => {
	User.find({}, (err, data) => {
		res.render("users/show_all.ejs", {
			currentUser: req.session.currentUser,
			data: data,
		})
	})
})

home.get("/new", isAuthenticated, (req, res) => {
	res.render("tweets/new.ejs", {
		currentUser: req.session.currentUser,
	})
})

home.get("/user/show/:id", (req, res) => {
	findTweetsByUser(req.params.id, "users/indiv_page.ejs", req, res)
})

home.post("/", isAuthenticated, (req, res) => {
	Tweet.create(req.body, (err, newTweet) => {
		res.redirect("/")
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
			res.redirect("/")
		}
	)
})

module.exports = home
