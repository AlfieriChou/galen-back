const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const Sequelize = require('sequelize')
const queryInterface = require('./index')

const tasks = fs.readdirSync(
  path.resolve(__dirname, './migration')
).reduce((ret, file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const migrations = require(path.resolve(`./migration/${file}`))(Sequelize)
  const funcArr = migrations.reduce((funcArray, migration) => {
    if (_.isPlainObject(migration) && migration.opt === 'drop') {
      funcArray.push(async () => {
        const tables = await queryInterface.showAllTables()
        if (tables.indexOf(migration.table) > -1) {
          queryInterface.dropTable(migration.table)
        }
      })
    }
    return funcArray
  }, [])
  return [
    ...ret,
    ...funcArr
  ]
}, [])

Promise.resolve(
  tasks
    .reduce(async (promise, task) => {
      await promise
      await task()
    }, Promise.resolve())
).then(() => {
  // eslint-disable-next-line no-console
  console.log('sync done!')
  process.exit()
})
