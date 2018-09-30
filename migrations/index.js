const path = require('path')
const fs = require('fs')
const _ = require('lodash')
global.Promise = require('bluebird')
const Sequelize = require('sequelize')
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
const queryInterface = sequelize.getQueryInterface()
let tasks = []

fs.readdirSync(__dirname).map(file => {
  if (file !== 'index.js') {
    let migrations = require(path.join(__dirname, file))(queryInterface, Sequelize)
    let funcArray = []
    migrations.map(migration => {
      if (_.isPlainObject(migration)) {
        return funcArray.push(async () => {
          const describe = await queryInterface.describeTable(migration.table)
          if (!describe[migration.field]) {
            return queryInterface.addColumn(migration.table, migration.field, { type: Sequelize[migration.type], after: migration.after })
          }
        })
      }
      return funcArray.push(migration)
    })
    tasks = _.union(tasks, funcArray)
  }
})

Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    console.log('sync db done!')
    process.exit()
  })
