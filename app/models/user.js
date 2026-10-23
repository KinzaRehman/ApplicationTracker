// load the things we need

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// User schema - same structure as Savage Auth
const userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    }
})

// Hash password before storing it
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 10)
}

// Compare entered password with saved password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
}

//1 email / user
userSchema.index({ 'local.email': 1 }, { unique: true })

module.exports = mongoose.model('User', userSchema)
