const Sequelize = require('sequelize')
const path = require('path')

let env = process.argv[2]
if (!env) env = 'default'
const configPath = path.join(__dirname, '../config', `config.${env}.js`)
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const config = require(configPath)
/* eslint-enable global-require */
/* eslint-enable import/no-dynamic-require */

const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
  host: config.mysql.host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: false
})
const queryInterface = sequelize.getQueryInterface()
module.exports = queryInterface
