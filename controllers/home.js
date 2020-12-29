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
				currentUser: req.session.currentUser,
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

home.get("/loggedin/:id", isAuthenticated, (req, res) => {
	res.render("users/user_home.ejs", {
		currentUser: req.session.currentUser,
		Tweet: Tweet,
	})
})

home.get("/loggedin/:id/:data", isAuthenticated, (req, res) => {
	let data = req.params.data.split(",")
	console.log(data)

	Tweet.find({ username: data }, (err, alltweets) => {
		res.render("users/user_home_tweets.ejs", {
			currentUser: req.session.currentUser,
			tweets: alltweets,
		})
	})
})

home.get("/allusers", isAuthenticated, (req, res) => {
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

home.get("/user/show/:id", isAuthenticated, (req, res) => {
	findTweetsByUser(req.params.id, "users/indiv_page.ejs", req, res)
})

home.post("/:id", isAuthenticated, (req, res) => {
	Tweet.create(req.body, (err, newTweet) => {
		res.redirect(
			`/home/loggedin/<%=currentUser._id%>/<%=currentUser.following%>`
		)
	})
})

home.get("/editTweet/:id", (req, res) => {
	res.render("tweets/edit.ejs", {
		currentUser: req.session.currentUser,
		tweet_id: req.params.id,
	})
})

home.post("/editTweet/:id", (req, res) => {
	Tweet.findByIdAndUpdate(
		req.params.id,
		{ $set: { body: req.body.body, img: req.body.img } },
		{ new: true },
		(err, updatedTweet) => {
			res.redirect("/")
		}
	)
})

home.post("/:currentUser/addFollower/:id", isAuthenticated, (req, res) => {
	User.findByIdAndUpdate(
		req.params.currentUser,
		{ $push: { following: req.params.id } },
		(err, newFollower) => {
			res.redirect("/")
		}
	)
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
