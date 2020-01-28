const Sequelize = require('sequelize')
const path = require('path')
const walkSync = require('walk-sync')
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
const paths = walkSync(path.resolve(__dirname, './'), {
  globs: ['**/*.js'],
  ignore: ['index.js']
})
paths.forEach((file) => {
  const model = sequelize.import(path.resolve(__dirname, `./${file}`))
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
