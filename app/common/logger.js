const bunyan = require('bunyan')
const appRoot = require('app-root-path')

const logger = bunyan.createLogger({
  name: 'sequelize swagger',
  streams: [
    {
      level: 'info',
      path: `${appRoot}/logs/info.log`,
      period: '1d'
    }
  ]
})
module.exports = logger
