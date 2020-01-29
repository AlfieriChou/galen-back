const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const Sequelize = require('sequelize')
const queryInterface = require('./index')

const tasks = fs.readdirSync(
  path.resolve(__dirname, './migration')
).reduce((ret, file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const migrations = require(path.resolve(__dirname, `./migration/${file}`))(Sequelize)
  const funcArr = migrations.reduce((funcArray, migration) => {
    if (_.isPlainObject(migration) && migration.opt === 'create') {
      funcArray.push(async () => {
        const tables = await queryInterface.showAllTables()
        if (!tables.includes(_.snakeCase(migration.table))) {
          queryInterface.createTable(
            _.snakeCase(migration.table),
            Object.entries(migration.column).reduce((acc, [key, value]) => {
              acc[_.snakeCase(key)] = value
              return acc
            }, {}),
            { charset: 'utf8' }
          )
        }
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'addColumn') {
      funcArray.push(async () => {
        const describe = await queryInterface.describeTable(
          _.snakeCase(migration.table)
        )
        if (!describe[_.snakeCase(migration.field)]) {
          queryInterface.addColumn(
            _.snakeCase(migration.table),
            _.snakeCase(migration.field),
            Object.assign(
              migration.type,
              { after: _.snakeCase(migration.after) }
            )
          )
        }
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'changeColumn') {
      funcArray.push(async () => {
        const describe = await queryInterface.describeTable(_.snakeCase(migration.table))
        if (describe[_.snakeCase(migration.field)]) {
          queryInterface.changeColumn(
            _.snakeCase(migration.table),
            _.snakeCase(migration.field),
            migration.type
          )
        }
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'renameColumn') {
      funcArray.push(async () => {
        const describe = await queryInterface.describeTable(_.snakeCase(migration.table))
        if (describe[_.snakeCase(migration.before)]) {
          queryInterface.renameColumn(
            _.snakeCase(migration.table),
            _.snakeCase(migration.before),
            _.snakeCase(migration.after)
          )
        }
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'removeColumn') {
      funcArray.push(async () => {
        const describe = await queryInterface.describeTable(_.snakeCase(migration.table))
        if (describe[_.snakeCase(migration.field)]) {
          queryInterface.removeColumn(
            _.snakeCase(migration.table),
            _.snakeCase(migration.field)
          )
        }
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'addIndex') {
      funcArray.push(async () => queryInterface.addIndex(
        _.snakeCase(migration.table),
        migration.attributes,
        migration.options
      ))
    }
    if (_.isPlainObject(migration) && migration.opt === 'removeIndex') {
      funcArray.push(async () => {
        if (migration.attributes.length === 1) {
          queryInterface.removeIndex(
            _.snakeCase(migration.table),
            migration.attributes[0]
          )
        }
        queryInterface.removeColumn(
          _.snakeCase(migration.table),
          migration.attributes
        )
      })
    }
    if (_.isPlainObject(migration) && migration.opt === 'query') {
      funcArray.push(async () => queryInterface.sequelize.query(migration.sql))
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
  console.log('sync done!')
  process.exit()
})
