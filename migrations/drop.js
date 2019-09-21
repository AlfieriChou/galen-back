const path = require('path')
const fs = require('fs')
const _ = require('lodash')
global.Promise = require('bluebird')
const Sequelize = require('sequelize')
const appRoot = require('app-root-path')
const queryInterface = require('./index')

let tasks = []
fs.readdirSync(`${appRoot}/migrations/migration`).map((file) => {
  const migrations = require(path.join(`${appRoot}/migrations/migration`, file))(Sequelize)
  const funcArray = []
  migrations.map((migration) => {
    if (_.isPlainObject(migration) && migration.opt === 'drop') {
      return funcArray.push(async () => {
        const tables = await queryInterface.showAllTables()
        if (tables.indexOf(migration.table) > -1) {
          return queryInterface.dropTable(migration.table)
        }
      })
    }
  })
  tasks = _.union(tasks, funcArray)
})
Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    console.log('sync db done!')
    process.exit()
  })
