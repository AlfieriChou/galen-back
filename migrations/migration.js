const path = require('path')
const fs = require('fs')
const _ = require('lodash')
global.Promise = require('bluebird')
const Sequelize = require('sequelize')
const appRoot = require('app-root-path')
const queryInterface = require('./index')

let tasks = []
fs.readdirSync(`${appRoot}/migrations/migration`).map(file => {
  let migrations = require(path.join(`${appRoot}/migrations/migration`, file))(Sequelize)
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
    if (_.isPlainObject(migration) && migration.opt === 'changeColumn') {
      return funcArray.push(async () => {
        const describe = await queryInterface.describeTable(migration.table)
        if (describe[migration.field]) {
          return queryInterface.changeColumn(migration.table, migration.field, migration.type)
        }
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'renameColumn') {
      return funcArray.push(async () => {
        const describe = await queryInterface.describeTable(migration.table)
        if (describe[migration.before]) {
          return queryInterface.renameColumn(migration.table, migration.before, migration.after)
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
    if (_.isPlainObject(migration) && migration.opt === 'addIndex') {
      return funcArray.push(async () => {
        return queryInterface.addIndex(migration.table, migration.attributes, migration.options)
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'query') {
      return funcArray.push(async () => {
        return queryInterface.sequelize.query(migration.sql)
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
