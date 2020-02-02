const development = require('./config.default')
const release = require('./config.release')
const production = require('./config.prod')

const env = process.env.NODE_ENV || 'development'
const configs = {
  development,
  production,
  release
}

module.exports = {
  env,
  ...configs[env]
}
