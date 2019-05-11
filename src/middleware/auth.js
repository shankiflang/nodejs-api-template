const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')


// Middleware auth : is user identified ?
const auth = async (req, res, next) => {
    try {
        // Check if cookies exists
        if (req.cookies['x-hp'] === undefined || req.cookies['x-s'] === undefined || !req.xhr) {
            res.clearCookie('x-hp', { path: '/' })
            res.clearCookie('x-s', { path: '/' })
            throw new Error('You need to be authentified to perform this action.')
        }

        // Build of token from cookies
        let token = req.cookies['x-hp'] + '.' + req.cookies['x-s']

        // Verify token
        const verifyOptions = {
            expiresIn: "7 days",
            algorithm: ["RS256"]
        }
        const PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, '\n')
        const decoded = await jwt.verify(token, PUBLIC_KEY, verifyOptions)
        

        let user = await User.findById(decoded._id)

        // Token not in bdd
        if (!user) {
            res.clearCookie('x-hp', { path: '/' })
            res.clearCookie('x-s', { path: '/' })
            throw new Error('You need to be authentified to perform this action.')
        }

        // Check if token is valid server-side
        let value = 0
        user.tokens.filter((token) => {
            if (bcrypt.compareSync(decoded.random, token.token) === false) {
                return token
            } else {
                value++
                return token
            }
        })

        // No corresponding random in db
        if (value < 1) {
            res.clearCookie('x-hp', { path: '/' })
            res.clearCookie('x-s', { path: '/' })
            throw new Error('Invalid credentials.')
        }

        // Regenerate token expire time
        res.cookie('x-hp', req.cookies['x-hp'], { sameSite: true, httpOnly: false, secure: false, maxAge: 1000 * 60 * 60 * 2 })

        req.random = decoded.random
        req.token = token
        req.user = user

        next()
    } catch (e) {
        const error = e.message

        res.status(400).send({ error })
    }
}



// Export
module.exports = auth