const compression = require("compression")
const express = require("express")
const { default: helmet } = require('helmet')
const morgan = require("morgan")
require('dotenv').config()

const app = express()

// middlewares
app.use(helmet())
app.use(morgan("dev"))
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// db
require('./dbs/init.mongodb')

// routes
app.use("/", require("./routes"))

// handle error
app.use((req, res, next) => {
  const error = new Error("Not found")
  error.statusCode = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const code = error.code || statusCode
  const message = error.message || "Internal Server Error"
  res.status(statusCode).json({
    code,
    status: "Error",
    message
  })
})

module.exports = app