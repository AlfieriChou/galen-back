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

const paths = walkSync(path.resolve(__dirname, './'), {
  globs: ['**/*.js'],
  ignore: ['index.js']
})
const db = paths.reduce((ret, file) => {
  const model = sequelize.import(path.resolve(__dirname, `./${file}`))
  // eslint-disable-next-line no-param-reassign
  ret[model.name] = model
  return ret
}, {})
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
