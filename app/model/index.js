const Sequelize = require('sequelize')
const appRoot = require('app-root-path')
const dir = require('dir_filenames')
const config = require('../../config')

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

const db = {}
const paths = dir(`${appRoot}/app/model`)
paths.forEach(file => {
  const model = sequelize.import(file)
  db[model.name] = model
})
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
