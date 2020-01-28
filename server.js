const express = require('express')
const BodyParser = require('body-parser')
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const path = require('path')
const config = require('./config')
const common = require('./app')

const app = express()

app.use(BodyParser.urlencoded({ extended: true }))
app.use(BodyParser.json())

app.use(morgan(app.get('env') === 'production' ? 'combined' : 'dev'))
nunjucks.configure(path.resolve(__dirname, './views'), {
  autoescape: true,
  express: app,
  watch: true
})
app.use(express.static(path.resolve('./public')))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/v1/', common.router)

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.info(`listening on port ${config.port}`)
})

module.exports = app
