const express = require('express')
const BodyParser = require('body-parser')
const router = require('./app/routes/index')
const morgan = require('morgan')
const engines = require('consolidate')
const path = require('path')
const config = require('./config')
const common = require('./app')

const app = express()

app.use(BodyParser.urlencoded({ extended: true }))
app.use(BodyParser.json())

app.use(morgan('dev'))

app.use(express.static(path.resolve('./public')))
app.engine('html', engines.mustache)
app.set('view engine', 'html')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/v1/', router)

app.listen(config.port)
console.log(`listening on port ${config.port}`)

module.exports = app
