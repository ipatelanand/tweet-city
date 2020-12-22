const express = require("express")
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

module.exports = home
