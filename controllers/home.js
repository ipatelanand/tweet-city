const express = require("express")
const Tweet = require("../models/tweets")
const User = require("../models/users")
const home = express.Router()
const async = require("async")

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

// const showAllTweetsFollowing = (currentUserId, page, req, res) => {
// 	User.findById(currentUserId, (err, curUse) => {
// 		const followsIdArr = curUse.following

// 		// const insideFunc = (Arr) => {
// 		// 	let followersTweets = []
// 		// 	for (let i = 0; i < followsIdArr.length; i++) {
// 		// 		User.findById(followsIdArr[i], (err, foundUser) => {
// 		// 			Tweet.find(
// 		// 				{ username: foundUser.username },
// 		// 				(err, allTweetsFromUser) => {
// 		// 					// console.log(allTweetsFromUser, i)
// 		// 					return allTweetsFromUser
// 		// 				}
// 		// 			)
// 		// 		})
// 		// 	}
// 		// }

// 		const getTweets = (ArrId) => {
// 			let index = 0
// 			let tweets = []
// 			User.findById(ArrId[index], (err, foundUser) => {
// 				Tweet.find({ username: foundUser.username }, (err, foundTweets) => {
// 					tweets.push(foundTweets)
// 				})
// 			})
// 			console.log(tweets)
// 		}

// 		getTweets(followsIdArr)
// 		// console.log(insideFunc(followsIdArr))

// 		// console.log(tweets)
// 		res.render(page, {
// 			currentUser: req.session.currentUser,
// 			// tweets: tweets,
// 		})
// 	})
// }

home.get("/", (req, res) => {
	res.render("home.ejs", {
		currentUser: req.session.currentUser,
	})
})

home.get("/loggedin/:id", (req, res) => {
	res.render("users/user_home.ejs", {
		currentUser: req.session.currentUser,

		Tweet: Tweet,
	})
})

home.get("/loggedin/:id/:data", (req, res) => {
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

home.get("/user/show/:id", (req, res) => {
	findTweetsByUser(req.params.id, "users/indiv_page.ejs", req, res)
})

home.post("/:id", isAuthenticated, (req, res) => {
	Tweet.create(req.body, (err, newTweet) => {
		res.redirect("/loggedin/req.params.id")
	})
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
