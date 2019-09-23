const path = require('path')
const fs = require('fs')
const _ = require('lodash')
global.Promise = require('bluebird')
const Sequelize = require('sequelize')
const appRoot = require('app-root-path')
const queryInterface = require('./index')

let tasks = []
fs.readdirSync(`${appRoot}/migrations/migration`).forEach((file) => {
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  const migrations = require(path.join(`${appRoot}/migrations/migration`, file))(Sequelize)
  /* eslint-enable global-require */
  /* eslint-enable import/no-dynamic-require */
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
