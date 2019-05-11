const express = require('express')

// Routers imports
// const authRouter = require('./routers/auth.js')

// Init server
const app = express()
const port = process.env.PORT



// Server accepts
app.use(express.json())



// Routes initialisation
// app.use(authRouter)



// Listen server
app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})