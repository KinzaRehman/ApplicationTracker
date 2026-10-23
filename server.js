/* add express and the port stuuff */





require('dotenv').config()

// Set up Express copy stuff from saavavge auth
const express = require('express')
const app = express()

const mongoose = require('mongoose')


const passport = require('passport')

const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { ObjectId } = require('mongodb')

const PORT = process.env.PORT || 3030

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully!')

        // Load Savage Auth routes
        require('./app/routes.js')(app, passport, mongoose.connection.db, ObjectId)

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message)
    })

// Passport configuration from Savage Auth
require('./config/passport')(passport)

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
