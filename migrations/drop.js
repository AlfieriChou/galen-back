const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const Sequelize = require('sequelize')
const queryInterface = require('./index')

let tasks = []
fs.readdirSync(path.resolve(__dirname, './migration')).forEach((file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const migrations = require(path.resolve(`./migration/${file}`))(Sequelize)
  const funcArray = []
  migrations.forEach((migration) => {
    if (_.isPlainObject(migration) && migration.opt === 'drop') {
      funcArray.push(async () => {
        const tables = await queryInterface.showAllTables()
        if (tables.indexOf(migration.table) > -1) {
          queryInterface.dropTable(migration.table)
        }
      })
    }
  })
  tasks = _.union(tasks, funcArray)
})
Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('sync db done!')
    process.exit()
  })
