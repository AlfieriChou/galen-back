const Sequelize = require('sequelize')
const sequelize = new Sequelize('test', 'lvyang', 'zhazhayang', {
  host: '106.15.230.136',
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