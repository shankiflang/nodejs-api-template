const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Routers imports
const userRouter = require('./routers/user.js')
const authRouter = require('./routers/auth.js')

// Init server
const app = express()
const port = process.env.PORT



// Server accepts
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))



// Routes initialisation
app.use(userRouter)
app.use(authRouter)



// Listen server
app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})