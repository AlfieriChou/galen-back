const Sequelize = require('sequelize')
const appRoot = require('app-root-path')
const walkSync = require('walk-sync')

const sequelize = new Sequelize('test', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: false
})

const db = {}
const paths = walkSync(`${appRoot}/app/model`, {
  globs: ['**/*.js'],
  ignore: ['index.js']
})
paths.forEach((file) => {
  const model = sequelize.import(`${appRoot}/app/model/${file}`)
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
