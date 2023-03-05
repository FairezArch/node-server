const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: {
            type: Number
        },
        Admin: {
            type: Number
        }
    },
    newToken: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)
