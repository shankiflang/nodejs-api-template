require('../db/mongoose')
const User = require('../models/user')
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')

// Router declaration
const router = new express.Router()



// User routes
// ->
// Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        res.status(201).send({ user })
    } catch (e) {
        const error = e.message

        res.status(400).send({ error })
    }
})

// Get user
router.get('/users/me', async (req, res) => {

})

// Update user
router.patch('/users/me', async (req, res) => {

})

// Delete user
router.delete('/users/me', async (req, res) => {

})

// Set user's avatar
router.post('/users/me/avatar', async (req, res) => {

})



// Export
module.exports = router