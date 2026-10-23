// config/passport.js

// load all the things we need

const LocalStrategy = require('passport-local').Strategy
const User = require('../app/models/user')

module.exports = function(passport) {

    // Save user ID in session
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    // Retrieve user from session
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => done(null, user))
            .catch(err => done(err))
    })

    // SIGNUP
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async function(req, email, password, done) {
        try {
            const normalizedEmail = email.trim().toLowerCase()

            const existingUser = await User.findOne({
                'local.email': normalizedEmail
            })

            if (existingUser) {
                return done(null, false,
                    req.flash('signupMessage', 'That email is already taken.'))
            }

            if (password.length < 8) {
                return done(null, false,
                    req.flash('signupMessage', 'Password must be at least 8 characters.'))
            }

            const newUser = new User()

            newUser.local.email = normalizedEmail
            newUser.local.password = newUser.generateHash(password)

            await newUser.save()

            return done(null, newUser)

        } catch (err) {
            return done(err)
        }
    }))

    // LOGIN
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async function(req, email, password, done) {
        try {
            const user = await User.findOne({
                'local.email': email.trim().toLowerCase()
            })

            if (!user) {
                return done(null, false,
                    req.flash('loginMessage', 'Invalid email or password.'))
            }

            if (!user.validPassword(password)) {
                return done(null, false,
                    req.flash('loginMessage', 'Invalid email or password.'))
            }

            return done(null, user)

        } catch (err) {
            return done(err)
        }
    }))
}
