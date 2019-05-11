// Requires
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



// Model
const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    email: {
        required: true,
        unique: true,
        type: String,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 7
    },
    tokens: [{
        token: {
            required: true,
            type: String
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})



// Export model
const User = mongoose.model('User', userSchema)
module.exports = User