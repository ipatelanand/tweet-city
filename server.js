const express = require("express")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const app = express()
const db = mongoose.connection
const session = require("express-session")

require("dotenv").config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

db.on("error", (err) => console.log(err.message + " is Mongod not running?"))
db.on("connected", () => console.log("mongo connected: ", MONGODB_URI))
db.on("disconnected", () => console.log("mongo disconnected"))

app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

const homeController = require("./controllers/home.js")
app.use("/home", homeController)

const userController = require("./controllers/users_controllers.js")
app.use("/user", userController)

const sessionController = require("./controllers/sessions.js")
app.use("/session", sessionController)

app.get("/", (req, res) => {
	res.redirect("/home")
})

app.listen(PORT, () => {
	console.log("Listening on port: ", PORT)
})
