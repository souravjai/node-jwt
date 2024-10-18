const express = require('express')
const httpErrors = require('http-errors')
const morgan = require('morgan')
const AuthRoute = require('./route/Auth.route')
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const app = express()

app.use(morgan(process.env.LOGGER_TYPE || 'tiny'))


app.get("/", async (req, res, next) => {
    res.send("Welcome to JWT-Backend")
})

//Pluggin Auth routes
app.use('/auth', AuthRoute)


// This is a catch all route to catch all incoming routes that were not handled above
app.use(async (req, res, next) => {
    next(httpErrors.NotFound())
})



// This is a Global error handler for routes
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Internal Server Error!"

    res.status(status).send({
        error: {
            status,
            message
        }
    })
})

app.listen(PORT, () => {
    console.log(`App running at ${3000}`)
})