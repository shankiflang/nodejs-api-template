require('../db/mongoose')
const User = require('../models/user')
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const sharp = require('sharp')

// Middlewares
const auth = require('../middleware/auth')

// Router declaration
const router = new express.Router()



// User routes
// ->
// Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        res.status(201).send({ success: true, user })
    } catch (e) {
        const error = e.message
        res.status(400).send({ success: false, error })
    }
})

// Get user
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send({ success: true, user: req.user })
    } catch (e) {
        const error = e.message
        res.status(400).send({ success: false, error })
    }
})

// Update user
router.patch('/users/me', auth, async (req, res) => {
    try {
        // Validate params
        let allowedUpdates = ['name', 'email', 'password']
        let updates = Object.keys(req.body)

        let valid = updates.every(update => allowedUpdates.includes(update))

        if (!valid) {
            throw new Error('Invalid arguments')
        }

        // Update user
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        
        res.send({ success: true, user: req.user })
    } catch (e) {
        const error = e.message
        res.status(400).send({ success: false, error })
    }
})

// Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        const id = req.user._id
        await User.findByIdAndDelete(id)

        res.send({ success: true })
    } catch (e) {
        const error = e.message
        res.status(400).send({ success: false, error })
    }
})

const upload = multer({
    limits: {
        fileSize: 2048000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return callback(new Error('File must be an image'))
        }

        callback(undefined, true)
    }
})

// Set user's avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
        req.user.avatar = buffer
        req.user.save()

        res.send()
    } catch (e) {
        const error = e.message
        res.status(400).send({ success: false, error })
    }
})

// Get user avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)



        if (!user || !user.avatar) {
            throw new Error('No user or avatar.')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        const error = e.message
        res.status(400).send({ success: false, error })
    }
})


// Export
module.exports = router