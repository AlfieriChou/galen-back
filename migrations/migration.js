const path = require('path')
const fs = require('fs')
const _ = require('lodash')
global.Promise = require('bluebird')
const Sequelize = require('sequelize')
const queryInterface = require('./index')
const files = ['index.js', 'drop.js', 'migration.js']

let tasks = []
fs.readdirSync(__dirname).map(file => {
  if (files.indexOf(file) < 0) {
    let migrations = require(path.join(__dirname, file))(Sequelize)
    let funcArray = []
    migrations.map(migration => {
      if (_.isPlainObject(migration) && migration.opt === 'create') {
        return funcArray.push(async () => {
          const tables = await queryInterface.showAllTables()
          if (tables.indexOf(migration.table) < 0) {
            return queryInterface.createTable(migration.table, migration.column, { charset: 'utf8' })
          }
        })
      }
      if (_.isPlainObject(migration) && migration.opt === 'addColumn') {
        return funcArray.push(async () => {
          const describe = await queryInterface.describeTable(migration.table)
          if (!describe[migration.field]) {
            return queryInterface.addColumn(migration.table, migration.field, Object.assign(migration.type, { after: migration.after }))
          }
        })
      }
      if (_.isPlainObject(migration) && migration.opt === 'removeColumn') {
        return funcArray.push(async () => {
          const describe = await queryInterface.describeTable(migration.table)
          if (describe[migration.field]) {
            return queryInterface.removeColumn(migration.table, migration.field)
          }
        })
      }
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
