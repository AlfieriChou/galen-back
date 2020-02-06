const Sequelize = require('sequelize')
const path = require('path')
const dir = require('dir_filenames')
const {
  mysql: {
    host, database, user, password
  }
} = require('../../config')

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: false
})

const paths = dir(path.resolve(__dirname, './')).filter(n => !n.endsWith('index.js'))
const db = paths.reduce((ret, file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const model = require(file).createModel(sequelize)
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
