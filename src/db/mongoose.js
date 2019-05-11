const mongoose = require('mongoose')

// Connect to db
function mongooseConnect () {
    mongoose.connect(process.env.DB_ADRESS, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }, function (err) {
        if (err) {
            console.error('Failed to connect to mongo - retrying in 2 seconds...', err)
        } else {
            console.info('Connected to database.')
        }
    })
}

mongooseConnect()