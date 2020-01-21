const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors());
app.options('*', cors());  // enable pre-flight
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = require('./db')
const contactRouter = require("./routes/contact-router")

const defaultPort = 8080
const apiPort = process.env.PORT || defaultPort

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// For simple testing purposes.
app.get('/api/version', function (req, res, next) {
    res.status(200).json({ version: "1.0.0", message: "Hello, User!" })
    next()
})

app.use('/api', contactRouter)


app.listen(apiPort, () => console.log(` Backend server running on port ${apiPort}`))
