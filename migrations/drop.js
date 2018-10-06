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
  }
})
Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    console.log('sync db done!')
    process.exit()
  })