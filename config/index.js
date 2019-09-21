const _ = require('lodash')
const development = require('./config.default')
const release = require('./config.release')
const production = require('./config.prod')

const env = process.env.NODE_ENV || 'development'
const configs = {
  development,
  production,
  release
}
const defaultConfig = {
  env
}
const config = _.merge(defaultConfig, configs[env])

module.exports = config
