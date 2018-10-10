const Sequelize = require('sequelize')
const path = require('path')

let env = process.argv[2]
if (!env) env = 'default'
const configPath = path.join(__dirname, '../config', `config.${env}.js`)
let config = require(configPath)

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
